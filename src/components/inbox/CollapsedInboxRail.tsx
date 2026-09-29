import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import type { Conversation } from '../../types';
import { getContactById } from '../../data/contacts';
import { ContactAvatar } from '../common/ContactAvatar';
import { color } from '../../theme/tokens';

const RAIL_AVATAR_LIMIT = 8;

function statusDotColor(conversation: Conversation): string {
  if (conversation.status === 'escalated' || conversation.priority === 'urgent') return color.error;
  if (conversation.priority === 'high') return color.warning;
  if (conversation.unread > 0) return color.primary;
  if (conversation.status === 'waiting') return color.statusAway;
  return color.statusOnline;
}

interface CollapsedInboxRailProps {
  conversations: Conversation[];
  selectedId?: string;
  onExpand: () => void;
  onSelect: (id: string) => void;
}

export function CollapsedInboxRail({ conversations, selectedId, onExpand, onSelect }: CollapsedInboxRailProps) {
  const railItems = conversations.slice(0, RAIL_AVATAR_LIMIT);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        pt: 2,
        pb: 2,
        px: 0.5,
        gap: 1.5,
      }}
    >
      <Tooltip title="Expand inbox list" placement="right">
        <IconButton
          size="small"
          onClick={onExpand}
          aria-label="Expand inbox list"
          sx={{
            width: 32,
            height: 32,
            color: color.primary,
            backgroundColor: color.primarySurface,
            borderRadius: '8px',
            border: `1px solid ${color.primaryLight}`,
            '&:hover': {
              backgroundColor: color.primaryLight,
              transform: 'scale(1.04)',
            },
            transition: 'background-color 140ms ease, transform 140ms ease',
          }}
        >
          <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      <Typography
        sx={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: color.textSecondary,
          letterSpacing: '0.08em',
          userSelect: 'none',
        }}
      >
        Inbox
      </Typography>

      <Box
        role="list"
        aria-label="Recent conversations"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.25,
          mt: 0.5,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'visible',
          width: '100%',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {railItems.map((c) => {
          const contact = getContactById(c.contactId);
          if (!contact) return null;
          const selected = c.id === selectedId;
          const dot = statusDotColor(c);

          return (
            <Tooltip
              key={c.id}
              title={`${contact.name}${c.unread > 0 ? ` · ${c.unread} unread` : ''}`}
              placement="right"
            >
              <ButtonBase
                role="listitem"
                onClick={() => onSelect(c.id)}
                aria-label={`Open conversation with ${contact.name}`}
                aria-current={selected ? 'true' : undefined}
                sx={{
                  borderRadius: '50%',
                  p: 0,
                  transition: 'transform 140ms ease',
                  '&:hover': { transform: 'scale(1.08)' },
                  '&:focus-visible': {
                    outline: `2px solid ${color.primary}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      width: 10,
                      height: 10,
                      minWidth: 10,
                      borderRadius: '50%',
                      backgroundColor: dot,
                      border: `2px solid ${color.bgSurface}`,
                      boxShadow: selected ? `0 0 0 1px ${color.primary}` : 'none',
                      top: 2,
                      right: 2,
                    },
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: '50%',
                      p: '2px',
                      background: selected
                        ? `linear-gradient(135deg, ${color.primary} 0%, ${color.aiAccent} 100%)`
                        : 'transparent',
                      transition: 'background 140ms ease, box-shadow 140ms ease',
                      boxShadow: selected ? `0 0 0 2px ${color.primarySurface}` : 'none',
                    }}
                  >
                    <ContactAvatar name={contact.name} color={contact.avatarColor} size={32} />
                  </Box>
                </Badge>
              </ButtonBase>
            </Tooltip>
          );
        })}

        {conversations.length > RAIL_AVATAR_LIMIT && (
          <Tooltip title={`${conversations.length - RAIL_AVATAR_LIMIT} more — expand to see all`} placement="right">
            <Box
              onClick={onExpand}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: color.bgSubtle,
                border: `1px dashed ${color.borderStrong}`,
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 700,
                color: color.textSecondary,
                '&:hover': {
                  backgroundColor: color.primarySurface,
                  color: color.primary,
                  borderColor: color.primaryLight,
                },
              }}
            >
              +{conversations.length - RAIL_AVATAR_LIMIT}
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
