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
    <Box sx={{ borderBottom: `1px solid ${color.border}`, px: { xs: 2, sm: '22px' }, pt: 0, pb: 0 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          height: 44,
          px: 2,
          backgroundColor: color.bgSubtle,
          borderRadius: 0,
        }}
      >
        <SearchRoundedIcon sx={{ fontSize: 20, color: color.textSecondary }} />
        <InputBase
          placeholder="Search conversation"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          fullWidth
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: color.textPrimary,
            '& input::placeholder': { color: color.textSecondary, opacity: 1 },
          }}
          inputProps={{ 'aria-label': 'Search conversations' }}
        />
      </Box>

      <Tabs
        value={filter}
        onChange={(_, v) => onFilterChange(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="Inbox filters"
        sx={{
          minHeight: 0,
          pt: '22px',
          '& .MuiTabs-flexContainer': { gap: 0 },
          '& .MuiTabs-indicator': {
            height: 2,
            borderRadius: '4px 4px 0 0',
            backgroundColor: color.primary,
          },
          '& .MuiTabs-scrollButtons': {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {inboxFilterOrder.map((f) => {
          const count = counts[f.key];
          const label = count ? `${f.label}  (${count})` : f.label;
          return (
            <Tab
              key={f.key}
              value={f.key}
              label={label}
              sx={{
                minHeight: 0,
                minWidth: 0,
                px: 1.5,
                py: 0,
                pb: '4px',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: '18px',
                color: color.textSecondary,
                '&.Mui-selected': {
                  color: color.primary,
                },
              }}
            />
          );
        })}
      </Tabs>
    </Box>
  );
}
