import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import type { Conversation } from '../../types';
import { ConversationListItem } from './ConversationListItem';
import { EmptyState } from '../common/EmptyState';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  loading?: boolean;
  isSearching?: boolean;
}

export function ConversationList({ conversations, selectedId, onSelect, loading, isSearching }: ConversationListProps) {
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.25, mb: 2.5 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={18} />
              <Skeleton variant="text" width="90%" height={16} />
              <Skeleton variant="text" width="40%" height={14} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (conversations.length === 0) {
    return isSearching ? (
      <EmptyState
        icon={<SearchOffRoundedIcon />}
        title="No matching conversations"
        description="Try a different name, keyword, or filter."
        compact
      />
    ) : (
      <EmptyState
        icon={<InboxRoundedIcon />}
        title="No conversations here"
        description="Conversations matching this filter will appear here as they come in."
        compact
      />
    );
  }

  return (
    <Box role="list" aria-label="Conversations" sx={{ display: 'flex', flexDirection: 'column', gap: '12px', p: '12px' }}>
      {conversations.map((c) => (
        <ConversationListItem key={c.id} conversation={c} selected={c.id === selectedId} onSelect={() => onSelect(c.id)} />
      ))}
    </Box>
  );
}
