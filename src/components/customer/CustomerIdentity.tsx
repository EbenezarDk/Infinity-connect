import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useNavigate } from 'react-router-dom';
import type { Contact } from '../../types';
import { ContactAvatar } from '../common/ContactAvatar';
import { ChannelIcon } from '../common/ChannelIcon';
import { channelMeta } from '../../utils/meta';
import { color } from '../../theme/tokens';

export function CustomerIdentity({
  contact,
  compact,
  hideProfileLink,
}: {
  contact: Contact;
  compact?: boolean;
  hideProfileLink?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5 }}>
        <ContactAvatar name={contact.name} color={contact.avatarColor} size={compact ? 56 : 64} />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{ fontSize: '16px', fontWeight: 700, lineHeight: '22px', color: color.textPrimary }}
            noWrap
          >
            {contact.name}
          </Typography>
          {contact.company && (
            <Typography
              sx={{ fontSize: '13px', fontWeight: 500, lineHeight: '18px', color: color.textSecondary, mt: 0.25 }}
              noWrap
            >
              {contact.company}
            </Typography>
          )}
        </Box>
      </Box>

      {contact.tags.length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 1.5 }}>
          {contact.tags.map((tag) => (
            <Chip
              key={tag}
              size="small"
              label={tag}
              sx={{
                height: 'auto',
                borderRadius: '100px',
                backgroundColor: '#FFF1DF',
                color: '#F79009',
                fontWeight: 500,
                fontSize: '12px',
                border: 'none',
                '& .MuiChip-label': { px: '10px', py: '4px' },
              }}
            />
          ))}
        </Box>
      )}

      <Divider sx={{ my: 2, borderColor: color.border }} />

      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 700,
          lineHeight: '18px',
          color: color.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          mb: 1.25,
        }}
      >
        Details
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BadgeRoundedIcon sx={{ fontSize: 18, color: color.textMuted }} />
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: color.textPrimary }}>
            {contact.id.replace('contact-', '').toUpperCase()}
          </Typography>
        </Box>
        {contact.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneRoundedIcon sx={{ fontSize: 18, color: color.textMuted }} />
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: color.textPrimary }}>{contact.phone}</Typography>
          </Box>
        )}
        {contact.email && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailRoundedIcon sx={{ fontSize: 18, color: color.textMuted }} />
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: color.textPrimary }} noWrap>
              {contact.email}
            </Typography>
          </Box>
        )}
        {contact.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlaceRoundedIcon sx={{ fontSize: 18, color: color.textMuted }} />
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: color.textPrimary }}>{contact.location}</Typography>
          </Box>
        )}
        {contact.company && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessRoundedIcon sx={{ fontSize: 18, color: color.textMuted }} />
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: color.textPrimary }}>{contact.company}</Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 2, borderColor: color.border }} />

      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 700,
          lineHeight: '18px',
          color: color.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          mb: 1.25,
        }}
      >
        Channel identities
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {contact.channels.map((ch) => (
          <Box key={ch.channel} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChannelIcon channel={ch.channel} withBackground size={14} withTooltip={false} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: color.textPrimary }} noWrap>
                {channelMeta[ch.channel].label} · {ch.handle}
              </Typography>
              <Typography sx={{ fontSize: '11px', fontWeight: 500, color: color.textMuted }}>
                Last active {ch.lastActiveLabel}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {!compact && !hideProfileLink && (
        <Button
          fullWidth
          size="small"
          variant="outlined"
          endIcon={<OpenInNewRoundedIcon fontSize="small" />}
          onClick={() => navigate(`/contacts/${contact.id}`)}
          sx={{
            mt: 2,
            borderRadius: '100px',
            textTransform: 'none',
            fontWeight: 700,
            borderColor: color.primary,
            color: color.primary,
          }}
        >
          View full profile
        </Button>
      )}
    </Box>
  );
}
