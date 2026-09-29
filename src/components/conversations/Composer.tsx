import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
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
const NOTE_BG = '#FFF5EF';
const NOTE_BORDER = '#FF9D68';

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
  const channelLabel =
    channel === 'whatsapp' ? 'WhatsApp' : channel === 'sms' ? 'SMS' : channel === 'email' ? 'email' : 'RCS';

  return (
    <Box
      sx={{
        borderTop: `1px solid ${color.border}`,
        backgroundColor: color.bgSurface,
        px: '22px',
        py: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {channel === 'email' && (
        <TextField
          fullWidth
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          size="small"
          disabled={disabled}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          {(channel === 'whatsapp' || channel === 'email' || channel === 'rcs') && (
            <>
              <Tooltip title="Attach image">
                <IconButton size="small" disabled={disabled} aria-label="Attach image" sx={{ color: color.textSecondary }}>
                  <ImageRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Attach file">
                <IconButton size="small" disabled={disabled} aria-label="Attach file" sx={{ color: color.textSecondary }}>
                  <AttachFileRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
          {channel === 'whatsapp' && (
            <>
              <Tooltip title="Insert template">
                <IconButton
                  size="small"
                  disabled={disabled}
                  onClick={(e) => setTemplateAnchor(e.currentTarget)}
                  aria-label="Insert template"
                  sx={{ color: color.textSecondary }}
                >
                  <DescriptionRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <Menu anchorEl={templateAnchor} open={Boolean(templateAnchor)} onClose={() => setTemplateAnchor(null)}>
                <MenuItem onClick={() => insertTemplate('order_status_update')}>Order status update</MenuItem>
                <MenuItem onClick={() => insertTemplate('refund_confirmation')}>Refund confirmation</MenuItem>
                <MenuItem onClick={() => insertTemplate('welcome_onboarding_v2')}>Welcome onboarding</MenuItem>
              </Menu>
            </>
          )}
          {channel === 'rcs' && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <InfoOutlinedIcon sx={{ fontSize: 13 }} />
              Rich cards depend on carrier support
            </Typography>
          )}
        </Box>

        <Tooltip title={isInternal ? 'Switch back to customer-facing reply' : 'Compose as an internal note'}>
          <Button
            size="small"
            onClick={() => setIsInternal((v) => !v)}
            sx={{
              borderRadius: '12px',
              px: '10px',
              py: '8px',
              minHeight: 0,
              fontSize: '12px',
              fontWeight: 700,
              lineHeight: '18px',
              textTransform: 'none',
              color: color.textPrimary,
              backgroundColor: isInternal ? NOTE_BG : 'transparent',
              border: `1px solid ${isInternal ? NOTE_BORDER : color.border}`,
              '&:hover': {
                backgroundColor: NOTE_BG,
                borderColor: NOTE_BORDER,
              },
            }}
          >
            Internal note
          </Button>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <TextField
          inputRef={inputRef}
          fullWidth
          multiline
          maxRows={5}
          placeholder={isInternal ? 'Write an internal note for your team…' : `Message Via ${channelLabel}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: color.bgSubtle,
              fontSize: '14px',
              fontWeight: 700,
              minHeight: 44,
              '& fieldset': { borderColor: '#D4D4D4' },
              '&:hover fieldset': { borderColor: color.borderStrong },
              '&.Mui-focused fieldset': { borderColor: color.primary, borderWidth: 1 },
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          aria-label="Send message"
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            backgroundColor: isInternal ? '#B5730A' : color.primary,
            color: '#fff',
            flexShrink: 0,
            '&:hover': {
              backgroundColor: isInternal ? '#8A6D1F' : color.primaryDark,
            },
            '&.Mui-disabled': {
              backgroundColor: color.bgSubtle,
              color: color.textDisabled,
            },
          }}
        >
          <SendRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '12px', fontWeight: 500, lineHeight: '18px', color: color.textSecondary }}>
          Press Enter to send · Shift+Enter for a new line
        </Typography>
        {channel === 'sms' && (
          <Typography
            sx={{
              fontSize: '12px',
              color: text.length > SMS_SEGMENT_LIMIT ? color.warning : color.textSecondary,
            }}
          >
            {text.length}/{SMS_SEGMENT_LIMIT} · {segments} segment{segments > 1 ? 's' : ''}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
