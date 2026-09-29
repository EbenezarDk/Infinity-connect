import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { channelConfigs } from '../../data/channels';
import { channelMeta } from '../../utils/meta';
import { color, radius } from '../../theme/tokens';
import { formatNumber } from '../../utils/format';
import type { ChannelType } from '../../types';

export function ChannelMessagesChart() {
  const [hovered, setHovered] = useState<ChannelType | null>(null);
  const rows = useMemo(() => {
    const max = Math.max(...channelConfigs.map((c) => c.messagesToday));
    const total = channelConfigs.reduce((s, c) => s + c.messagesToday, 0);
    return channelConfigs
      .map((c) => ({
        id: c.channel,
        label: channelMeta[c.channel].label,
        full: c.displayName,
        value: c.messagesToday,
        share: Math.round((c.messagesToday / total) * 100),
        pct: (c.messagesToday / max) * 100,
        color: channelMeta[c.channel].main,
        surface: channelMeta[c.channel].surface,
      }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const total = rows.reduce((s, r) => s + r.value, 0);
  const top = rows[0];
  const focus = hovered ? rows.find((r) => r.id === hovered) ?? top : null;

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
        height: { xs: 'auto', md: 290 },
        minHeight: { xs: 0, md: 290 },
        boxSizing: 'border-box',
        overflow: { xs: 'visible', md: 'hidden' },
      }}
      className="ic-chart-enter"
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexShrink: 0 }}>
        <Box>
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: '26px', color: color.textPrimary }}>
            Messages today by channel
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: color.textSecondary, mt: 0.5 }}>
            All channels at a glance · hover a row for detail
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, color: color.textPrimary }}>
            {formatNumber(total)}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: color.textSecondary, mt: 0.5 }}>
            messages today
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ display: 'flex', gap: '16px', flex: 1, minHeight: 0, alignItems: 'stretch' }}
        onMouseLeave={() => setHovered(null)}
      >
        <Box
          sx={{
            flex: '0 0 220px',
            minWidth: 200,
            borderRadius: `${radius.md}px`,
            border: `1px solid ${focus ? `${focus.color}44` : color.border}`,
            background: focus
              ? `linear-gradient(160deg, ${focus.surface} 0%, ${color.bgSurface} 70%)`
              : color.bgSubtle,
            p: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'border-color 200ms ease, background 200ms ease',
            overflow: 'auto',
          }}
        >
          {focus ? (
            <>
              <Box>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: focus.color,
                    mb: 1.5,
                    boxShadow: `0 0 0 4px ${focus.color}22`,
                  }}
                />
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, color: color.textMuted, letterSpacing: '0.06em' }}>
                  FOCUS
                </Typography>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 800, color: color.textPrimary, mt: 0.5 }}>
                  {focus.label}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: color.textMuted, mt: 0.5 }}>
                  {focus.full}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: focus.color }}>
                  {formatNumber(focus.value)}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: color.textSecondary, mt: 1 }}>
                  {focus.share}% of today’s volume
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, color: color.textMuted, letterSpacing: '0.06em' }}>
                  OVERVIEW
                </Typography>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 800, color: color.textPrimary, mt: 0.5 }}>
                  All channels
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: color.textMuted, mt: 0.5 }}>
                  {rows.length} active · lead {top.label}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {rows.map((r) => (
                  <Box key={r.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: r.color, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: color.textPrimary }}>{r.label}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: color.textSecondary, fontVariantNumeric: 'tabular-nums' }}>
                      {r.share}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
          {rows.map((row, i) => {
            const isHovered = hovered === row.id;
            const isDull = hovered !== null && !isHovered;
            return (
              <Box
                key={row.id}
                onMouseEnter={() => setHovered(row.id)}
                onFocus={() => setHovered(row.id)}
                tabIndex={0}
                role="button"
                aria-label={`${row.label}: ${row.value} messages, ${row.share}%`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: '10px', sm: '16px' },
                  flexWrap: 'wrap',
                  cursor: 'pointer',
                  outline: 'none',
                  opacity: isDull ? 0.38 : 1,
                  transition: 'opacity 160ms ease',
                  minWidth: 0,
                  width: '100%',
                  '&:focus-visible': { outline: `2px solid ${row.color}`, outlineOffset: 2, borderRadius: 4 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: color.textMuted,
                    width: 22,
                    flexShrink: 0,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </Typography>

                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: color.textPrimary,
                    width: { xs: 56, sm: 72 },
                    flexShrink: 0,
                  }}
                >
                  {row.label}
                </Typography>

                <Box
                  sx={{
                    flex: '1 1 120px',
                    minWidth: 80,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: color.bgSubtle,
                    overflow: 'hidden',
                    order: { xs: 3, sm: 0 },
                    flexBasis: { xs: '100%', sm: 'auto' },
                  }}
                >
                  <Box
                    className="ic-bar-grow"
                    sx={{
                      width: `${row.pct}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: `linear-gradient(90deg, ${row.color}99, ${row.color})`,
                      transition: 'width 400ms ease',
                      animationDelay: `${i * 60}ms`,
                      minWidth: row.pct > 0 ? 4 : 0,
                      boxShadow: isHovered ? `0 0 10px ${row.color}44` : 'none',
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: color.textSecondary,
                    flexShrink: 0,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {row.share}% of volume
                </Typography>

                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: row.color,
                    flexShrink: 0,
                    minWidth: 56,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatNumber(row.value)} msgs
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
