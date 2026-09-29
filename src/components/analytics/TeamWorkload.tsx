import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import { agents } from '../../data/agents';
import { ContactAvatar } from '../common/ContactAvatar';
import { color } from '../../theme/tokens';

export function TeamWorkload() {
  const teamAgents = agents.filter((a) => a.role === 'agent');
  const maxLoad = Math.max(...teamAgents.map((a) => a.activeConversations), 1);

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        p: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Team workload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Active conversations per agent right now
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {teamAgents.map((agent) => (
          <Box key={agent.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ContactAvatar name={agent.name} color={agent.avatarColor} size={32} />
            <Box sx={{ minWidth: 96 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                {agent.name}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {agent.status === 'online' ? 'Online' : agent.status === 'away' ? 'Away' : 'Offline'}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={(agent.activeConversations / maxLoad) * 100}
                sx={{ '& .MuiLinearProgress-bar': { backgroundColor: color.primary } }}
              />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 56, textAlign: 'right' }}>
              {agent.activeConversations} active
            </Typography>
            {agent.escalations > 0 && (
              <Chip
                size="small"
                label={`${agent.escalations} escalated`}
                sx={{ backgroundColor: color.errorSurface, color: color.error }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
