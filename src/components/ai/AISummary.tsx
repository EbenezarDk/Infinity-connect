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
import { color } from '../../theme/tokens';
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
          mx: { xs: 1.5, md: 3 },
          mt: 1.5,
          mb: 0.5,
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: `${color.aiAccent}33`,
          backgroundColor: color.aiSurface,
          overflow: 'hidden',
        }}
      >
        <ButtonBase
          onClick={() => setExpanded((e) => !e)}
          sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, justifyContent: 'flex-start' }}
          aria-expanded={expanded}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: color.aiAccent }} />
          <Typography variant="body2" sx={{ fontWeight: 700, color: color.aiAccent, flex: 1, textAlign: 'left' }}>
            AI Summary
          </Typography>
          <ExpandMoreRoundedIcon
            sx={{ fontSize: 18, color: color.aiAccent, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
          />
        </ButtonBase>
        <Collapse in={expanded}>
          <Box sx={{ px: 1.5, pb: 1.5 }}>
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
              {summary.summary}
            </Typography>
            <ButtonBase
              onClick={() => setSourcesOpen(true)}
              sx={{ mt: 0.75, fontSize: '0.75rem', fontWeight: 700, color: color.aiAccent, textDecoration: 'underline' }}
            >
              View source messages
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
