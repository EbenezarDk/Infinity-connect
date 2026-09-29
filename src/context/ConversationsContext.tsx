import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Conversation, ConversationStatus, Message } from '../types';
import { conversations as seedConversations } from '../data/conversations';

interface ConversationsContextValue {
  conversations: Conversation[];
  assign: (conversationId: string, agentId: string, agentName: string) => void;
  escalate: (conversationId: string) => void;
  resolve: (conversationId: string) => void;
  setStatus: (conversationId: string, status: ConversationStatus) => void;
  sendMessage: (conversationId: string, message: Omit<Message, 'id' | 'conversationId'>) => void;
  markRead: (conversationId: string) => void;
}

const ConversationsContext = createContext<ConversationsContextValue | undefined>(undefined);

let messageCounter = 1000;

function cloneSeed(): Conversation[] {
  return structuredClone(seedConversations);
}

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(cloneSeed);

  // Merge newly added seed conversations and refresh list-sort metadata from seed
  // without wiping in-session mutations on message history.
  const seedStamp = seedConversations.map((c) => `${c.id}:${c.lastMessageAt}:${c.lastMessagePreview}`).join('|');
  useEffect(() => {
    setConversations((prev) => {
      const byId = new Map(prev.map((c) => [c.id, c]));
      let changed = false;
      for (const seed of seedConversations) {
        const existing = byId.get(seed.id);
        if (!existing) {
          byId.set(seed.id, structuredClone(seed));
          changed = true;
          continue;
        }
        if (
          existing.lastMessageAt !== seed.lastMessageAt ||
          existing.lastMessagePreview !== seed.lastMessagePreview ||
          existing.unread !== seed.unread ||
          existing.slaMinutesRemaining !== seed.slaMinutesRemaining
        ) {
          byId.set(seed.id, {
            ...existing,
            lastMessageAt: seed.lastMessageAt,
            lastMessagePreview: seed.lastMessagePreview,
            unread: seed.unread,
            slaMinutesRemaining: seed.slaMinutesRemaining,
            priority: seed.priority,
          });
          changed = true;
        }
      }
      return changed ? Array.from(byId.values()) : prev;
    });
  }, [seedStamp]);

  const addSystemEvent = (conv: Conversation, text: string): Conversation => ({
    ...conv,
    messages: [
      ...conv.messages,
      {
        id: `m-sys-${messageCounter++}`,
        conversationId: conv.id,
        direction: 'outbound',
        sender: 'System',
        text,
        channel: conv.channel,
        timestamp: new Date().toISOString(),
        type: 'system',
      },
    ],
  });

  const assign = useCallback((conversationId: string, agentId: string, agentName: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const updated: Conversation = { ...c, assigneeId: agentId, status: c.status === 'new' ? 'assigned' : c.status };
        return addSystemEvent(updated, `Conversation assigned to ${agentName}`);
      }),
    );
  }, []);

  const escalate = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const updated: Conversation = { ...c, status: 'escalated', priority: 'urgent' };
        return addSystemEvent(updated, 'Conversation escalated to Supervisor');
      }),
    );
  }, []);

  const resolve = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const updated: Conversation = { ...c, status: 'resolved', unread: 0 };
        return addSystemEvent(updated, 'Conversation marked as resolved');
      }),
    );
  }, []);

  const setStatus = useCallback((conversationId: string, status: ConversationStatus) => {
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, status } : c)));
  }, []);

  const sendMessage = useCallback((conversationId: string, message: Omit<Message, 'id' | 'conversationId'>) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const newMessage: Message = { ...message, id: `m-out-${messageCounter++}`, conversationId };
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessagePreview: message.isInternal ? c.lastMessagePreview : message.text,
          lastMessageAt: newMessage.timestamp,
          status: c.status === 'new' || c.status === 'waiting' ? 'in_progress' : c.status,
        };
      }),
    );
  }, []);

  const markRead = useCallback((conversationId: string) => {
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)));
  }, []);

  const value = useMemo<ConversationsContextValue>(
    () => ({ conversations, assign, escalate, resolve, setStatus, sendMessage, markRead }),
    [conversations, assign, escalate, resolve, setStatus, sendMessage, markRead],
  );

  return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>;
}

export function useConversations(): ConversationsContextValue {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error('useConversations must be used within ConversationsProvider');
  return ctx;
}
