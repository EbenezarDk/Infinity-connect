import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { useNavigate } from 'react-router-dom';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import type { ActivityEvent, ConversationHistoryEntry } from '../../types';
import { ChannelIcon } from '../common/ChannelIcon';
import { EmptyState } from '../common/EmptyState';
import { formatDateTimeLabel } from '../../utils/format';
import { color, radius } from '../../theme/tokens';

const activityMeta: Record<
  ActivityEvent['kind'],
  { icon: React.ElementType; accent: string; surface: string }
> = {
  assignment: { icon: PersonAddAltRoundedIcon, accent: color.primary, surface: color.primarySurface },
  escalation: { icon: ReportProblemRoundedIcon, accent: color.error, surface: color.errorSurface },
  identity_match: { icon: LinkRoundedIcon, accent: color.aiAccent, surface: color.aiSurface },
  resolution: { icon: CheckCircleOutlineRoundedIcon, accent: color.success, surface: color.successSurface },
  note: { icon: StickyNote2RoundedIcon, accent: '#B5730A', surface: '#FFF5EF' },
  channel_switch: { icon: LinkRoundedIcon, accent: color.info, surface: color.infoSurface },
};

export function ConversationHistoryList({ entries }: { entries: ConversationHistoryEntry[] }) {
  const navigate = useNavigate();

  if (entries.length === 0) {
    return (
      <EmptyState
        title="No conversation history"
        description="Past conversations with this customer will appear here."
        compact
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {entries.map((entry) => (
        <ButtonBase
          key={entry.conversationId}
          onClick={() => navigate(`/inbox?conversation=${entry.conversationId}`)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            p: { xs: '10px', sm: '12px' },
            borderRadius: '12px',
            textAlign: 'left',
            border: `1px solid ${color.border}`,
            backgroundColor: color.bgSurface,
            boxShadow: '0 1px 2px rgba(0, 24, 51, 0.04)',
            transition: 'border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease',
            '&:hover': {
              borderColor: color.primaryLight,
              backgroundColor: color.primarySurface,
              boxShadow: '0 4px 12px rgba(0, 122, 255, 0.08)',
              transform: 'translateY(-1px)',
              '& .ic-history-go': { opacity: 1, transform: 'translateX(0)' },
            },
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '12px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(145deg, ${color.primarySurface}, ${color.aiSurface})`,
            }}
          >
            <ChannelIcon channel={entry.channel} size={16} withTooltip={false} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              noWrap
              sx={{ fontSize: '13px', fontWeight: 700, lineHeight: '18px', color: color.textPrimary }}
            >
              {entry.label}
            </Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 500, lineHeight: '16px', color: color.textMuted, mt: 0.25 }}>
              {formatDateTimeLabel(entry.date)}
            </Typography>
          </Box>
          <ArrowForwardRoundedIcon
            className="ic-history-go"
            sx={{
              fontSize: 16,
              color: color.primary,
              opacity: 0,
              transform: 'translateX(-4px)',
              transition: 'opacity 140ms ease, transform 140ms ease',
              flexShrink: 0,
            }}
          />
        </ButtonBase>
      ))}
    </Box>
  );
}

export function ActivityList({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Assignment, escalation, and resolution events will appear here."
        compact
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          left: 19,
          top: 18,
          bottom: 18,
          width: 2,
          borderRadius: radius.pill,
          background: `linear-gradient(180deg, ${color.primary} 0%, ${color.border} 100%)`,
          opacity: 0.45,
        }}
      />
      {events.map((event) => {
        const meta = activityMeta[event.kind];
        const Icon = meta.icon;
        return (
          <Box
            key={event.id}
            sx={{
              display: 'flex',
              gap: 1.25,
              alignItems: 'flex-start',
              p: { xs: '10px', sm: '12px' },
              pl: { xs: '10px', sm: '12px' },
              borderRadius: '12px',
              border: `1px solid ${color.border}`,
              backgroundColor: color.bgSurface,
              position: 'relative',
              transition: 'border-color 140ms ease, box-shadow 140ms ease',
              '&:hover': {
                borderColor: meta.accent,
                boxShadow: `0 4px 12px ${meta.accent}14`,
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '12px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: meta.surface,
                color: meta.accent,
                zIndex: 1,
                border: `1px solid ${color.bgSurface}`,
                boxShadow: `0 0 0 2px ${meta.surface}`,
              }}
            >
              <Icon sx={{ fontSize: 16 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1, pt: 0.25 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, lineHeight: '18px', color: color.textPrimary }}>
                {event.label}
              </Typography>
              <Typography sx={{ fontSize: '11px', fontWeight: 500, lineHeight: '16px', color: color.textMuted, mt: 0.35 }}>
                {formatDateTimeLabel(event.timestamp)}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
