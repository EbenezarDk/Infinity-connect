import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import type { Conversation } from '../../types';
import { getContactById } from '../../data/contacts';
import { getAgentById } from '../../data/agents';
import { ContactAvatar } from '../common/ContactAvatar';
import { ChannelIcon } from '../common/ChannelIcon';
import { PriorityChip } from '../common/StatusChip';
import { formatRelativeTime, formatSlaLabel } from '../../utils/format';
import { color } from '../../theme/tokens';
import { channelMeta } from '../../utils/meta';

interface ConversationListItemProps {
  conversation: Conversation;
  selected: boolean;
  onSelect: () => void;
}

export function ConversationListItem({ conversation, selected, onSelect }: ConversationListItemProps) {
  const contact = getContactById(conversation.contactId);
  const assignee = getAgentById(conversation.assigneeId);
  const sla = formatSlaLabel(conversation.slaMinutesRemaining);
  const channel = channelMeta[conversation.channel];

  if (!contact) return null;

  return (
    <ButtonBase
      onClick={onSelect}
      aria-current={selected ? 'true' : undefined}
      className={selected ? 'ic-fade-in' : undefined}
      sx={{
        display: 'block',
        textAlign: 'left',
        px: 2,
        py: 1.5,
        mx: 1,
        my: 0.5,
        width: 'calc(100% - 16px)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: selected ? color.primaryLight : 'transparent',
        backgroundColor: selected ? color.bgSurface : 'transparent',
        boxShadow: selected ? '0 1px 2px rgba(11,18,32,0.05)' : 'none',
        transition: 'background-color 140ms ease, border-color 140ms ease, box-shadow 140ms ease',
        '&:hover': {
          backgroundColor: selected ? color.bgSurface : color.bgSubtle,
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.25, width: '100%' }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<ChannelIcon channel={conversation.channel} size={11} withTooltip={false} />}
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#fff',
              border: '1px solid',
              borderColor: channel.main,
              p: 0,
              minWidth: 18,
              height: 18,
            },
          }}
        >
          <ContactAvatar name={contact.name} color={contact.avatarColor} size={40} />
        </Badge>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: conversation.unread > 0 ? 800 : 600, color: 'text.primary' }}
            >
              {contact.name}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
              {formatRelativeTime(conversation.lastMessageAt)}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            noWrap
            sx={{
              color: conversation.unread > 0 ? 'text.primary' : 'text.secondary',
              mt: 0.25,
              fontWeight: conversation.unread > 0 ? 500 : 400,
            }}
          >
            {conversation.lastMessagePreview}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75, flexWrap: 'wrap' }}>
            <PriorityChip priority={conversation.priority} />
            {sla && (
              <Tooltip title={sla.overdue ? 'SLA breached' : 'Time remaining before SLA breach'}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.4,
                    color: sla.overdue ? color.error : color.textSecondary,
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                  }}
                >
                  <ScheduleRoundedIcon sx={{ fontSize: 12 }} />
                  {sla.label}
                </Box>
              </Tooltip>
            )}
            {assignee ? (
              <Typography variant="caption" color="text.disabled" noWrap>
                {assignee.name.split(' ')[0]}
              </Typography>
            ) : (
              <Typography variant="caption" sx={{ color: color.warning, fontWeight: 700 }}>
                Unassigned
              </Typography>
            )}
            {conversation.unread > 0 && (
              <Box
                sx={{
                  ml: 'auto',
                  minWidth: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  color: '#fff',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 0.5,
                }}
              >
                {conversation.unread}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ButtonBase>
  );
}
