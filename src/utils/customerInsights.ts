import type { ActivityEvent, ConversationHistoryEntry } from '../types';
import { getConversationsForContact } from '../data/conversations';

function inferActivityKind(text: string): ActivityEvent['kind'] {
  const t = text.toLowerCase();
  if (t.includes('escalat')) return 'escalation';
  if (t.includes('assigned')) return 'assignment';
  if (t.includes('matched')) return 'identity_match';
  if (t.includes('resolved')) return 'resolution';
  return 'note';
}

function shortLabel(text: string, max = 44): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function getConversationHistoryForContact(contactId: string): ConversationHistoryEntry[] {
  const convos = getConversationsForContact(contactId);
  return convos
    .map((c) => {
      const firstInbound = c.messages.find((m) => m.direction === 'inbound' && m.type !== 'system');
      const label = c.subject ?? shortLabel(firstInbound?.text ?? c.lastMessagePreview);
      return { channel: c.channel, label, date: c.lastMessageAt, conversationId: c.id };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getActivityForContact(contactId: string): ActivityEvent[] {
  const convos = getConversationsForContact(contactId);
  const events: ActivityEvent[] = [];
  convos.forEach((c) => {
    c.messages
      .filter((m) => m.type === 'system')
      .forEach((m) => {
        events.push({ id: m.id, label: m.text, timestamp: m.timestamp, kind: inferActivityKind(m.text) });
      });
  });
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
