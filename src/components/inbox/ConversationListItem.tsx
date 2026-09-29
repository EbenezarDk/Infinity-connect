import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import type { Conversation } from '../../types';
import { getContactById } from '../../data/contacts';
import { getAgentById } from '../../data/agents';
import { ContactAvatar } from '../common/ContactAvatar';
import { ChannelIcon } from '../common/ChannelIcon';
import { PriorityChip } from '../common/StatusChip';
import { formatRelativeTime, formatSlaListLabel } from '../../utils/format';
import { color } from '../../theme/tokens';

const SELECTED_BG = '#F3F8FE';

interface ConversationListItemProps {
  conversation: Conversation;
  selected: boolean;
  onSelect: () => void;
}

export function ConversationListItem({ conversation, selected, onSelect }: ConversationListItemProps) {
  const contact = getContactById(conversation.contactId);
  const assignee = getAgentById(conversation.assigneeId);
  const assigneeFirst = assignee?.name.split(' ')[0];
  const sla = formatSlaListLabel(conversation.slaMinutesRemaining, assigneeFirst);
  const unread = conversation.unread > 0;

  if (!contact) return null;

  return (
    <ButtonBase
      onClick={onSelect}
      aria-current={selected ? 'true' : undefined}
      className={selected ? 'ic-fade-in' : undefined}
      sx={{
        display: 'block',
        textAlign: 'left',
        width: '100%',
        px: { xs: '14px', sm: '22px' },
        py: '12px',
        borderRadius: '12px',
        border: selected ? `1.5px solid ${color.primary}` : `1.5px solid rgba(208, 208, 212, 0.3)`,
        backgroundColor: selected ? SELECTED_BG : color.bgSurface,
        boxShadow: selected ? `0 0 0 1px ${color.primary}22` : 'none',
        transition: 'background-color 140ms ease, border-color 140ms ease, box-shadow 140ms ease',
        '&:hover': {
          backgroundColor: selected ? SELECTED_BG : color.bgSubtle,
          borderColor: selected ? color.primary : color.borderStrong,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        {/* Top: avatar + name/preview + time */}
        <Box sx={{ display: 'flex', gap: { xs: '12px', sm: '22px' }, alignItems: 'flex-start', width: '100%' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: 1, minWidth: 0 }}>
            <ContactAvatar name={contact.name} color={contact.avatarColor} size={32} />
            <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Typography
                noWrap
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  lineHeight: '18px',
                  color: color.textPrimary,
                }}
              >
                {contact.name}
              </Typography>
              <Typography
                noWrap
                sx={{
                  fontSize: '14px',
                  fontWeight: unread ? 700 : 500,
                  lineHeight: '18px',
                  color: unread ? color.textPrimary : color.textSecondary,
                }}
              >
                {conversation.lastMessagePreview}
              </Typography>
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: '18px',
              color: color.textSecondary,
              flexShrink: 0,
              pt: '1px',
            }}
          >
            {formatRelativeTime(conversation.lastMessageAt)}
          </Typography>
        </Box>

        {/* Divider */}
        <Box sx={{ height: 0, borderBottom: `1px solid ${color.border}`, width: '100%' }} />

        {/* Meta: channel · priority · SLA · unread */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            <ChannelIcon channel={conversation.channel} size={18} withTooltip={false} />
            <PriorityChip priority={conversation.priority} />
          </Box>

          {sla && (
            <Tooltip title={sla.overdue ? 'SLA breached' : 'Time remaining before SLA breach'}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  flex: 1,
                  minWidth: 0,
                  color: sla.overdue ? color.error : color.textSecondary,
                }}
              >
                <ScheduleRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
                <Typography
                  noWrap
                  sx={{
                    fontSize: '12px',
                    fontWeight: 500,
                    lineHeight: '18px',
                    color: 'inherit',
                  }}
                >
                  <Box component="span" sx={{ fontWeight: 700 }}>
                    {sla.timePart}
                  </Box>
                  {sla.rest}
                </Typography>
              </Box>
            </Tooltip>
          )}

          {!sla && assignee && (
            <Typography
              noWrap
              sx={{
                flex: 1,
                minWidth: 0,
                fontSize: '12px',
                fontWeight: 500,
                color: color.textSecondary,
              }}
            >
              {assigneeFirst}
            </Typography>
          )}

          {!sla && !assignee && (
            <Typography
              sx={{
                flex: 1,
                fontSize: '12px',
                fontWeight: 700,
                color: color.warning,
              }}
            >
              Unassigned
            </Typography>
          )}

          {unread && (
            <Box
              sx={{
                ml: 'auto',
                flexShrink: 0,
                width: 20,
                height: 20,
                borderRadius: '100px',
                backgroundColor: color.primary,
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {conversation.unread}
            </Box>
          )}
        </Box>
      </Box>
    </ButtonBase>
  );
}
