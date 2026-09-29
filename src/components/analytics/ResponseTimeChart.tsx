import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { color, radius } from '../../theme/tokens';

interface ResponseTimeChartProps {
  labels: string[];
  values: number[];
  targetMinutes?: number;
  title?: string;
}

const CHART_H = 220;
const VALUE_H = 22;
const LABEL_H = 36;
const BAR_AREA = CHART_H - VALUE_H - LABEL_H;

export function ResponseTimeChart({
  labels,
  values,
  targetMinutes = 5.5,
  title = 'First response time — last 7 days',
}: ResponseTimeChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const bestIdx = useMemo(() => values.indexOf(Math.min(...values)), [values]);
  const max = Math.max(...values, targetMinutes) * 1.12;
  const idx = active ?? bestIdx;
  const underTarget = values.filter((v) => v <= targetMinutes).length;
  const onTarget = values[idx] <= targetMinutes;

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
            Target {targetMinutes}m · green under · amber over
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Box
            sx={{
              textAlign: 'right',
              px: '16px',
              py: '12px',
              borderRadius: `${radius.sm}px`,
              backgroundColor: onTarget ? color.successSurface : color.warningSurface,
              border: `1px solid ${onTarget ? color.kpiPositiveBorder : '#F5D9A8'}`,
            }}
          >
            <Typography sx={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.06em', color: color.textMuted }}>
              SELECTED
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: color.textPrimary, lineHeight: 1.15, mt: 0.5 }}>
              {values[idx].toFixed(1)}
              <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 700, color: color.textSecondary, ml: 0.5 }}>
                min
              </Typography>
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: color.textSecondary, mt: 0.25 }}>
              {labels[idx]} · {onTarget ? 'on target' : 'above target'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right', minWidth: 88 }}>
            <Typography sx={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.06em', color: color.textMuted }}>
              UNDER TARGET
            </Typography>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: color.success, lineHeight: 1.2, mt: 0.5 }}>
              {underTarget}/{values.length}
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: color.textSecondary, mt: 0.25 }}>days</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ position: 'relative', height: CHART_H }}>
        {/* Target line — 50% opacity, light weight */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: LABEL_H + (targetMinutes / max) * BAR_AREA,
            borderTop: '1px dotted rgba(22, 137, 105, 0.5)',
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
              color: color.success,
              letterSpacing: '0.04em',
            }}
          >
            TARGET {targetMinutes}m
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
            const isBest = i === bestIdx;
            const isDull = active !== null && !isActive;
            const ok = v <= targetMinutes;
            const h = Math.max(8, (v / max) * BAR_AREA);
            const strong = ok ? color.success : color.warning;
            const soft = ok ? '#B8E8D0' : '#FDE4B8';

            return (
              <Box
                key={labels[i]}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
                role="button"
                aria-label={`${labels[i]}: ${v} minutes`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  cursor: 'pointer',
                  outline: 'none',
                  opacity: isDull ? 0.4 : 1,
                  transition: 'opacity 160ms ease',
                  '&:focus-visible .bar': { outline: `2px solid ${strong}`, outlineOffset: 2 },
                }}
              >
                <Box sx={{ height: VALUE_H, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '100%' }}>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                      fontWeight: 800,
                      color: isActive ? strong : color.textPrimary,
                      fontVariantNumeric: 'tabular-nums',
                      lineHeight: 1,
                    }}
                  >
                    {v.toFixed(1)}
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
                      background: isActive || isBest ? strong : soft,
                      boxShadow: isBest ? `0 6px 16px ${strong}40` : 'none',
                      border: isBest ? `1.5px solid ${strong}` : '1.5px solid transparent',
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
                      color: color.success,
                      letterSpacing: '0.06em',
                      lineHeight: 1.2,
                      mt: 0.25,
                      visibility: isBest ? 'visible' : 'hidden',
                    }}
                  >
                    BEST
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 160, height: 8, borderRadius: 999, backgroundColor: color.bgSubtle, overflow: 'hidden' }}>
          <Box
            sx={{
              width: `${(underTarget / values.length) * 100}%`,
              height: '100%',
              borderRadius: 999,
              background: `linear-gradient(90deg, ${color.success}, #3BC98A)`,
              transition: 'width 400ms ease',
            }}
          />
        </Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: color.textSecondary }}>
          {underTarget} of {values.length} days under target
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: color.success }}>
          Best {labels[bestIdx]} · {values[bestIdx].toFixed(1)}m
        </Typography>
      </Box>
    </Box>
  );
}
