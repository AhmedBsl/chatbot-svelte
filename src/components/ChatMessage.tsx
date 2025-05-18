import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import type { Message } from '../utils/ai'

export const ChatMessage = ({ message }: { message: Message }) => (
  <div
    className={`py-6 ${
      message.role === 'assistant'
        ? 'bg-indigo-500/5'
        : 'bg-transparent'
    } message-animation`}
  >
    <div className="flex items-start w-full max-w-4xl gap-4 mx-auto px-6">
      {message.role === 'assistant' ? (
        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500">
          AI
        </div>
      ) : (
        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-medium text-white glass rounded-lg">
          Y
        </div>
      )}
      <div className="flex-1 min-w-0 prose">
        <ReactMarkdown
          rehypePlugins={[
            rehypeRaw,
            rehypeSanitize,
            rehypeHighlight,
          ]}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  </div>
)