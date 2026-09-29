import Chip from '@mui/material/Chip';
import type { ConversationStatus, Priority, CampaignStatus, ChannelHealth } from '../../types';
import { statusMeta, priorityMeta, campaignStatusMeta, channelHealthMeta } from '../../utils/meta';

export function StatusChip({ status, size = 'small' }: { status: ConversationStatus; size?: 'small' | 'medium' }) {
  const meta = statusMeta[status];
  return (
    <Chip
      size={size}
      label={meta.label}
      sx={{ backgroundColor: meta.surface, color: meta.main, '& .MuiChip-label': { px: 1 } }}
    />
  );
}

export function PriorityChip({ priority, size = 'small' }: { priority: Priority; size?: 'small' | 'medium' }) {
  if (priority === 'normal' || priority === 'low') return null;
  const meta = priorityMeta[priority];
  return (
    <Chip
      size={size}
      label={meta.label}
      sx={{
        height: 'auto',
        borderRadius: '100px',
        backgroundColor: meta.surface,
        color: meta.main,
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '18px',
        '& .MuiChip-label': { px: '10px', py: '6px' },
      }}
    />
  );
}

export function CampaignStatusChip({ status }: { status: CampaignStatus }) {
  const meta = campaignStatusMeta[status];
  return (
    <Chip
      size="small"
      label={meta.label}
      sx={{ backgroundColor: meta.surface, color: meta.main, '& .MuiChip-label': { px: 1 } }}
    />
  );
}

export function ChannelHealthChip({ health }: { health: ChannelHealth }) {
  const meta = channelHealthMeta[health];
  return (
    <Chip
      size="small"
      icon={
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: meta.main,
            marginLeft: 8,
          }}
        />
      }
      label={meta.label}
      sx={{ backgroundColor: meta.surface, color: meta.main, '& .MuiChip-label': { px: 1 } }}
    />
  );
}
