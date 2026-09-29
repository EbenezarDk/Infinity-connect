import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { ChannelType } from '../../types';
import { color } from '../../theme/tokens';

interface ComposerProps {
  channel: ChannelType;
  prefillText: string;
  prefillVersion: number;
  disabled?: boolean;
  onSend: (text: string, isInternal: boolean) => void;
}

const SMS_SEGMENT_LIMIT = 160;

export function Composer({ channel, prefillText, prefillVersion, disabled, onSend }: ComposerProps) {
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [templateAnchor, setTemplateAnchor] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (prefillVersion > 0) {
      setText(prefillText);
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillVersion]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim(), isInternal);
    setText('');
    setIsInternal(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertTemplate = (name: string) => {
    setText((t) => `${t}${t ? ' ' : ''}[Template: ${name}] `);
    setTemplateAnchor(null);
  };

  const segments = Math.max(1, Math.ceil(text.length / SMS_SEGMENT_LIMIT));

  return (
    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', px: { xs: 1.5, md: 3 }, py: 1.5 }}>
      {channel === 'email' && (
        <TextField
          fullWidth
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          size="small"
          sx={{ mb: 1 }}
          disabled={disabled}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75, flexWrap: 'wrap' }}>
        {channel === 'whatsapp' && (
          <>
            <Tooltip title="Attach document">
              <IconButton size="small" disabled={disabled} aria-label="Attach document">
                <AttachFileRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Attach image">
              <IconButton size="small" disabled={disabled} aria-label="Attach image">
                <ImageRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Insert template">
              <IconButton size="small" disabled={disabled} onClick={(e) => setTemplateAnchor(e.currentTarget)} aria-label="Insert template">
                <DescriptionRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Menu anchorEl={templateAnchor} open={Boolean(templateAnchor)} onClose={() => setTemplateAnchor(null)}>
              <MenuItem onClick={() => insertTemplate('order_status_update')}>Order status update</MenuItem>
              <MenuItem onClick={() => insertTemplate('refund_confirmation')}>Refund confirmation</MenuItem>
              <MenuItem onClick={() => insertTemplate('welcome_onboarding_v2')}>Welcome onboarding</MenuItem>
            </Menu>
          </>
        )}

        {channel === 'email' && (
          <Tooltip title="Attach file">
            <IconButton size="small" disabled={disabled} aria-label="Attach file">
              <AttachFileRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {channel === 'rcs' && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <InfoOutlinedIcon sx={{ fontSize: 13 }} />
            Rich cards depend on carrier support — treated as a UX model.
          </Typography>
        )}

        <Box sx={{ flex: 1 }} />

        <Tooltip title={isInternal ? 'Switch back to customer-facing reply' : 'Compose as an internal note (not visible to customer)'}>
          <Chip
            size="small"
            icon={<StickyNote2RoundedIcon sx={{ fontSize: 14 }} />}
            label="Internal note"
            onClick={() => setIsInternal((v) => !v)}
            variant={isInternal ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: isInternal ? '#FCF6E8' : 'transparent',
              borderColor: isInternal ? '#E4C87A' : 'divider',
              color: isInternal ? '#8A6D1F' : 'text.secondary',
            }}
          />
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <TextField
          inputRef={inputRef}
          fullWidth
          multiline
          maxRows={5}
          placeholder={isInternal ? 'Write an internal note for your team…' : `Message via ${channel === 'whatsapp' ? 'WhatsApp' : channel === 'sms' ? 'SMS' : channel === 'email' ? 'email' : 'RCS'}…`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          sx={{ minWidth: 44, height: 40, px: 1.5, backgroundColor: isInternal ? '#B5730A' : undefined }}
          aria-label="Send message"
        >
          <SendRoundedIcon fontSize="small" />
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, px: 0.5 }}>
        <Typography variant="caption" color="text.disabled">
          Press Enter to send · Shift+Enter for a new line
        </Typography>
        {channel === 'sms' && (
          <Typography variant="caption" sx={{ color: text.length > SMS_SEGMENT_LIMIT ? color.warning : 'text.disabled' }}>
            {text.length}/{SMS_SEGMENT_LIMIT} · {segments} segment{segments > 1 ? 's' : ''}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
