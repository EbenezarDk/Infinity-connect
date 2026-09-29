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

const BUBBLE_BORDER = '#EAF1FF';
const NOTE_BG = '#FFF5EF';
const NOTE_BORDER = '#FF9D68';
const NOTE_ACCENT = '#B44203';

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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: '22px', mb: 2 }}>
        <Box
          sx={{
            maxWidth: '78%',
            backgroundColor: NOTE_BG,
            border: `1px solid ${NOTE_BORDER}`,
            borderRadius: '12px',
            p: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <StickyNote2RoundedIcon sx={{ fontSize: 18, color: NOTE_ACCENT }} />
              <Typography sx={{ fontSize: '12px', fontWeight: 700, lineHeight: '18px', color: NOTE_ACCENT }}>
                Internal note
              </Typography>
            </Box>
            <Box sx={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: NOTE_ACCENT }} />
            <Typography sx={{ fontSize: '12px', fontWeight: 700, lineHeight: '18px', color: NOTE_ACCENT }}>
              {message.sender}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '12px', fontWeight: 700, lineHeight: '18px', color: color.textPrimary }}>
            {message.text}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 500, lineHeight: '18px', color: color.textSecondary }}>
              {formatTimeLabel(message.timestamp)}
            </Typography>
            <Box sx={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: color.textMuted }} />
            <Typography sx={{ fontSize: '12px', fontWeight: 500, lineHeight: '18px', color: color.textSecondary }}>
              Visible to team only
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  const hasAttachments = Boolean(message.attachments?.length);
  const bubbleRadius = hasAttachments
    ? isOutbound
      ? '20px 16px 2px 20px'
      : '16px 20px 20px 2px'
    : isOutbound
      ? '100px 16px 2px 100px'
      : '16px 100px 100px 2px';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOutbound ? 'flex-end' : 'flex-start',
        px: '22px',
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: '78%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOutbound ? 'flex-end' : 'flex-start',
          gap: 0.75,
        }}
      >
        {!isOutbound && (
          <Typography sx={{ fontSize: '14px', fontWeight: 500, lineHeight: '18px', color: color.textSecondary }}>
            {message.sender}
          </Typography>
        )}
        <Box
          sx={{
            backgroundColor: color.bgSurface,
            color: color.textPrimary,
            border: `1px solid ${BUBBLE_BORDER}`,
            borderRadius: bubbleRadius,
            p: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: hasAttachments ? '10px' : 0,
            alignItems: 'flex-start',
          }}
        >
          {message.type === 'template' && (
            <Chip
              size="small"
              label={`Template · ${message.templateName}`}
              sx={{
                height: 20,
                backgroundColor: color.primarySurface,
                color: color.primary,
              }}
            />
          )}

          {message.text && (
            <Typography sx={{ fontSize: '14px', fontWeight: 500, lineHeight: '18px', whiteSpace: 'pre-wrap' }}>
              {message.text}
            </Typography>
          )}

          {message.attachments?.map((att) => (
            <Box
              key={att.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                p: '10px',
                borderRadius: '12px',
                backgroundColor: '#F4F4F4',
                border: '1px solid #DDDDDD',
                minWidth: { xs: 180, sm: 220 },
                maxWidth: '100%',
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  flexShrink: 0,
                  borderRadius: '4px',
                  backgroundColor: '#D9D9D9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: color.textSecondary,
                }}
              >
                {att.type === 'image' ? (
                  <ImageRoundedIcon sx={{ fontSize: 16 }} />
                ) : (
                  <InsertDriveFileRoundedIcon sx={{ fontSize: 16 }} />
                )}
              </Box>
              <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Typography
                  noWrap
                  sx={{
                    fontSize: '12px',
                    fontWeight: 700,
                    lineHeight: '18px',
                    color: color.textPrimary,
                  }}
                >
                  {att.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 500,
                    lineHeight: '18px',
                    color: color.textSecondary,
                  }}
                >
                  {att.sizeLabel}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 500, lineHeight: '18px', color: color.textSecondary }}>
            {formatTimeLabel(message.timestamp)}
          </Typography>
          {isOutbound && <DeliveryStatus status={message.deliveryStatus} />}
        </Box>
      </Box>
    </Box>
  );
}
