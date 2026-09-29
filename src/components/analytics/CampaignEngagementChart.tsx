import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { campaigns } from '../../data/campaigns';
import { channelMeta, campaignStatusMeta } from '../../utils/meta';
import { color, radius } from '../../theme/tokens';
import { formatNumber } from '../../utils/format';

export function CampaignEngagementChart() {
  const rows = useMemo(
    () =>
      campaigns
        .filter((c) => c.delivered > 0 || c.status === 'sending' || c.status === 'completed')
        .map((c) => {
          const rate = c.delivered > 0 ? Math.round((c.engaged / c.delivered) * 100) : 0;
          return {
            id: c.id,
            name: c.name,
            channel: c.channel,
            delivered: c.delivered,
            engaged: c.engaged,
            rate,
            status: c.status,
            channelColor: channelMeta[c.channel].main,
            channelLabel: channelMeta[c.channel].label,
          };
        })
        .sort((a, b) => b.delivered - a.delivered),
    [],
  );

  const [activeId, setActiveId] = useState(rows[0]?.id ?? '');
  const active = rows.find((r) => r.id === activeId) ?? rows[0];
  const maxDelivered = Math.max(...rows.map((r) => r.delivered), 1);
  const totals = useMemo(
    () => ({
      delivered: rows.reduce((s, r) => s + r.delivered, 0),
      engaged: rows.reduce((s, r) => s + r.engaged, 0),
    }),
    [rows],
  );

  if (!active) return null;

  const status = campaignStatusMeta[active.status];

  return (
    <Box
      sx={{
        border: `1px solid ${color.border}`,
        borderRadius: `${radius.md}px`,
        backgroundColor: color.bgSurface,
        p: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
      className="ic-chart-enter"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: '26px', color: color.textPrimary }}>
            Delivered vs engaged by campaign
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: color.textSecondary, mt: 0.5 }}>
            Dual-track compare · select a campaign
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <MiniStat label="Delivered" value={formatNumber(totals.delivered)} accent={color.primary} />
          <MiniStat label="Engaged" value={formatNumber(totals.engaged)} accent={color.success} />
        </Box>
      </Box>

      {/* Active detail — 16px padding all sides */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          p: '16px',
          borderRadius: `${radius.md}px`,
          background: `linear-gradient(135deg, ${color.primarySurface} 0%, ${color.successSurface} 100%)`,
          border: `1px solid ${color.border}`,
        }}
      >
        <Box sx={{ flex: '1 1 240px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={active.channelLabel}
              sx={{
                height: 24,
                fontWeight: 700,
                fontSize: '0.75rem',
                backgroundColor: `${active.channelColor}18`,
                color: active.channelColor,
              }}
            />
            <Chip
              size="small"
              label={status.label}
              sx={{
                height: 24,
                fontWeight: 700,
                fontSize: '0.75rem',
                backgroundColor: status.surface,
                color: status.main,
              }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: color.textPrimary, lineHeight: 1.3 }}>
              {active.name}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: color.textSecondary, mt: 1 }}>
              Engagement rate
            </Typography>
            <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, color: color.textPrimary, mt: 0.5 }}>
              {active.rate}
              <Typography component="span" sx={{ fontSize: '1.125rem', fontWeight: 700, color: color.textSecondary, ml: 0.5 }}>
                %
              </Typography>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: '1 1 320px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            justifyContent: 'center',
            minWidth: 0,
          }}
        >
          <Track label="Delivered" value={active.delivered} max={maxDelivered} barColor={color.primary} delay={0} />
          <Track label="Engaged" value={active.engaged} max={maxDelivered} barColor={color.success} delay={80} />
        </Box>
      </Box>

      {/* Campaign list — 16px gaps and padding */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {rows.map((row) => {
          const selected = row.id === active.id;
          return (
            <Box
              key={row.id}
              component="button"
              type="button"
              onClick={() => setActiveId(row.id)}
              onMouseEnter={() => setActiveId(row.id)}
              aria-pressed={selected}
              sx={{
                all: 'unset',
                boxSizing: 'border-box',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'minmax(0,1fr) 140px 120px 64px' },
                alignItems: 'center',
                gap: '16px',
                px: '16px',
                py: '16px',
                borderRadius: `${radius.sm}px`,
                border: `1px solid ${selected ? color.primary : color.border}`,
                backgroundColor: selected ? color.primarySurface : color.bgSurface,
                cursor: 'pointer',
                transition: 'border-color 160ms ease, background-color 160ms ease',
                '&:hover': { borderColor: color.primary, backgroundColor: color.primarySurface },
                '&:focus-visible': { outline: `2px solid ${color.primary}`, outlineOffset: 2 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: row.channelColor,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: selected ? 800 : 600,
                    color: color.textPrimary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.name}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: color.textSecondary,
                  textAlign: { sm: 'right' },
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatNumber(row.delivered)} delivered
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: color.success,
                  textAlign: { sm: 'right' },
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatNumber(row.engaged)} engaged
              </Typography>
              <Box
                sx={{
                  justifySelf: { sm: 'end' },
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 999,
                  backgroundColor: selected ? color.primary : color.bgSubtle,
                  color: selected ? '#fff' : color.textPrimary,
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  minWidth: 52,
                }}
              >
                {row.rate}%
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <Box sx={{ textAlign: 'right', minWidth: 88 }}>
      <Typography sx={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.06em', color: color.textMuted }}>
        {label.toUpperCase()}
      </Typography>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: accent, lineHeight: 1.3, mt: 0.5 }}>{value}</Typography>
    </Box>
  );
}

function Track({
  label,
  value,
  max,
  barColor,
  delay,
}: {
  label: string;
  value: number;
  max: number;
  barColor: string;
  delay: number;
}) {
  const pct = Math.max(4, (value / max) * 100);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: color.textSecondary }}>{label}</Typography>
        <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: color.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
          {formatNumber(value)}
        </Typography>
      </Box>
      <Box sx={{ height: 14, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.75)', overflow: 'hidden' }}>
        <Box
          className="ic-bar-grow"
          sx={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 999,
            backgroundColor: barColor,
            animationDelay: `${delay}ms`,
            transition: 'width 450ms cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </Box>
    </Box>
  );
}
