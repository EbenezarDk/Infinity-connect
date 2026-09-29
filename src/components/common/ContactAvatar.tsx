import Avatar from '@mui/material/Avatar';
import { initials } from '../../utils/format';

interface ContactAvatarProps {
  name: string;
  color: string;
  size?: number;
}

export function ContactAvatar({ name, color, size = 36 }: ContactAvatarProps) {
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: `${color}1A`,
        color,
        fontSize: size * 0.36,
        border: `1px solid ${color}33`,
      }}
    >
      {initials(name)}
    </Avatar>
  );
}
