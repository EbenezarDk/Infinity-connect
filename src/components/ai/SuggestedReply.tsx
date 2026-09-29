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
import { color } from '../../theme/tokens';

interface SuggestedReplyProps {
  suggestion: AiSuggestedReply;
  onUse: (text: string) => void;
  onEdit: (text: string) => void;
}

export function SuggestedReply({ suggestion, onUse, onEdit }: SuggestedReplyProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <Box
      className="ic-fade-up"
      sx={{
        mx: { xs: 1.5, md: 3 },
        mb: 1.25,
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: `${color.aiAccent}40`,
        backgroundColor: color.aiSurface,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
        <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: color.aiAccent }} />
        <Typography variant="body2" sx={{ fontWeight: 700, color: color.aiAccent, flex: 1 }}>
          Suggested reply · review before sending
        </Typography>
        <Tooltip title="Dismiss">
          <IconButton size="small" onClick={() => setDismissed(true)} aria-label="Dismiss suggested reply">
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: 'text.primary',
          backgroundColor: '#fff',
          borderRadius: 1.5,
          p: 1.25,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {suggestion.text}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: color.aiAccent, '&:hover': { backgroundColor: '#0A6F96' } }}
          onClick={() => onUse(suggestion.text)}
        >
          Use suggestion
        </Button>
        <Button size="small" variant="outlined" startIcon={<EditRoundedIcon fontSize="small" />} onClick={() => onEdit(suggestion.text)}>
          Edit
        </Button>
        <Button size="small" color="inherit" onClick={() => setDismissed(true)}>
          Dismiss
        </Button>
      </Box>
    </Box>
  );
}
