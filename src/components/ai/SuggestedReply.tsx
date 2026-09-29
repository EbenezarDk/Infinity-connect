import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import type { AiSuggestedReply } from '../../types';
import { color, radius } from '../../theme/tokens';

interface SuggestedReplyProps {
  suggestion: AiSuggestedReply;
  onUse: (text: string) => void;
  onEdit: (text: string) => void;
}

const pillSx = {
  borderRadius: '100px',
  px: '14px',
  py: '8px',
  minHeight: 0,
  fontSize: '13px',
  fontWeight: 700,
  lineHeight: '18px',
  textTransform: 'none' as const,
};

export function SuggestedReply({ suggestion, onUse, onEdit }: SuggestedReplyProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <Box
      className="ic-fade-up"
      sx={{
        mx: { xs: 1.5, md: '22px' },
        mb: 1.5,
        borderRadius: `${radius.lg}px`,
        border: `1px solid ${color.border}`,
        backgroundColor: color.bgSurface,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 24, 51, 0.06)',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          height: 3,
          background: `linear-gradient(90deg, ${color.primary} 0%, ${color.aiAccent} 55%, #7ED9F7 100%)`,
        }}
      />

      <Box sx={{ p: '18px', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${color.primarySurface} 0%, ${color.aiSurface} 100%)`,
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: color.primary }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: color.textMuted,
                lineHeight: '14px',
              }}
            >
              Draft assist
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 700, lineHeight: '18px', color: color.textPrimary }}>
              Suggested reply · review before sending
            </Typography>
          </Box>
          <Tooltip title="Dismiss">
            <IconButton size="small" onClick={() => setDismissed(true)} aria-label="Dismiss suggested reply">
              <CloseRoundedIcon sx={{ fontSize: 18, color: color.textSecondary }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            px: '14px',
            py: '12px',
            borderRadius: `${radius.md}px`,
            backgroundColor: color.bgSubtle,
            border: `1px solid ${color.border}`,
            borderLeft: `3px solid ${color.primary}`,
          }}
        >
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: '20px',
              color: color.textPrimary,
              fontStyle: 'italic',
            }}
          >
            “{suggestion.text}”
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="contained"
            onClick={() => onUse(suggestion.text)}
            sx={{
              ...pillSx,
              backgroundColor: color.primary,
              color: '#fff',
              boxShadow: 'none',
              '&:hover': { backgroundColor: color.primaryDark, boxShadow: 'none' },
            }}
          >
            Use suggestion
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={() => onEdit(suggestion.text)}
            sx={{
              ...pillSx,
              borderColor: color.primary,
              color: color.primary,
              '&:hover': { borderColor: color.primaryDark, backgroundColor: color.primarySurface },
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => setDismissed(true)}
            sx={{
              ...pillSx,
              color: color.textSecondary,
              '&:hover': { backgroundColor: color.bgSubtle },
            }}
          >
            Dismiss
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
