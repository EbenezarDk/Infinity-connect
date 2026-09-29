import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { useNavigate } from 'react-router-dom';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import type { ActivityEvent, ConversationHistoryEntry } from '../../types';
import { ChannelIcon } from '../common/ChannelIcon';
import { EmptyState } from '../common/EmptyState';
import { formatDateTimeLabel } from '../../utils/format';
import { color } from '../../theme/tokens';

const activityIcon: Record<ActivityEvent['kind'], React.ElementType> = {
  assignment: PersonAddAltRoundedIcon,
  escalation: ReportProblemRoundedIcon,
  identity_match: LinkRoundedIcon,
  resolution: CheckCircleOutlineRoundedIcon,
  note: StickyNote2RoundedIcon,
  channel_switch: LinkRoundedIcon,
};

export function ConversationHistoryList({ entries }: { entries: ConversationHistoryEntry[] }) {
  const navigate = useNavigate();

  if (entries.length === 0) {
    return <EmptyState title="No conversation history" description="Past conversations with this customer will appear here." compact />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {entries.map((entry) => (
        <ButtonBase
          key={entry.conversationId}
          onClick={() => navigate(`/inbox?conversation=${entry.conversationId}`)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            p: 1,
            borderRadius: 1.5,
            textAlign: 'left',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': { backgroundColor: 'action.hover' },
          }}
        >
          <ChannelIcon channel={entry.channel} withBackground size={14} />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {entry.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDateTimeLabel(entry.date)}
            </Typography>
          </Box>
        </ButtonBase>
      ))}
    </Box>
  );
}

export function ActivityList({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return <EmptyState title="No activity yet" description="Assignment, escalation, and resolution events will appear here." compact />;
  }

  return (
    <Box sx={{ position: 'relative', pl: 2 }}>
      <Box sx={{ position: 'absolute', left: 7, top: 6, bottom: 6, width: 1.5, backgroundColor: 'divider' }} />
      {events.map((event) => {
        const Icon = activityIcon[event.kind];
        return (
          <Box key={event.id} sx={{ position: 'relative', pb: 2 }}>
            <Box
              sx={{
                position: 'absolute',
                left: -18,
                top: 0,
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#fff',
                border: '1.5px solid',
                borderColor: color.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ fontSize: 10, color: 'text.secondary' }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {event.label}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {formatDateTimeLabel(event.timestamp)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
