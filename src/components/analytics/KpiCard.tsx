import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { color, radius, space } from '../../theme/tokens';

interface KpiCardProps {
  label: string;
  value: string;
  trend?: { direction: 'up' | 'down'; label: string; positive: boolean };
  icon?: React.ReactNode;
}

export function KpiCard({ label, value, trend }: KpiCardProps) {
  const positive = trend?.positive ?? true;
  const borderColor = positive ? color.kpiPositiveBorder : color.kpiNegativeBorder;
  const wash = positive ? color.kpiPositiveWash : color.kpiNegativeWash;

  return (
    <Box
      sx={{
        flex: '1 1 200px',
        minWidth: { xs: 'calc(50% - 8px)', sm: 180 },
        maxWidth: { xs: '100%', sm: 'none' },
        p: `${space.sm}px`,
        borderRadius: `${radius.md}px`,
        border: `1px solid ${borderColor}`,
        backgroundColor: color.bgSurface,
        backgroundImage: `linear-gradient(-28deg, ${wash} 5%, transparent 64%), linear-gradient(90deg, #fff 0%, #fff 100%)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            lineHeight: '18px',
            color: '#000',
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: '1.375rem',
            fontWeight: 700,
            lineHeight: '26px',
            color: '#000',
          }}
        >
          {value}
        </Typography>
      </Box>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {trend.direction === 'up' ? (
            <ArrowUpwardRoundedIcon
              sx={{ fontSize: 16, color: trend.positive ? color.trendDown : color.trendUp }}
            />
          ) : (
            <ArrowDownwardRoundedIcon
              sx={{ fontSize: 16, color: trend.positive ? color.trendDown : color.trendUp }}
            />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                lineHeight: '18px',
                color: trend.positive ? color.trendDown : color.trendUp,
              }}
            >
              {trend.label}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                lineHeight: '18px',
                color: '#000',
              }}
            >
              vs last week
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
