import { useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import { useNavigate } from 'react-router-dom';
import { contacts } from '../../data/contacts';
import { conversations } from '../../data/conversations';
import { campaigns } from '../../data/campaigns';
import { channelConfigs } from '../../data/channels';
import { getContactById } from '../../data/contacts';
import { EmptyState } from './EmptyState';

interface SearchGroupItem {
  id: string;
  label: string;
  sublabel: string;
  onSelect: () => void;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    setQuery('');
  };

  const q = query.trim().toLowerCase();

  const conversationResults = useMemo<SearchGroupItem[]>(() => {
    if (!q) return [];
    return conversations
      .filter((c) => {
        const contact = getContactById(c.contactId);
        return (
          contact?.name.toLowerCase().includes(q) ||
          c.lastMessagePreview.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .slice(0, 4)
      .map((c) => {
        const contact = getContactById(c.contactId);
        return {
          id: c.id,
          label: contact?.name ?? 'Unknown contact',
          sublabel: c.lastMessagePreview,
          onSelect: () => {
            navigate(`/inbox?conversation=${c.id}`);
            handleClose();
          },
        };
      });
  }, [q, navigate]);

  const contactResults = useMemo<SearchGroupItem[]>(() => {
    if (!q) return [];
    return contacts
      .filter((c) => c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q))
      .slice(0, 4)
      .map((c) => ({
        id: c.id,
        label: c.name,
        sublabel: c.company ?? c.phone ?? '',
        onSelect: () => {
          navigate(`/contacts/${c.id}`);
          handleClose();
        },
      }));
  }, [q, navigate]);

  const campaignResults = useMemo<SearchGroupItem[]>(() => {
    if (!q) return [];
    return campaigns
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((c) => ({
        id: c.id,
        label: c.name,
        sublabel: c.audienceLabel,
        onSelect: () => {
          navigate(`/campaigns/${c.id}`);
          handleClose();
        },
      }));
  }, [q, navigate]);

  const channelResults = useMemo<SearchGroupItem[]>(() => {
    if (!q) return [];
    return channelConfigs
      .filter((c) => c.displayName.toLowerCase().includes(q))
      .map((c) => ({
        id: c.channel,
        label: c.displayName,
        sublabel: c.connectionLabel,
        onSelect: () => {
          navigate('/channels');
          handleClose();
        },
      }));
  }, [q, navigate]);

  const totalResults =
    conversationResults.length + contactResults.length + campaignResults.length + channelResults.length;

  const groups: { title: string; icon: React.ElementType; items: SearchGroupItem[] }[] = [
    { title: 'Conversations', icon: ForumRoundedIcon, items: conversationResults },
    { title: 'Contacts', icon: PersonOutlineRoundedIcon, items: contactResults },
    { title: 'Campaigns', icon: CampaignRoundedIcon, items: campaignResults },
    { title: 'Channels', icon: HubRoundedIcon, items: channelResults },
  ];

  return (
    <>
      <ButtonBase
        onClick={() => setOpen(true)}
        aria-label="Open global search"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.85,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          color: 'text.secondary',
          minWidth: { xs: 40, sm: 300 },
          justifyContent: { xs: 'center', sm: 'flex-start' },
          transition: 'border-color 140ms ease, box-shadow 140ms ease',
          '&:hover': {
            borderColor: 'primary.light',
            boxShadow: '0 0 0 3px rgba(26,107,255,0.08)',
          },
        }}
      >
        <SearchRoundedIcon fontSize="small" />
        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Search conversations, contacts, campaigns…
        </Typography>
      </ButtonBase>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { borderRadius: 2, overflow: 'hidden' } } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <InputBase
            autoFocus
            fullWidth
            placeholder="Search conversations, contacts, campaigns, channels…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ fontSize: '0.9375rem' }}
            inputProps={{ 'aria-label': 'Search InfinityConnect' }}
          />
        </Box>
        <Box sx={{ maxHeight: 420, overflowY: 'auto' }}>
          {!q && (
            <EmptyState
              icon={<SearchRoundedIcon />}
              title="Search across InfinityConnect"
              description="Find conversations, contacts, campaigns, and channels instantly."
              compact
            />
          )}
          {q && totalResults === 0 && (
            <EmptyState
              icon={<SearchRoundedIcon />}
              title="No results found"
              description={`We couldn't find anything matching "${query}". Try a different name or keyword.`}
              compact
            />
          )}
          {q &&
            groups.map((group, idx) =>
              group.items.length > 0 ? (
                <Box key={group.title}>
                  {idx > 0 && <Divider />}
                  <Typography
                    variant="overline"
                    sx={{ display: 'block', px: 2, pt: 1.5, pb: 0.5, color: 'text.disabled' }}
                  >
                    {group.title}
                  </Typography>
                  {group.items.map((item) => (
                    <ButtonBase
                      key={item.id}
                      onClick={item.onSelect}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 2,
                        py: 1,
                        textAlign: 'left',
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      <group.icon fontSize="small" style={{ color: 'var(--mui-palette-text-secondary)' }} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                          {item.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                          {item.sublabel}
                        </Typography>
                      </Box>
                    </ButtonBase>
                  ))}
                </Box>
              ) : null,
            )}
        </Box>
      </Dialog>
    </>
  );
}
