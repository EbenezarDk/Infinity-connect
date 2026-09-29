import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { color } from '../../theme/tokens';

interface KpiCardProps {
  label: string;
  value: string;
  trend?: { direction: 'up' | 'down'; label: string; positive: boolean };
  icon?: React.ReactNode;
}

export function KpiCard({ label, value, trend, icon }: KpiCardProps) {
  return (
    <Box
      sx={{
        flex: '1 1 200px',
        minWidth: 180,
        p: 2.25,
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        backgroundImage: `linear-gradient(180deg, ${color.primarySurface}55 0%, transparent 48%)`,
        transition: 'box-shadow 140ms ease, border-color 140ms ease',
        '&:hover': { borderColor: color.primaryLight, boxShadow: '0 8px 24px rgba(11,18,32,0.06)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        {icon && (
          <Box sx={{ color: color.primary, display: 'flex', alignItems: 'center' }}>{icon}</Box>
        )}
      </Box>
      <Typography variant="h2" sx={{ mt: 0.5, fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
        {value}
      </Typography>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.5 }}>
          {trend.direction === 'up' ? (
            <ArrowUpwardRoundedIcon sx={{ fontSize: 14, color: trend.positive ? color.success : color.error }} />
          ) : (
            <ArrowDownwardRoundedIcon sx={{ fontSize: 14, color: trend.positive ? color.success : color.error }} />
          )}
          <Typography variant="caption" sx={{ color: trend.positive ? color.success : color.error, fontWeight: 700 }}>
            {trend.label}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            vs last week
          </Typography>
        </Box>
      )}
    </Box>
  );
}
