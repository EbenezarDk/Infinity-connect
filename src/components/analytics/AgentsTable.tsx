import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { agents } from '../../data/agents';
import { ContactAvatar } from '../common/ContactAvatar';
import { color, radius } from '../../theme/tokens';

const HEADER_BG = '#F1F6FB';
const TITLE_COLOR = '#000314';

const pillButtonSx = {
  borderRadius: '100px',
  px: '14px',
  py: '10px',
  minHeight: 0,
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: '18px',
  textTransform: 'none' as const,
};

function statusLabel(status: string) {
  if (status === 'online') return 'Online';
  if (status === 'away') return 'Away';
  return 'Offline';
}

function statusColor(status: string) {
  if (status === 'online') return color.success;
  if (status === 'away') return color.warning;
  return color.textSecondary;
}

export function AgentsTable() {
  const navigate = useNavigate();
  const rows = agents.filter((a) => a.role === 'agent');

  return (
    <Box
      sx={{
        border: `1px solid ${color.border}`,
        borderRadius: `${radius.md}px`,
        backgroundColor: color.bgSurface,
        overflow: 'hidden',
        py: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ px: '22px' }}>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: '26px',
            letterSpacing: '0.036px',
            color: TITLE_COLOR,
          }}
        >
          Agents
        </Typography>
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: '18px',
            color: color.textSecondary,
          }}
        >
          Live status, load, and response performance across the team
        </Typography>
      </Box>

      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: HEADER_BG,
            minWidth: 880,
          }}
        >
          {[
            { label: 'Agent', width: 220 },
            { label: 'Status', width: 120 },
            { label: 'Active conversations', width: 168 },
            { label: 'Escalations', width: 120 },
          ].map((col) => (
            <Box key={col.label} sx={{ width: col.width, flexShrink: 0, px: '12px', py: '16px' }}>
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 700,
                  lineHeight: '18px',
                  color: color.textSecondary,
                  textTransform: 'uppercase',
                }}
              >
                {col.label}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              flex: 1,
              minWidth: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.5,
              px: '12px',
              py: '16px',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: '18px',
                color: color.textSecondary,
                textTransform: 'uppercase',
              }}
            >
              Avg. response time
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: '18px',
                color: color.textSecondary,
                textTransform: 'uppercase',
                textAlign: 'right',
              }}
            >
              Action
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 880, pt: 1.5 }}>
          {rows.map((agent, index) => {
            const status = statusLabel(agent.status);
            const sColor = statusColor(agent.status);
            return (
              <Box key={agent.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box
                    sx={{
                      width: 220,
                      flexShrink: 0,
                      px: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      minWidth: 0,
                    }}
                  >
                    <ContactAvatar name={agent.name} color={agent.avatarColor} size={32} />
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        lineHeight: '18px',
                        color: color.textPrimary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={agent.name}
                    >
                      {agent.name}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 120, flexShrink: 0, px: '12px', py: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: '18px',
                        color: sColor,
                      }}
                    >
                      {status}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 168, flexShrink: 0, px: '12px', py: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: '18px',
                        color: color.textPrimary,
                      }}
                    >
                      {agent.activeConversations}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 120, flexShrink: 0, px: '12px', py: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: agent.escalations > 0 ? 700 : 500,
                        lineHeight: '18px',
                        color: agent.escalations > 0 ? color.error : color.textSecondary,
                      }}
                    >
                      {agent.escalations}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 240,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      px: '12px',
                      py: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        flex: 1,
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: '18px',
                        color: color.textPrimary,
                        minWidth: 0,
                      }}
                    >
                      {agent.avgResponseTimeMinutes}m
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/inbox?assignee=${encodeURIComponent(agent.id)}`)}
                        sx={{
                          ...pillButtonSx,
                          borderColor: color.primary,
                          color: color.primary,
                          backgroundColor: 'transparent',
                          '&:hover': {
                            borderColor: color.primaryDark,
                            backgroundColor: color.primarySurface,
                          },
                        }}
                      >
                        Open inbox
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {index < rows.length - 1 && (
                  <Box sx={{ height: 0, borderBottom: `1px solid ${color.border}`, mt: 1.5 }} />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
