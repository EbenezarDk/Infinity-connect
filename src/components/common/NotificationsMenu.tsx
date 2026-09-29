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

interface NotificationsMenuProps {
  /** Prefer opening the panel to the right (e.g. collapsed inbox rail). */
  placement?: 'bottom-end' | 'right-start';
}

export function NotificationsMenu({ placement = 'bottom-end' }: NotificationsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [items] = useState<NotificationItem[]>(seedNotifications);
  const unreadCount = items.filter((n) => !n.read).length;

  const anchorOrigin =
    placement === 'right-start'
      ? ({ vertical: 'top', horizontal: 'right' } as const)
      : ({ vertical: 'bottom', horizontal: 'right' } as const);
  const transformOrigin =
    placement === 'right-start'
      ? ({ vertical: 'top', horizontal: 'left' } as const)
      : ({ vertical: 'top', horizontal: 'right' } as const);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label={`Notifications, ${unreadCount} unread`}
          sx={{ p: 1 }}
        >
          <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0}>
            <NotificationsNoneRoundedIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxHeight: 480,
              borderRadius: 2,
              border: `1px solid ${color.border}`,
              boxShadow: '0 8px 24px rgba(0, 24, 51, 0.08)',
            },
          },
        }}
      >
        <Box sx={{ px: '22px', pt: '22px', pb: 1.5 }}>
          <Typography
            sx={{
              fontSize: '1.125rem',
              fontWeight: 700,
              lineHeight: '26px',
              letterSpacing: '0.002em',
              color: '#000314',
            }}
          >
            Notifications
          </Typography>
        </Box>
        <Divider sx={{ borderColor: color.border }} />
        {items.length === 0 ? (
          <Box sx={{ p: '22px' }}>
            <EmptyState title="You're all caught up" description="No new notifications." compact />
          </Box>
        ) : (
          <Box sx={{ overflowY: 'auto', maxHeight: 400, px: '22px', pb: '22px' }}>
            {items.map((n, index) => {
              const Icon = kindIcon[n.kind];
              return (
                <Box
                  key={n.id}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    py: 1.5,
                    borderBottom: index < items.length - 1 ? `1px solid ${color.border}` : 'none',
                    backgroundColor: n.read ? 'transparent' : color.bgSubtle,
                    mx: '-22px',
                    px: '22px',
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
