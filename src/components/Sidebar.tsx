import { PlusCircle, MessageCircle, Trash2, Edit2 } from 'lucide-react';

interface SidebarProps {
  conversations: Array<{ id: string; title: string }>;
  currentConversationId: string | null;
  handleNewChat: () => void;
  setCurrentConversationId: (id: string) => void;
  handleDeleteChat: (id: string) => void;
  editingChatId: string | null;
  setEditingChatId: (id: string | null) => void;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  handleUpdateChatTitle: (id: string, title: string) => void;
}

export const Sidebar = ({ 
  conversations, 
  currentConversationId, 
  handleNewChat, 
  setCurrentConversationId, 
  handleDeleteChat, 
  editingChatId, 
  setEditingChatId, 
  editingTitle, 
  setEditingTitle, 
  handleUpdateChatTitle 
}: SidebarProps) => (
  <div className="flex flex-col w-64 glass border-r border-indigo-500/10">
    <div className="p-4">
      <button
        onClick={handleNewChat}
        className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <PlusCircle className="w-4 h-4" />
        New Chat
      </button>
    </div>

    <div className="flex-1 overflow-y-auto">
      {conversations.map((chat) => (
        <div
          key={chat.id}
          className={`group flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800/30 transition-colors ${
            chat.id === currentConversationId ? 'bg-gray-800/50' : ''
          }`}
          onClick={() => setCurrentConversationId(chat.id)}
        >
          <MessageCircle className="w-4 h-4 text-gray-400" />
          {editingChatId === chat.id ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onFocus={(e) => e.target.select()}
              onBlur={() => {
                if (editingTitle.trim()) {
                  handleUpdateChatTitle(chat.id, editingTitle)
                }
                setEditingChatId(null)
                setEditingTitle('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && editingTitle.trim()) {
                  handleUpdateChatTitle(chat.id, editingTitle)
                } else if (e.key === 'Escape') {
                  setEditingChatId(null)
                  setEditingTitle('')
                }
              }}
              className="flex-1 text-sm text-white bg-transparent focus:outline-none"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm text-gray-300 truncate">
              {chat.title}
            </span>
          )}
          <div className="items-center hidden gap-1 group-hover:flex">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setEditingChatId(chat.id)
                setEditingTitle(chat.title)
              }}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteChat(chat.id)
              }}
              className="p-1 text-gray-400 hover:text-pink-500 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)