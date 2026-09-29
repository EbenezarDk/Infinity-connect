import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { AiIntent } from '../../types';
import { color, radius } from '../../theme/tokens';

export function IntentDetection({ intent }: { intent: AiIntent }) {
  const confidencePct = Math.round(intent.confidence * 100);

  return (
    <Box
      sx={{
        mx: { xs: 1.5, md: '22px' },
        mb: 1.5,
        borderRadius: `${radius.md}px`,
        border: `1px solid ${color.border}`,
        backgroundColor: color.bgSurface,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1.1fr 0.9fr 1.2fr' },
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0, 24, 51, 0.04)',
      }}
    >
      <Box sx={{ px: '18px', py: '14px', minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: color.textMuted,
            mb: 0.75,
          }}
        >
          Detected intent
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: '10px',
            py: '6px',
            borderRadius: '100px',
            backgroundColor: color.primarySurface,
            color: color.primary,
          }}
        >
          <Typography sx={{ fontSize: '13px', fontWeight: 700, lineHeight: '16px' }}>{intent.intent}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          px: '18px',
          py: '14px',
          borderLeft: { sm: `1px solid ${color.border}` },
          borderTop: { xs: `1px solid ${color.border}`, sm: 'none' },
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: color.textMuted,
            mb: 0.75,
          }}
        >
          Confidence · {confidencePct}%
        </Typography>
        <Box
          sx={{
            height: 8,
            borderRadius: radius.pill,
            backgroundColor: color.bgSubtle,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: `${confidencePct}%`,
              borderRadius: radius.pill,
              background: `linear-gradient(90deg, ${color.aiAccent} 0%, ${color.primary} 100%)`,
              transition: 'width 280ms ease',
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          px: '18px',
          py: '14px',
          borderLeft: { sm: `1px solid ${color.border}` },
          borderTop: { xs: `1px solid ${color.border}`, sm: 'none' },
          minWidth: 0,
          background: `linear-gradient(135deg, ${color.bgSurface} 40%, ${color.primarySurface} 100%)`,
        }}
      >
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: color.textMuted,
            mb: 0.75,
          }}
        >
          Suggested next step
        </Typography>
        <Typography sx={{ fontSize: '13px', fontWeight: 700, lineHeight: '18px', color: color.textPrimary }}>
          {intent.suggestedNextStep}
        </Typography>
      </Box>
    </Box>
  );
}
