import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import PsychologyAltRoundedIcon from '@mui/icons-material/PsychologyAltRounded';
import type { AiIntent } from '../../types';
import { color } from '../../theme/tokens';

export function IntentDetection({ intent }: { intent: AiIntent }) {
  return (
    <Box
      sx={{
        mx: { xs: 1.5, md: 3 },
        mb: 1,
        p: 1.25,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: `${color.aiAccent}33`,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        flexWrap: 'wrap',
      }}
    >
      <PsychologyAltRoundedIcon sx={{ fontSize: 16, color: color.aiAccent }} />
      <Box sx={{ flex: 1, minWidth: 160 }}>
        <Typography variant="caption" color="text.secondary">
          Detected intent
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {intent.intent}
        </Typography>
      </Box>
      <Box sx={{ minWidth: 110 }}>
        <Typography variant="caption" color="text.secondary">
          Confidence · {Math.round(intent.confidence * 100)}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={intent.confidence * 100}
          sx={{ mt: 0.4, '& .MuiLinearProgress-bar': { backgroundColor: color.aiAccent } }}
        />
      </Box>
      <Box sx={{ flex: 1, minWidth: 160, textAlign: { xs: 'left', sm: 'right' } }}>
        <Typography variant="caption" color="text.secondary">
          Suggested next step
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {intent.suggestedNextStep}
        </Typography>
      </Box>
    </Box>
  );
}
