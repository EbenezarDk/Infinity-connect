import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import type { AiSummary, Message } from '../../types';
import { color, radius } from '../../theme/tokens';
import { MessageBubble } from '../conversations/MessageBubble';

interface AISummaryProps {
  summary: AiSummary;
  sourceMessages: Message[];
}

export function AISummary({ summary, sourceMessages }: AISummaryProps) {
  const [expanded, setExpanded] = useState(true);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          mx: { xs: 1.5, md: '22px' },
          mt: 1.5,
          mb: 1,
          borderRadius: `${radius.md}px`,
          border: `1px solid ${color.border}`,
          backgroundColor: color.bgSurface,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 1px 2px rgba(0, 24, 51, 0.04)',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: `linear-gradient(180deg, ${color.primary} 0%, ${color.aiAccent} 100%)`,
          },
        }}
      >
        <ButtonBase
          onClick={() => setExpanded((e) => !e)}
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: '18px',
            py: 1.25,
            justifyContent: 'flex-start',
            pl: '20px',
          }}
          aria-expanded={expanded}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${color.primarySurface} 0%, ${color.aiSurface} 100%)`,
              flexShrink: 0,
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: color.primary }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
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
              Live assist
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 700, lineHeight: '18px', color: color.textPrimary }}>
              AI Summary
            </Typography>
          </Box>
          <ExpandMoreRoundedIcon
            sx={{
              fontSize: 20,
              color: color.textSecondary,
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 160ms ease',
            }}
          />
        </ButtonBase>

        <Collapse in={expanded}>
          <Box sx={{ px: '20px', pb: '18px', pt: 0.25 }}>
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 500,
                lineHeight: '20px',
                color: color.textPrimary,
              }}
            >
              {summary.summary}
            </Typography>
            <ButtonBase
              onClick={() => setSourcesOpen(true)}
              sx={{
                mt: 1.25,
                fontSize: '12px',
                fontWeight: 700,
                color: color.primary,
                borderRadius: '100px',
                px: 1.25,
                py: 0.5,
                border: `1px solid ${color.primary}`,
                '&:hover': { backgroundColor: color.primarySurface },
              }}
            >
              View source messages →
            </ButtonBase>
          </Box>
        </Collapse>
      </Box>

      <Dialog open={sourcesOpen} onClose={() => setSourcesOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Source messages</DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ py: 2 }}>
            {sourceMessages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
