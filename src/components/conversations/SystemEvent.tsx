import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Message } from '../../types';
import { formatTimeLabel } from '../../utils/format';
import { color } from '../../theme/tokens';

export function SystemEvent({ message }: { message: Message }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1, px: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: '10px',
          py: '6px',
          borderRadius: '100px',
          backgroundColor: color.bgSurface,
          maxWidth: '90%',
        }}
      >
        <Typography
          noWrap
          sx={{ fontSize: '12px', fontWeight: 500, lineHeight: '18px', color: color.textSecondary }}
        >
          {message.text}
        </Typography>
        <Box sx={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: color.textMuted, flexShrink: 0 }} />
        <Typography
          sx={{ fontSize: '12px', fontWeight: 500, lineHeight: '18px', color: color.textSecondary, flexShrink: 0 }}
        >
          {formatTimeLabel(message.timestamp)}
        </Typography>
      </Box>
    </Box>
  );
}
