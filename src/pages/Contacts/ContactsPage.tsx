import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';
import ButtonBase from '@mui/material/ButtonBase';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import { contacts } from '../../data/contacts';
import { ContactAvatar } from '../../components/common/ContactAvatar';
import { ChannelIcon } from '../../components/common/ChannelIcon';
import { EmptyState } from '../../components/common/EmptyState';
import { formatRelativeTime } from '../../utils/format';
import { channelMeta } from '../../utils/meta';

export function ContactsPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Contacts</Typography>
          <Typography variant="body2" color="text.secondary">
            {contacts.length} customers across all channels
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.75,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            width: { xs: '100%', sm: 280 },
          }}
        >
          <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <InputBase
            placeholder="Search contacts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            sx={{ fontSize: '0.8125rem' }}
          />
        </Box>
      </Box>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<PeopleAltRoundedIcon />}
          title="No contacts found"
          description={`We couldn't find anyone matching "${query}".`}
        />
      ) : isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filtered.map((c) => (
            <ButtonBase
              key={c.id}
              onClick={() => navigate(`/contacts/${c.id}`)}
              sx={{ display: 'block', width: '100%', textAlign: 'left', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}
            >
              <Box sx={{ display: 'flex', gap: 1.25 }}>
                <ContactAvatar name={c.name} color={c.avatarColor} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                    {c.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                    {c.phone ?? c.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.75, alignItems: 'center', flexWrap: 'wrap' }}>
                    <ChannelIcon channel={c.primaryChannel} withTooltip={false} size={13} />
                    <Typography variant="caption" color="text.disabled">
                      {channelMeta[c.primaryChannel].label} · {formatRelativeTime(c.lastInteraction)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </ButtonBase>
          ))}
        </Box>
      ) : (
        <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Primary channel</TableCell>
                <TableCell>Last interaction</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => (
                <TableRow
                  key={c.id}
                  hover
                  onClick={() => navigate(`/contacts/${c.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <ContactAvatar name={c.name} color={c.avatarColor} size={32} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                          {c.name}
                        </Typography>
                        {c.company && (
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                            {c.company}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {c.phone ?? '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                      {c.email ?? ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <ChannelIcon channel={c.primaryChannel} withTooltip={false} size={13} />
                      <Typography variant="body2">{channelMeta[c.primaryChannel].label}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatRelativeTime(c.lastInteraction)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={c.status === 'active' ? 'Active' : 'Dormant'}
                      sx={{
                        backgroundColor: c.status === 'active' ? 'success.light' : 'action.hover',
                        color: c.status === 'active' ? 'success.dark' : 'text.secondary',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
                      {c.tags.slice(0, 2).map((tag) => (
                        <Chip key={tag} size="small" label={tag} variant="outlined" />
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
