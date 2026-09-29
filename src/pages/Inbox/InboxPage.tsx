import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import { useSearchParams } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { InboxFilters, type InboxFilterKey } from '../../components/inbox/InboxFilters';
import { ConversationList } from '../../components/inbox/ConversationList';
import { CollapsedInboxRail } from '../../components/inbox/CollapsedInboxRail';
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
import { getAgentById } from '../../data/agents';
import { aiSuggestedReplies } from '../../data/ai';
import type { Conversation } from '../../types';
import { color } from '../../theme/tokens';

const LIST_WIDTH_DEFAULT = 374;
const LIST_WIDTH_MIN = 280;
const LIST_WIDTH_MAX = 640;
const LIST_WIDTH_COLLAPSED = 56;
const LIST_WIDTH_STORAGE_KEY = 'ic-inbox-list-width';

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

function readStoredWidth(): number {
  try {
    const raw = localStorage.getItem(LIST_WIDTH_STORAGE_KEY);
    if (!raw) return LIST_WIDTH_DEFAULT;
    const n = Number(raw);
    if (!Number.isFinite(n)) return LIST_WIDTH_DEFAULT;
    return Math.min(LIST_WIDTH_MAX, Math.max(LIST_WIDTH_MIN, n));
  } catch {
    return LIST_WIDTH_DEFAULT;
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
  const [assigneeFilter, setAssigneeFilter] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [contextDrawerOpen, setContextDrawerOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'thread'>('list');
  const [prefill, setPrefill] = useState<{ text: string; version: number }>({ text: '', version: 0 });

  const [listWidth, setListWidth] = useState(readStoredWidth);
  const [listCollapsed, setListCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(LIST_WIDTH_DEFAULT);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 420);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const deepLinkId = searchParams.get('conversation');
    const assigneeId = searchParams.get('assignee');
    let changed = false;

    if (deepLinkId) {
      setSelectedId(deepLinkId);
      setMobileView('thread');
      searchParams.delete('conversation');
      changed = true;
    }

    if (assigneeId) {
      setAssigneeFilter(assigneeId);
      setFilter('all');
      setMobileView('list');
      searchParams.delete('assignee');
      changed = true;
    }

    if (changed) {
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!assigneeFilter) return;
    const first = conversations
      .filter((c) => c.assigneeId === assigneeFilter && c.status !== 'resolved')
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())[0];
    if (first && !selectedId) {
      setSelectedId(first.id);
      if (!isMobile) setMobileView('thread');
    }
  }, [assigneeFilter, conversations, selectedId, isMobile]);

  useEffect(() => {
    if (listCollapsed) return;
    try {
      localStorage.setItem(LIST_WIDTH_STORAGE_KEY, String(listWidth));
    } catch {
      /* ignore */
    }
  }, [listWidth, listCollapsed]);

  const onResizeMove = useCallback((event: MouseEvent) => {
    const delta = event.clientX - dragStartX.current;
    const next = Math.min(LIST_WIDTH_MAX, Math.max(LIST_WIDTH_MIN, dragStartWidth.current + delta));
    setListWidth(next);
  }, []);

  const onResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', onResizeMove);
    window.removeEventListener('mouseup', onResizeEnd);
  }, [onResizeMove]);

  const onResizeStart = (event: React.MouseEvent) => {
    if (listCollapsed) return;
    event.preventDefault();
    dragStartX.current = event.clientX;
    dragStartWidth.current = listWidth;
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onResizeMove);
    window.addEventListener('mouseup', onResizeEnd);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onResizeMove);
      window.removeEventListener('mouseup', onResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [onResizeMove, onResizeEnd]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return conversations
      .filter((c) => matchesFilter(c, filter, currentAgent?.id))
      .filter((c) => (assigneeFilter ? c.assigneeId === assigneeFilter : true))
      .filter((c) => {
        if (!q) return true;
        const contact = getContactById(c.contactId);
        return contact?.name.toLowerCase().includes(q) || c.lastMessagePreview.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }, [conversations, filter, query, currentAgent?.id, assigneeFilter]);

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

  const effectiveListWidth = isMobile ? '100%' : listCollapsed ? LIST_WIDTH_COLLAPSED : listWidth;

  const listPane = (
    <Box
      sx={{
        width: effectiveListWidth,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRight: { sm: `0.5px solid ${color.border}` },
        backgroundColor: color.bgSurface,
        transition: isResizing ? 'none' : 'width 180ms ease',
      }}
    >
      {listCollapsed && !isMobile ? (
        <CollapsedInboxRail
          conversations={filtered}
          selectedId={selectedId}
          onExpand={() => setListCollapsed(false)}
          onSelect={handleSelect}
        />
      ) : (
        <>
          <Box
            sx={{
            px: { xs: 2, sm: '22px' },
            pt: { xs: 2, sm: '22px' },
            pb: 1.5,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1,
            borderBottom: 'none',
          }}
        >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: 700,
                  lineHeight: '26px',
                  letterSpacing: '0.036px',
                  color: '#000314',
                }}
              >
                Inbox
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  lineHeight: '18px',
                  color: color.textSecondary,
                }}
              >
                Conversations across WhatsApp, SMS, Email & RCS
              </Typography>
            </Box>
            {!isMobile && (
              <Tooltip title="Collapse inbox list">
                <IconButton
                  size="small"
                  onClick={() => setListCollapsed(true)}
                  aria-label="Collapse inbox list"
                  sx={{ mt: 0.25, color: color.textSecondary }}
                >
                  <ChevronLeftRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <InboxFilters filter={filter} onFilterChange={setFilter} query={query} onQueryChange={setQuery} counts={counts} />
          {assigneeFilter && (
            <Box sx={{ px: '22px', pt: 1.5, pb: 0 }}>
              <Chip
                size="small"
                label={`Assigned to ${getAgentById(assigneeFilter)?.name ?? 'agent'}`}
                onDelete={() => setAssigneeFilter(undefined)}
                sx={{
                  fontWeight: 700,
                  backgroundColor: color.primarySurface,
                  color: color.primary,
                  '& .MuiChip-deleteIcon': { color: color.primary },
                }}
              />
            </Box>
          )}
          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pt: '22px' }}>
            <ConversationList
              conversations={filtered}
              selectedId={selectedId}
              onSelect={handleSelect}
              loading={loading}
              isSearching={query.trim().length > 0}
            />
          </Box>
        </>
      )}

      {!isMobile && !listCollapsed && (
        <Box
          onMouseDown={onResizeStart}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize inbox list"
          aria-valuenow={listWidth}
          aria-valuemin={LIST_WIDTH_MIN}
          aria-valuemax={LIST_WIDTH_MAX}
          sx={{
            position: 'absolute',
            top: 0,
            right: -3,
            width: 6,
            height: '100%',
            cursor: 'col-resize',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            '&::after': {
              content: '""',
              width: isResizing ? 2 : 1,
              height: '100%',
              backgroundColor: isResizing ? color.primary : 'transparent',
              borderRadius: 1,
              transition: 'background-color 120ms ease',
            },
            '&:hover::after': {
              backgroundColor: color.primary,
            },
          }}
        />
      )}
    </Box>
  );

  const workspacePane = selectedConversation && contact ? (
    <Box
      key={selectedConversation.id}
      className="ic-fade-up"
      sx={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#F7F8FA' }}
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
        width: 320,
        flexShrink: 0,
        height: '100%',
        borderLeft: `1px solid ${color.border}`,
        backgroundColor: color.bgSurface,
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
