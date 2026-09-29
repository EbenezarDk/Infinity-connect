import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { Message } from '../../types';
import { formatTimeLabel } from '../../utils/format';

function pickIcon(text: string) {
  if (text.toLowerCase().includes('escalat')) return ReportProblemRoundedIcon;
  if (text.toLowerCase().includes('assigned')) return PersonAddAltRoundedIcon;
  if (text.toLowerCase().includes('matched')) return LinkRoundedIcon;
  if (text.toLowerCase().includes('resolved')) return CheckCircleOutlineRoundedIcon;
  return InfoOutlinedIcon;
}

export function SystemEvent({ message }: { message: Message }) {
  const Icon = pickIcon(message.text);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5, px: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.5,
          py: 0.5,
          borderRadius: 999,
          backgroundColor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          maxWidth: '90%',
        }}
      >
        <Icon sx={{ fontSize: 14, color: 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary" noWrap>
          {message.text}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          · {formatTimeLabel(message.timestamp)}
        </Typography>
      </Box>
    </Box>
  );
}
