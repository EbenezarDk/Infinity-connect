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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ContactAvatar name={contact.name} color={contact.avatarColor} size={compact ? 44 : 56} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>
            {contact.name}
          </Typography>
          {contact.company && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {contact.company}
            </Typography>
          )}
        </Box>
      </Box>

      {contact.tags.length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1.5 }}>
          {contact.tags.map((tag) => (
            <Chip key={tag} size="small" label={tag} variant="outlined" />
          ))}
        </Box>
      )}

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BadgeRoundedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">
            Customer ID · {contact.id.replace('contact-', '').toUpperCase()}
          </Typography>
        </Box>
        {contact.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneRoundedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography variant="body2">{contact.phone}</Typography>
          </Box>
        )}
        {contact.email && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailRoundedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography variant="body2" noWrap>
              {contact.email}
            </Typography>
          </Box>
        )}
        {contact.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlaceRoundedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography variant="body2">{contact.location}</Typography>
          </Box>
        )}
        {contact.company && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessRoundedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography variant="body2">{contact.company}</Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Typography variant="overline" color="text.disabled">
        Channel identities
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0.75 }}>
        {contact.channels.map((ch) => (
          <Box key={ch.channel} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChannelIcon channel={ch.channel} withBackground size={13} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {channelMeta[ch.channel].label} · {ch.handle}
              </Typography>
              <Typography variant="caption" color="text.disabled">
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
          sx={{ mt: 2 }}
        >
          View full profile
        </Button>
      )}
    </Box>
  );
}
