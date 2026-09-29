import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import type { Conversation } from '../../types';
import { MessageBubble } from './MessageBubble';
import { SystemEvent } from './SystemEvent';
import { AISummary } from '../ai/AISummary';
import { IntentDetection } from '../ai/IntentDetection';
import { aiSummaries, aiIntents } from '../../data/ai';

export function MessageThread({ conversation }: { conversation: Conversation }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const summary = aiSummaries[conversation.id];
  const intent = aiIntents[conversation.id];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [conversation.id, conversation.messages.length]);

  const sourceMessages = summary
    ? conversation.messages.filter((m) => summary.sourceMessageIds.includes(m.id))
    : [];

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', py: '22px', backgroundColor: '#F7F8FA' }}>
      {summary && <AISummary summary={summary} sourceMessages={sourceMessages} />}
      {intent && <IntentDetection intent={intent} />}

      {conversation.messages.map((message) =>
        message.type === 'system' ? (
          <SystemEvent key={message.id} message={message} />
        ) : (
          <MessageBubble key={message.id} message={message} />
        ),
      )}
      <div ref={bottomRef} />
    </Box>
  );
}
