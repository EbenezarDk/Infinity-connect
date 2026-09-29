import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TextsmsRoundedIcon from '@mui/icons-material/TextsmsRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import type { ChannelType } from '../../types';
import { channelMeta } from '../../utils/meta';

const iconMap: Record<ChannelType, React.ElementType> = {
  whatsapp: WhatsAppIcon,
  sms: TextsmsRoundedIcon,
  email: EmailRoundedIcon,
  rcs: ForumRoundedIcon,
};

interface ChannelIconProps {
  channel: ChannelType;
  size?: number;
  withBackground?: boolean;
  withTooltip?: boolean;
}

export function ChannelIcon({ channel, size = 16, withBackground = false, withTooltip = true }: ChannelIconProps) {
  const Icon = iconMap[channel];
  const meta = channelMeta[channel];

  const icon = <Icon sx={{ fontSize: size, color: meta.main }} aria-hidden="true" />;

  const content = withBackground ? (
    <Box
      sx={{
        width: size + 14,
        height: size + 14,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: meta.surface,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
  ) : (
    icon
  );

  if (!withTooltip) return content;

  return (
    <Tooltip title={meta.label}>
      <span style={{ display: 'inline-flex' }}>{content}</span>
    </Tooltip>
  );
}
