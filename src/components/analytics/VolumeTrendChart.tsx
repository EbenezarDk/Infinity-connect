import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { color, radius } from '../../theme/tokens';

interface VolumeTrendChartProps {
  labels: string[];
  values: number[];
  title?: string;
}

const CHART_H = 220;
const VALUE_H = 22;
const LABEL_H = 36;
const BAR_AREA = CHART_H - VALUE_H - LABEL_H;

export function VolumeTrendChart({
  labels,
  values,
  title = 'Conversation volume — last 7 days',
}: VolumeTrendChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const peakIdx = useMemo(() => values.indexOf(Math.max(...values)), [values]);
  const total = values.reduce((s, v) => s + v, 0);
  const avg = Math.round(total / values.length);
  const max = Math.max(...values, 1);
  const idx = active ?? peakIdx;

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
      onMouseLeave={() => setActive(null)}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: '26px', color: color.textPrimary }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: color.textSecondary, mt: 0.5 }}>
            Daily volume · hover a bar for detail
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Stat label="Selected" value={values[idx].toLocaleString()} hint={labels[idx]} accent={color.primary} />
          <Stat label="Week total" value={total.toLocaleString()} />
          <Stat label="Daily avg" value={String(avg)} />
        </Box>
      </Box>

      <Box sx={{ position: 'relative', height: CHART_H }}>
        {/* Avg guide — 50% opacity, light weight */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: LABEL_H + (avg / max) * BAR_AREA,
            borderTop: '1px dotted rgba(0, 122, 255, 0.5)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              position: 'absolute',
              right: 0,
              top: -16,
              fontSize: '0.625rem',
              fontWeight: 700,
              color: color.primary,
              letterSpacing: '0.04em',
            }}
          >
            AVG {avg}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
            gap: { xs: '8px', sm: '16px' },
            height: '100%',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {values.map((v, i) => {
            const isActive = i === idx;
            const isPeak = i === peakIdx;
            const isDull = active !== null && !isActive;
            const h = Math.max(8, (v / max) * BAR_AREA);
            return (
              <Box
                key={labels[i]}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
                role="button"
                aria-label={`${labels[i]}: ${v} conversations`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  cursor: 'pointer',
                  outline: 'none',
                  opacity: isDull ? 0.4 : 1,
                  transition: 'opacity 160ms ease',
                  '&:focus-visible .bar': { outline: `2px solid ${color.primary}`, outlineOffset: 2 },
                }}
              >
                <Box sx={{ height: VALUE_H, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '100%' }}>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                      fontWeight: 800,
                      color: isActive ? color.primary : color.textPrimary,
                      fontVariantNumeric: 'tabular-nums',
                      lineHeight: 1,
                    }}
                  >
                    {v}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <Box
                    className="bar ic-bar-grow"
                    sx={{
                      width: '100%',
                      maxWidth: { xs: 36, sm: 48 },
                      height: h,
                      borderRadius: '8px',
                      background: isPeak
                        ? color.primary
                        : isActive
                          ? '#4DA3FF'
                          : color.primaryLight,
                      boxShadow: isPeak ? `0 6px 16px ${color.primary}40` : 'none',
                      transition: 'background 180ms ease, box-shadow 180ms ease',
                      animationDelay: `${i * 50}ms`,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    height: LABEL_H,
                    pt: 1,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? color.textPrimary : color.textSecondary,
                      lineHeight: 1.2,
                    }}
                  >
                    {labels[i]}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.5625rem',
                      fontWeight: 800,
                      color: color.primary,
                      letterSpacing: '0.06em',
                      lineHeight: 1.2,
                      mt: 0.25,
                      visibility: isPeak ? 'visible' : 'hidden',
                    }}
                  >
                    PEAK
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <Box sx={{ textAlign: 'right', minWidth: 72 }}>
      <Typography sx={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.06em', color: color.textMuted }}>
        {label.toUpperCase()}
      </Typography>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: accent ?? color.textPrimary, lineHeight: 1.2, mt: 0.5 }}>
        {value}
      </Typography>
      {hint && (
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: color.textSecondary, mt: 0.25 }}>{hint}</Typography>
      )}
    </Box>
  );
}
