import { createServerFn } from '@tanstack/react-start'
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const DEFAULT_SYSTEM_PROMPT = `You are TanStack Chat, an AI assistant using Markdown for clear and structured responses. Format your responses following these guidelines:

1. Use headers for sections:
   # For main topics
   ## For subtopics
   ### For subsections

2. For lists and steps:
   - Use bullet points for unordered lists
   - Number steps when sequence matters
   
3. For code:
   - Use inline \`code\` for short snippets
   - Use triple backticks with language for blocks:
   \`\`\`python
   def example():
       return "like this"
   \`\`\`

4. For emphasis:
   - Use **bold** for important points
   - Use *italics* for emphasis
   - Use > for important quotes or callouts

5. For structured data:
   | Use | Tables |
   |-----|---------|
   | When | Needed |

6. Break up long responses with:
   - Clear section headers
   - Appropriate spacing between sections
   - Bullet points for better readability
   - Short, focused paragraphs

7. For technical content:
   - Always specify language for code blocks
   - Use inline \`code\` for technical terms
   - Include example usage where helpful

Keep responses concise and well-structured. Use appropriate Markdown formatting to enhance readability and understanding.`

export const genAIResponse = createServerFn({ method: 'GET', response: 'raw' })
  .validator(
    (d: {
      messages: Array<Message>
      systemPrompt?: { value: string; enabled: boolean }
    }) => d,
  )
  .handler(async ({ data }) => {
    // Check for API key in environment variables
    const apiKey = process.env.GOOGLE_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY

    if (!apiKey) {
      throw new Error(
        'Missing API key: Please set VITE_GOOGLE_API_KEY in your environment variables.'
      )
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Filter out error messages and empty messages
    const formattedMessages = data.messages
      .filter(
        (msg) =>
          msg.content.trim() !== '' &&
          !msg.content.startsWith('Sorry, I encountered an error'),
      )
      .map((msg) => ({
        role: msg.role,
        parts: msg.content.trim(),
      }))

    if (formattedMessages.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid messages to send' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = data.systemPrompt?.enabled
      ? `${DEFAULT_SYSTEM_PROMPT}\n\n${data.systemPrompt.value}`
      : DEFAULT_SYSTEM_PROMPT

    try {
      // Start a new chat
      const chat = model.startChat({
        history: formattedMessages.slice(0, -1).map(msg => ({
          role: msg.role,
          parts: msg.parts,
        })),
        generationConfig: {
          maxOutputTokens: 4096,
        },
      })

      // Get the response stream
      const result = await chat.sendMessageStream(formattedMessages[formattedMessages.length - 1].parts)

      // Create a TransformStream to handle the streaming response
      const stream = new TransformStream({
        async transform(chunk, controller) {
          const text = chunk.text()
          controller.enqueue(
            new TextEncoder().encode(
              JSON.stringify({
                type: 'content_block_delta',
                delta: { text },
              }) + '\n'
            )
          )
        },
      })

      // Pipe the response through our transform stream
      result.stream().pipeThrough(stream)

      return new Response(stream.readable)
    } catch (error) {
      console.error('Error in genAIResponse:', error)
      
      let errorMessage = 'Failed to get AI response'
      let statusCode = 500
      
      if (error instanceof Error) {
        if (error.message.includes('quota')) {
          errorMessage = 'API quota exceeded. Please try again later.'
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error occurred. Please check your internet connection.'
          statusCode = 503
        } else if (error.message.includes('key')) {
          errorMessage = 'Invalid API key. Please check your Google API key.'
          statusCode = 401
        } else {
          errorMessage = error.message
        }
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.name : undefined
      }), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  })