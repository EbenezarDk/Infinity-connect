import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { notifications as seedNotifications } from '../../data/notifications';
import { formatRelativeTime } from '../../utils/format';
import { color } from '../../theme/tokens';
import { EmptyState } from './EmptyState';
import type { NotificationItem } from '../../types';

const kindIcon: Record<NotificationItem['kind'], React.ElementType> = {
  escalation: ErrorRoundedIcon,
  campaign: CampaignRoundedIcon,
  channel: HubRoundedIcon,
  sla: ScheduleRoundedIcon,
  assignment: PersonAddAltRoundedIcon,
};

const kindColor: Record<NotificationItem['kind'], string> = {
  escalation: color.error,
  campaign: color.success,
  channel: color.warning,
  sla: color.warning,
  assignment: color.primary,
};

export function NotificationsMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [items] = useState<NotificationItem[]>(seedNotifications);
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label={`Notifications, ${unreadCount} unread`}>
          <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0}>
            <NotificationsNoneRoundedIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 360, maxHeight: 480, borderRadius: 2 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1">Notifications</Typography>
        </Box>
        <Divider />
        {items.length === 0 ? (
          <EmptyState title="You're all caught up" description="No new notifications." compact />
        ) : (
          <Box sx={{ overflowY: 'auto', maxHeight: 400 }}>
            {items.map((n) => {
              const Icon = kindIcon[n.kind];
              return (
                <Box
                  key={n.id}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: n.read ? 'transparent' : 'background.default',
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${kindColor[n.kind]}14`,
                      color: kindColor[n.kind],
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: 16 }} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {n.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                      {n.description}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                      {formatRelativeTime(n.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Popover>
    </>
  );
}
