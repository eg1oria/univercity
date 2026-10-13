import { createContext, useContext, useState, type ReactNode } from 'react';

import { initialChats, type Chat } from '@/data/mock';
import { formatTime } from '@/lib/date';

type ChatStore = {
  chats: Chat[];
  send: (chatId: string, text: string) => void;
  markRead: (chatId: string) => void;
};

const ChatContext = createContext<ChatStore>({
  chats: initialChats,
  send: () => {},
  markRead: () => {},
});

/** Keeps conversations in memory, so sent messages survive navigation. */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState(initialChats);

  const send = (chatId: string, text: string) => {
    const time = formatTime(new Date());
    setChats((current) => {
      const chat = current.find((item) => item.id === chatId);
      if (!chat) return current;
      const updated: Chat = {
        ...chat,
        lastAt: time,
        messages: [
          ...chat.messages,
          { id: `${chatId}-${chat.messages.length + 1}`, from: 'me', text, time },
        ],
      };
      // The conversation with the newest message moves to the top of the list.
      return [updated, ...current.filter((item) => item.id !== chatId)];
    });
  };

  const markRead = (chatId: string) => {
    setChats((current) => {
      if (!current.some((chat) => chat.id === chatId && chat.unread > 0)) return current;
      return current.map((chat) => (chat.id === chatId ? { ...chat, unread: 0 } : chat));
    });
  };

  return <ChatContext value={{ chats, send, markRead }}>{children}</ChatContext>;
}

export function useChats() {
  return useContext(ChatContext);
}
