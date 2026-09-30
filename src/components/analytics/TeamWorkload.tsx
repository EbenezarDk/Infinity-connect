import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { agents } from '../../data/agents';
import { ContactAvatar } from '../common/ContactAvatar';
import { color, radius } from '../../theme/tokens';

function statusColor(status: string) {
  if (status === 'online') return color.statusOnline;
  if (status === 'away') return color.statusAway;
  return color.statusOffline;
}

function statusLabel(status: string) {
  if (status === 'online') return 'Online';
  if (status === 'away') return 'Away';
  return 'Offline';
}

export function TeamWorkload() {
  const navigate = useNavigate();
  const teamAgents = agents.filter((a) => a.role === 'agent');
  const maxLoad = Math.max(...teamAgents.map((a) => a.activeConversations), 1);

  return (
    <Box
      sx={{
        border: `1px solid ${color.border}`,
        borderRadius: `${radius.md}px`,
        backgroundColor: color.bgSurface,
        p: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            lineHeight: '26px',
            letterSpacing: '0.002em',
            color: '#000314',
          }}
        >
          Team workload
        </Typography>
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 500,
            lineHeight: '18px',
            color: color.textSecondary,
          }}
        >
          Active conversations per agent right now
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }} role="list" aria-label="Team workload">
        {teamAgents.map((agent, index) => {
          const fill = (agent.activeConversations / maxLoad) * 100;
          const isLast = index === teamAgents.length - 1;
          return (
            <Box
              key={agent.id}
              role="listitem"
              sx={{
                width: '100%',
                borderBottom: isLast ? 'none' : '1px solid rgba(226, 226, 228, 0.3)',
              }}
            >
              <ButtonBase
                onClick={() => navigate(`/inbox?assignee=${encodeURIComponent(agent.id)}`)}
                aria-label={`Open inbox for ${agent.name}, ${agent.activeConversations} active${
                  agent.escalations > 0 ? `, ${agent.escalations} escalated` : ''
                }`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: '12px', sm: '22px' },
                  width: '100%',
                  px: 1,
                  py: '10px',
                  mx: -1,
                  borderRadius: `${radius.sm}px`,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 140ms ease',
                  '&:hover': {
                    backgroundColor: color.bgSubtle,
                    '& .ic-workload-bar-fill': {
                      backgroundColor: color.primaryDark,
                    },
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${color.primary}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: 120, sm: 162 }, flexShrink: 0, minWidth: 0 }}>
                  <ContactAvatar name={agent.name} color={agent.avatarColor} size={32} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        lineHeight: '18px',
                        color: color.textPrimary,
                      }}
                      noWrap
                    >
                      {agent.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        lineHeight: '18px',
                        color: statusColor(agent.status),
                      }}
                    >
                      {statusLabel(agent.status)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: { xs: '10px', sm: '22px' }, minWidth: 0 }}>
                  <Box
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: radius.pill,
                      backgroundColor: '#E8EEF5',
                      overflow: 'hidden',
                      minWidth: 24,
                    }}
                    aria-hidden
                  >
                    <Box
                      className="ic-workload-bar-fill"
                      sx={{
                        height: '100%',
                        width: `${fill}%`,
                        borderRadius: radius.pill,
                        backgroundColor: color.primary,
                        transition: 'background-color 140ms ease, width 200ms ease',
                      }}
                    />
                  </Box>
                  <Box sx={{ width: { xs: 64, sm: 70 }, flexShrink: 0, textAlign: 'right' }}>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        lineHeight: '18px',
                        color: '#000',
                      }}
                    >
                      {agent.activeConversations} active
                    </Typography>
                    {agent.escalations > 0 && (
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          lineHeight: '18px',
                          color: '#FF0B0B',
                        }}
                      >
                        {agent.escalations} escalated
                      </Typography>
                    )}
                  </Box>
                </Box>
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
