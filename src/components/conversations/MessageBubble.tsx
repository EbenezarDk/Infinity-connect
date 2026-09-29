import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import type { Message } from '../../types';
import { formatTimeLabel } from '../../utils/format';
import { color } from '../../theme/tokens';

function DeliveryStatus({ status }: { status?: Message['deliveryStatus'] }) {
  if (!status) return null;
  const map = {
    sending: { icon: ScheduleRoundedIcon, label: 'Sending…', color: color.textMuted },
    sent: { icon: DoneRoundedIcon, label: 'Sent', color: color.textMuted },
    delivered: { icon: DoneAllRoundedIcon, label: 'Delivered', color: color.textMuted },
    read: { icon: DoneAllRoundedIcon, label: 'Read', color: color.primary },
    failed: { icon: ErrorOutlineRoundedIcon, label: 'Failed to send', color: color.error },
  } as const;
  const meta = map[status];
  const Icon = meta.icon;
  return (
    <Tooltip title={meta.label}>
      <Icon sx={{ fontSize: 14, color: meta.color }} />
    </Tooltip>
  );
}

export function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === 'outbound';

  if (message.isInternal || message.type === 'internal_note') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: { xs: 1.5, md: 3 }, mb: 1.5 }}>
        <Box
          sx={{
            maxWidth: '78%',
            backgroundColor: '#FCF6E8',
            border: '1px dashed',
            borderColor: '#E4C87A',
            borderRadius: 1.5,
            px: 1.5,
            py: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <StickyNote2RoundedIcon sx={{ fontSize: 14, color: '#8A6D1F' }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#8A6D1F' }}>
              Internal note · {message.sender}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#4A3B10' }}>
            {message.text}
          </Typography>
          <Typography variant="caption" sx={{ color: '#8A6D1F', display: 'block', mt: 0.5 }}>
            {formatTimeLabel(message.timestamp)} · Visible to team only
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOutbound ? 'flex-end' : 'flex-start',
        px: { xs: 1.5, md: 3 },
        mb: 1.5,
      }}
    >
      <Box sx={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: isOutbound ? 'flex-end' : 'flex-start' }}>
        {!isOutbound && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.4, ml: 0.5 }}>
            {message.sender}
          </Typography>
        )}
        <Box
          sx={{
            backgroundColor: isOutbound ? color.primary : color.bgSurface,
            color: isOutbound ? '#fff' : 'text.primary',
            border: isOutbound ? 'none' : '1px solid',
            borderColor: 'divider',
            borderRadius: isOutbound ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            px: 1.75,
            py: 1.1,
            boxShadow: isOutbound ? '0 1px 2px rgba(26,107,255,0.25)' : 'none',
          }}
        >
          {message.type === 'template' && (
            <Chip
              size="small"
              label={`Template · ${message.templateName}`}
              sx={{
                mb: 0.75,
                height: 20,
                backgroundColor: isOutbound ? 'rgba(255,255,255,0.18)' : color.primarySurface,
                color: isOutbound ? '#fff' : color.primary,
              }}
            />
          )}

          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.text}
          </Typography>

          {message.attachments?.map((att) => (
            <Box
              key={att.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 1,
                px: 1,
                py: 0.75,
                borderRadius: 1,
                backgroundColor: isOutbound ? 'rgba(255,255,255,0.14)' : color.bgSubtle,
              }}
            >
              {att.type === 'image' ? (
                <ImageRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <InsertDriveFileRoundedIcon sx={{ fontSize: 18 }} />
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600 }}>
                  {att.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  {att.sizeLabel}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.4, mx: 0.5 }}>
          <Typography variant="caption" color="text.disabled">
            {formatTimeLabel(message.timestamp)}
          </Typography>
          {isOutbound && <DeliveryStatus status={message.deliveryStatus} />}
        </Box>
      </Box>
    </Box>
  );
}
