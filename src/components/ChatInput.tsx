import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput = ({ 
  input, 
  setInput, 
  handleSubmit, 
  isLoading 
}: ChatInputProps) => (
  <div className="fixed bottom-0 right-0 left-64 glass border-t border-indigo-500/10">
    <div className="w-full max-w-4xl px-6 py-4 mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="Ask me anything..."
            className="w-full py-3.5 pl-4 pr-12 text-sm text-white placeholder-gray-400 rounded-xl resize-none glass focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
            rows={1}
            style={{ minHeight: '50px', maxHeight: '200px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = Math.min(target.scrollHeight, 200) + 'px'
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute p-2 text-indigo-400 transition-all -translate-y-1/2 rounded-lg right-2 top-1/2 hover:text-indigo-300 hover:bg-indigo-500/10 disabled:opacity-50 disabled:hover:bg-transparent group-focus-within:text-indigo-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  </div>
)