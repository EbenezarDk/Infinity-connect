import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logoMark from '../../assets/logo-mark.svg';
import { color } from '../../theme/tokens';

interface BrandMarkProps {
  collapsed?: boolean;
  showTagline?: boolean;
  size?: number;
}

export function BrandMark({ collapsed = false, showTagline = false, size = 24 }: BrandMarkProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
      <Box
        component="img"
        src={logoMark}
        alt=""
        aria-hidden
        sx={{
          width: size,
          height: size,
          flexShrink: 0,
          display: 'block',
        }}
      />
      {!collapsed && (
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="span"
            sx={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: 700,
              lineHeight: '20px',
              color: color.textPrimary,
              whiteSpace: 'nowrap',
            }}
          >
            InfinityConnect
          </Typography>
          {showTagline && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
              Omnichannel workspace
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
