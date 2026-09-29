import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import { InboxFilters, type InboxFilterKey } from '../../components/inbox/InboxFilters';
import { ConversationList } from '../../components/inbox/ConversationList';
import { ConversationHeader } from '../../components/conversations/ConversationHeader';
import { MessageThread } from '../../components/conversations/MessageThread';
import { Composer } from '../../components/conversations/Composer';
import { SuggestedReply } from '../../components/ai/SuggestedReply';
import { CustomerContextPanel } from '../../components/customer/CustomerContextPanel';
import { EmptyState } from '../../components/common/EmptyState';
import { useConversations } from '../../context/ConversationsContext';
import { useCurrentAgent } from '../../context/RoleContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { getContactById } from '../../data/contacts';
import { aiSuggestedReplies } from '../../data/ai';
import type { Conversation } from '../../types';
import { color } from '../../theme/tokens';

const LIST_WIDTH = 400;

function matchesFilter(conversation: Conversation, filter: InboxFilterKey, currentAgentId?: string): boolean {
  switch (filter) {
    case 'assigned_to_me':
      return conversation.assigneeId === currentAgentId;
    case 'unassigned':
      return !conversation.assigneeId;
    case 'waiting':
      return conversation.status === 'waiting';
    case 'escalated':
      return conversation.status === 'escalated';
    case 'resolved':
      return conversation.status === 'resolved';
    default:
      return true;
  }
}

export function InboxPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { conversations, sendMessage, markRead } = useConversations();
  const currentAgent = useCurrentAgent();
  const { notify } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InboxFilterKey>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [contextDrawerOpen, setContextDrawerOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'thread'>('list');
  const [prefill, setPrefill] = useState<{ text: string; version: number }>({ text: '', version: 0 });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 420);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const deepLinkId = searchParams.get('conversation');
    if (deepLinkId) {
      setSelectedId(deepLinkId);
      setMobileView('thread');
      searchParams.delete('conversation');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return conversations
      .filter((c) => matchesFilter(c, filter, currentAgent?.id))
      .filter((c) => {
        if (!q) return true;
        const contact = getContactById(c.contactId);
        return contact?.name.toLowerCase().includes(q) || c.lastMessagePreview.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }, [conversations, filter, query, currentAgent?.id]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: conversations.length };
    (['assigned_to_me', 'unassigned', 'waiting', 'escalated', 'resolved'] as InboxFilterKey[]).forEach((f) => {
      c[f] = conversations.filter((conv) => matchesFilter(conv, f, currentAgent?.id)).length;
    });
    return c;
  }, [conversations, currentAgent?.id]);

  const selectedConversation = conversations.find((c) => c.id === selectedId);
  const contact = selectedConversation ? getContactById(selectedConversation.contactId) : undefined;
  const suggestion = selectedConversation ? aiSuggestedReplies[selectedConversation.id] : undefined;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    markRead(id);
    setMobileView('thread');
    setPrefill({ text: '', version: 0 });
  };

  const handleSend = (text: string, isInternal: boolean) => {
    if (!selectedConversation) return;
    sendMessage(selectedConversation.id, {
      direction: 'outbound',
      sender: currentAgent?.name ?? 'Agent',
      text,
      channel: selectedConversation.channel,
      timestamp: new Date().toISOString(),
      type: isInternal ? 'internal_note' : 'text',
      isInternal,
      deliveryStatus: isInternal ? undefined : 'sent',
    });
    notify(isInternal ? 'Internal note added' : 'Message sent');
  };

  const listPane = (
    <Box
      sx={{
        width: isMobile ? '100%' : LIST_WIDTH,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: { sm: '1px solid' },
        borderColor: 'divider',
        backgroundColor: color.bgRail,
      }}
    >
      <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Inbox
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Conversations across WhatsApp, SMS, Email & RCS
        </Typography>
      </Box>
      <InboxFilters filter={filter} onFilterChange={setFilter} query={query} onQueryChange={setQuery} counts={counts} />
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <ConversationList
          conversations={filtered}
          selectedId={selectedId}
          onSelect={handleSelect}
          loading={loading}
          isSearching={query.trim().length > 0}
        />
      </Box>
    </Box>
  );

  const workspacePane = selectedConversation && contact ? (
    <Box
      key={selectedConversation.id}
      className="ic-fade-up"
      sx={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'background.paper' }}
    >
      <ConversationHeader
        conversation={selectedConversation}
        onBack={isMobile ? () => setMobileView('list') : undefined}
        onOpenContext={() => setContextDrawerOpen(true)}
        showContextButton={!isDesktop}
      />
      <MessageThread conversation={selectedConversation} />
      {suggestion && (
        <SuggestedReply
          suggestion={suggestion}
          onUse={(text) => setPrefill({ text, version: prefill.version + 1 })}
          onEdit={(text) => setPrefill({ text, version: prefill.version + 1 })}
        />
      )}
      <Composer
        channel={selectedConversation.channel}
        prefillText={prefill.text}
        prefillVersion={prefill.version}
        disabled={selectedConversation.status === 'resolved'}
        onSend={handleSend}
      />
    </Box>
  ) : (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        height: '100%',
        background: `radial-gradient(circle at 70% 30%, ${color.primarySurface} 0%, transparent 45%), ${color.bgSubtle}`,
      }}
    >
      <EmptyState
        icon={<ForumRoundedIcon />}
        title="Select a conversation"
        description="Choose a conversation from the list to view the customer context and reply across channels."
      />
    </Box>
  );

  const contextPane = contact ? (
    <Box
      sx={{
        width: 300,
        flexShrink: 0,
        height: '100%',
        borderLeft: '1px solid',
        borderColor: 'divider',
        backgroundColor: color.bgRail,
      }}
    >
      <CustomerContextPanel contactId={contact.id} compact />
    </Box>
  ) : null;

  const contextDrawer = (
    <Drawer
      anchor="right"
      open={contextDrawerOpen}
      onClose={() => setContextDrawerOpen(false)}
      slotProps={{ paper: { sx: { width: { xs: '88%', sm: 340 }, backgroundColor: color.bgRail } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1">Customer context</Typography>
        <IconButton size="small" onClick={() => setContextDrawerOpen(false)} aria-label="Close customer context">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
      {contact && <CustomerContextPanel contactId={contact.id} compact />}
    </Drawer>
  );

  if (isMobile) {
    return (
      <Box sx={{ height: '100%', overflow: 'hidden' }}>
        {mobileView === 'list' ? listPane : workspacePane}
        {contextDrawer}
      </Box>
    );
  }

  if (!isDesktop) {
    return (
      <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {listPane}
        {workspacePane}
        {contextDrawer}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {listPane}
      {workspacePane}
      {contextPane}
    </Box>
  );
}
