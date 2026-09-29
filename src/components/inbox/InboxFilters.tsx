import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InputBase from '@mui/material/InputBase';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { inboxFilterOrder } from '../../utils/meta';
import { color } from '../../theme/tokens';

export type InboxFilterKey = 'all' | 'assigned_to_me' | 'unassigned' | 'waiting' | 'escalated' | 'resolved';

interface InboxFiltersProps {
  filter: InboxFilterKey;
  onFilterChange: (filter: InboxFilterKey) => void;
  query: string;
  onQueryChange: (q: string) => void;
  counts: Record<string, number>;
}

export function InboxFilters({ filter, onFilterChange, query, onQueryChange, counts }: InboxFiltersProps) {
  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ px: 2, pt: 0.5, pb: 1.25 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.75,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: color.bgSurface,
            transition: 'border-color 140ms ease, box-shadow 140ms ease',
            '&:focus-within': {
              borderColor: color.primary,
              boxShadow: `0 0 0 3px ${color.primarySurface}`,
            },
          }}
        >
          <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <InputBase
            placeholder="Search conversations"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            fullWidth
            sx={{ fontSize: '0.8125rem' }}
            inputProps={{ 'aria-label': 'Search conversations' }}
          />
        </Box>
      </Box>
      <Tabs
        value={filter}
        onChange={(_, v) => onFilterChange(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="Inbox filters"
        sx={{
          px: 0.5,
          minHeight: 40,
          '& .MuiTabs-scrollButtons': {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {inboxFilterOrder.map((f) => (
          <Tab
            key={f.key}
            value={f.key}
            label={`${f.label}${counts[f.key] ? ` (${counts[f.key]})` : ''}`}
            sx={{ minHeight: 40, px: 1.25 }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
