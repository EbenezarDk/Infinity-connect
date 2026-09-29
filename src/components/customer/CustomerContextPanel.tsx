import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { getContactById } from '../../data/contacts';
import { getConversationsForContact } from '../../data/conversations';
import { CustomerIdentity } from './CustomerIdentity';
import { ConversationHistoryList, ActivityList } from './CustomerTimeline';
import { getConversationHistoryForContact, getActivityForContact } from '../../utils/customerInsights';
import { EmptyState } from '../common/EmptyState';
import { formatDateTimeLabel } from '../../utils/format';
import { color, layout } from '../../theme/tokens';

type ContextTab = 'overview' | 'conversations' | 'activity' | 'notes' | 'tags';

interface CustomerContextPanelProps {
  contactId: string;
  compact?: boolean;
  hideProfileLink?: boolean;
}

export function CustomerContextPanel({ contactId, compact, hideProfileLink }: CustomerContextPanelProps) {
  const [tab, setTab] = useState<ContextTab>('overview');
  const [noteDraft, setNoteDraft] = useState('');
  const [localNotes, setLocalNotes] = useState<{ id: string; text: string; timestamp: string }[]>([]);
  const [tags, setTags] = useState<string[] | null>(null);
  const [tagDraft, setTagDraft] = useState('');

  const contact = getContactById(contactId);

  const internalNotes = useMemo(() => {
    const convos = getConversationsForContact(contactId);
    const notes: { id: string; text: string; timestamp: string }[] = [];
    convos.forEach((c) =>
      c.messages
        .filter((m) => m.isInternal)
        .forEach((m) => notes.push({ id: m.id, text: m.text, timestamp: m.timestamp })),
    );
    return [...notes, ...localNotes].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [contactId, localNotes]);

  const history = useMemo(() => getConversationHistoryForContact(contactId), [contactId]);
  const activity = useMemo(() => getActivityForContact(contactId), [contactId]);
  const currentTags = tags ?? contact?.tags ?? [];

  if (!contact) {
    return <EmptyState title="Customer not found" description="This contact may have been removed." compact />;
  }

  const addNote = () => {
    if (!noteDraft.trim()) return;
    setLocalNotes((prev) => [{ id: `note-${Date.now()}`, text: noteDraft.trim(), timestamp: new Date().toISOString() }, ...prev]);
    setNoteDraft('');
  };

  const addTag = () => {
    if (!tagDraft.trim()) return;
    setTags([...(currentTags ?? []), tagDraft.trim()]);
    setTagDraft('');
  };

  const removeTag = (tag: string) => {
    setTags(currentTags.filter((t) => t !== tag));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          height: layout.inboxHeaderHeight,
          minHeight: layout.inboxHeaderHeight,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-end',
          borderBottom: '1px solid #D4D4D4',
          px: '12px',
          flexShrink: 0,
          backgroundColor: color.bgSurface,
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            minHeight: 44,
            width: '100%',
            '& .MuiTabs-indicator': {
              height: 2,
              borderRadius: '4px 4px 0 0',
              backgroundColor: color.primary,
            },
            '& .MuiTab-root': {
              minHeight: 44,
              height: 44,
              px: 1.5,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: '18px',
              color: color.textSecondary,
              '&.Mui-selected': { color: color.primary },
            },
          }}
        >
          <Tab value="overview" label="Overview" />
          <Tab value="conversations" label="Conversations" />
          <Tab value="activity" label="Activity" />
          <Tab value="notes" label="Notes" />
          <Tab value="tags" label="Tags" />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: compact ? 2 : 2.5 }}>
        {tab === 'overview' && (
          <CustomerIdentity contact={contact} compact={compact} hideProfileLink={hideProfileLink} />
        )}

        {tab === 'conversations' && <ConversationHistoryList entries={history} />}

        {tab === 'activity' && <ActivityList events={activity} />}

        {tab === 'notes' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add an internal note about this customer…"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                multiline
                maxRows={3}
              />
              <Button variant="contained" size="small" onClick={addNote} disabled={!noteDraft.trim()}>
                Add
              </Button>
            </Box>
            {internalNotes.length === 0 ? (
              <EmptyState title="No internal notes" description="Notes added by your team about this customer will appear here." compact />
            ) : (
              internalNotes.map((n) => (
                <Box
                  key={n.id}
                  sx={{ p: 1.25, borderRadius: 1.5, backgroundColor: '#FCF6E8', border: '1px dashed', borderColor: '#E4C87A' }}
                >
                  <Typography variant="body2" sx={{ color: '#4A3B10' }}>
                    {n.text}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8A6D1F' }}>
                    {formatDateTimeLabel(n.timestamp)}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        )}

        {tab === 'tags' && (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a tag (e.g. VIP, Payment issue)"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
              />
              <IconButton onClick={addTag} disabled={!tagDraft.trim()} aria-label="Add tag" color="primary">
                <AddRoundedIcon />
              </IconButton>
            </Box>
            {currentTags.length === 0 ? (
              <EmptyState title="No tags yet" description="Tags help your team quickly identify important context." compact />
            ) : (
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {currentTags.map((tag) => (
                  <Chip key={tag} label={tag} onDelete={() => removeTag(tag)} size="small" variant="outlined" />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
