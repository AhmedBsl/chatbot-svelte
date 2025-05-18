import { Send } from 'lucide-react';

interface WelcomeScreenProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export const WelcomeScreen = ({ 
  input, 
  setInput, 
  handleSubmit, 
  isLoading 
}: WelcomeScreenProps) => (
  <div className="flex items-center justify-center flex-1 px-4">
    <div className="w-full max-w-3xl mx-auto text-center">
      <h1 className="mb-6 text-7xl font-bold gradient-text">
        TanStack Chat
      </h1>
      <p className="w-2/3 mx-auto mb-8 text-lg text-gray-400">
        Powered by Google's Gemini AI. Ask me anything, and I'll do my best to help.
      </p>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
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
            className="w-full py-4 pl-5 pr-12 text-white placeholder-gray-400 rounded-xl resize-none glass focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
            rows={3}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute p-2 text-indigo-400 transition-all -translate-y-1/2 rounded-lg right-3 top-1/2 hover:text-indigo-300 hover:bg-indigo-500/10 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  </div>
)