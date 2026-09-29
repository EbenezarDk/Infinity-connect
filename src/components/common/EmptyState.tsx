import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type { ReactNode } from 'react';
import { color } from '../../theme/tokens';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function EmptyState({ icon, title, description, actionLabel, onAction, compact }: EmptyStateProps) {
  return (
    <Box
      className="ic-fade-up"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: compact ? 5 : 10,
        px: 3,
        gap: 1.5,
        height: '100%',
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2.5,
            background: `linear-gradient(145deg, ${color.primarySurface} 0%, ${color.bgSubtle} 100%)`,
            border: '1px solid',
            borderColor: color.primaryLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color.primary,
            mb: 1,
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button size="small" variant="outlined" onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
