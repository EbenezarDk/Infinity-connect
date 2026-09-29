import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { PieChart } from '@mui/x-charts/PieChart';
import { channelConfigs } from '../../data/channels';
import { color, radius } from '../../theme/tokens';
import { formatNumber } from '../../utils/format';
import type { ChannelType } from '../../types';

type Period = 'quarter' | 'month' | 'week';

/** Palette matched to the Revenue Sources reference (not brand channel colors). */
const CHART_COLORS: Record<ChannelType, string> = {
  whatsapp: '#2F6BFF',
  sms: '#F0B97A',
  email: '#0B1A3A',
  rcs: '#7ED957',
};

const PERIOD_MULTIPLIER: Record<Period, number> = {
  week: 1,
  month: 4.2,
  quarter: 12.5,
};

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(Math.round(n));
}

export function ChannelDistribution() {
  const [period, setPeriod] = useState<Period>('quarter');

  const rows = useMemo(() => {
    const mult = PERIOD_MULTIPLIER[period];
    return channelConfigs.map((c) => ({
      id: c.channel,
      label: c.displayName.replace(' Business Messaging', '').replace(' Business', ''),
      fullLabel: c.displayName,
      value: Math.max(1, Math.round(c.messagesToday * mult)),
      color: CHART_COLORS[c.channel],
    }));
  }, [period]);

  const total = rows.reduce((sum, r) => sum + r.value, 0);
  const top = [...rows].sort((a, b) => b.value - a.value)[0];
  const topShare = total > 0 ? Math.round((top.value / total) * 100) : 0;
  const periodLabel = period === 'quarter' ? 'Q1' : period === 'month' ? 'this month' : 'this week';

  return (
    <Box
      sx={{
        border: `1px solid ${color.border}`,
        borderRadius: `${radius.md}px`,
        backgroundColor: color.bgSurface,
        p: '22px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        boxSizing: 'border-box',
      }}
    >
      {/* Header — title / subtitle + period control */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '1.125rem',
              fontWeight: 700,
              lineHeight: '26px',
              letterSpacing: '0.002em',
              color: '#000314',
            }}
          >
            Channel distribution
          </Typography>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: '20px',
              color: color.textMuted,
              mt: 0.25,
            }}
          >
            Traffic channel breakdown
          </Typography>
        </Box>

        <Select
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          sx={{
            minWidth: 110,
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            color: color.textPrimary,
            backgroundColor: color.bgSurface,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: color.border,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: color.borderStrong,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: color.primary,
              borderWidth: 1,
            },
            '& .MuiSelect-select': {
              py: '8px',
              px: '12px',
            },
          }}
        >
          <MenuItem value="quarter">Quarter</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="week">Week</MenuItem>
        </Select>
      </Box>

      {/* Body — doughnut + insight / legend */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
          flex: 1,
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 220,
            height: 220,
            flexShrink: 0,
            mx: { xs: 'auto', md: 0 },
          }}
        >
          <PieChart
            width={220}
            height={220}
            margin={{ top: 4, bottom: 4, left: 4, right: 4 }}
            series={[
              {
                data: rows.map((r) => ({
                  id: r.id,
                  value: r.value,
                  label: r.label,
                  color: r.color,
                })),
                innerRadius: 64,
                outerRadius: 100,
                paddingAngle: 3,
                cornerRadius: 6,
                highlightScope: { fade: 'global', highlight: 'item' },
              },
            ]}
            hideLegend
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              textAlign: 'center',
              px: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: '28px',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#0B1A3A',
              }}
            >
              {formatCompact(total)}
            </Typography>
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 500,
                lineHeight: '16px',
                color: color.textMuted,
                mt: 0.5,
              }}
            >
              Channel volume
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: '1 1 180px',
            minWidth: 160,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: '15px',
                fontWeight: 700,
                lineHeight: '22px',
                color: '#0B1A3A',
              }}
            >
              {formatNumber(top.value)} messages from {top.label}
            </Typography>
            <Typography
              sx={{
                fontSize: '15px',
                fontWeight: 700,
                lineHeight: '22px',
                color: '#0B1A3A',
              }}
            >
              in {periodLabel}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: '18px',
                color: color.textMuted,
                mt: 0.75,
              }}
            >
              {topShare}% of traffic is moving through {top.fullLabel}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: 1.5,
              rowGap: 1.25,
            }}
          >
            {rows.map((r) => (
              <Box key={r.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '4px',
                    backgroundColor: r.color,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 500,
                    lineHeight: '16px',
                    color: color.textSecondary,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={r.fullLabel}
                >
                  {r.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
