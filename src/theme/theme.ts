import { createTheme, alpha } from '@mui/material/styles';
import { color, radius, space, elevation, breakpointsPx } from './tokens';
import { typography } from './typography';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: breakpointsPx.tablet,
      md: breakpointsPx.laptop,
      lg: breakpointsPx.desktop,
      xl: breakpointsPx.desktopL,
    },
  },
  palette: {
    mode: 'light',
    primary: { main: color.primary, dark: color.primaryDark, light: color.primaryLight, contrastText: '#fff' },
    success: { main: color.success, light: color.successSurface },
    warning: { main: color.warning, light: color.warningSurface },
    error: { main: color.error, light: color.errorSurface },
    info: { main: color.info, light: color.infoSurface },
    background: { default: color.bgApp, paper: color.bgSurface },
    text: { primary: color.textPrimary, secondary: color.textSecondary, disabled: color.textDisabled },
    divider: color.divider,
    action: {
      hover: alpha(color.primary, 0.04),
      selected: color.primarySurface,
    },
  },
  shape: { borderRadius: radius.md },
  spacing: 4,
  typography,
  shadows: [
    'none',
    elevation[1],
    elevation[1],
    elevation[2],
    elevation[2],
    elevation[2],
    elevation[3],
    elevation[3],
    elevation[3],
    elevation[3],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
    elevation[4],
  ] as unknown as import('@mui/material/styles').Shadows,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: color.bgApp,
          color: color.textPrimary,
          scrollbarColor: `${color.borderStrong} transparent`,
        },
        '*::-webkit-scrollbar': { width: 8, height: 8 },
        '*::-webkit-scrollbar-thumb': { backgroundColor: color.borderStrong, borderRadius: radius.pill },
        '*::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
      },
    },
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          paddingInline: space.md,
          paddingBlock: 11,
          fontWeight: 700,
          fontSize: '0.875rem',
          lineHeight: '18px',
          minHeight: 40,
          transition: 'background-color 140ms ease, border-color 140ms ease, color 140ms ease',
        },
        outlined: {
          borderColor: color.primary,
          borderWidth: 1,
          color: color.primary,
          backgroundColor: color.bgSurface,
          '&:hover': {
            borderColor: color.primaryDark,
            backgroundColor: color.primarySurface,
            borderWidth: 1,
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none', backgroundColor: color.primaryDark },
        },
        sizeSmall: {
          paddingInline: space.sm,
          paddingBlock: 8,
          minHeight: 36,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          color: color.textPrimary,
          '&:focus-visible': {
            outline: `2px solid ${color.primary}`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: radius.md },
        outlined: { borderColor: color.border },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          border: `1px solid ${color.border}`,
          boxShadow: 'none',
          backgroundColor: color.bgSurface,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: color.bgSurface,
          color: color.textPrimary,
          boxShadow: 'none',
          borderBottom: `0.5px solid ${color.border}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: color.bgRail,
          borderRight: `0.5px solid ${color.border}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: radius.sm, fontWeight: 700, fontSize: '0.75rem' },
        sizeSmall: { height: 22 },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          backgroundColor: color.bgSubtle,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: color.border },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: color.borderStrong },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: color.primary, borderWidth: 1.5 },
          '&.Mui-focused': { backgroundColor: color.bgSurface },
        },
        input: {
          fontWeight: 700,
          fontSize: '0.875rem',
          color: color.textPrimary,
          '&::placeholder': { color: color.textMuted, opacity: 1 },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 44 },
        indicator: {
          height: 2,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          backgroundColor: color.primary,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.875rem',
          lineHeight: '18px',
          color: color.textSecondary,
          paddingInline: space.sm,
          '&.Mui-selected': { color: color.primary },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${color.divider}`,
          padding: `${space.sm}px ${space.sm}px`,
          fontSize: '0.875rem',
          fontWeight: 500,
          color: color.textPrimary,
        },
        head: {
          color: color.textSecondary,
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'none',
          letterSpacing: 0,
          backgroundColor: color.bgSurface,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: color.bgInverse,
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: radius.sm,
          padding: `${space.xxs}px ${space.xs}px`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: radius.sm, border: `1px solid ${color.border}`, boxShadow: elevation[3] },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: radius.md },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: radius.sm, border: '1px solid transparent' },
      },
      variants: [
        {
          props: { variant: 'standard', severity: 'success' },
          style: { backgroundColor: color.successSurface, color: '#0F5A3A', borderColor: alpha(color.success, 0.25) },
        },
        {
          props: { variant: 'standard', severity: 'warning' },
          style: { backgroundColor: color.warningSurface, color: '#7A4C06', borderColor: alpha(color.warning, 0.25) },
        },
        {
          props: { variant: 'standard', severity: 'error' },
          style: { backgroundColor: color.errorSurface, color: '#8A2621', borderColor: alpha(color.error, 0.25) },
        },
        {
          props: { variant: 'standard', severity: 'info' },
          style: { backgroundColor: color.infoSurface, color: color.primaryDark, borderColor: alpha(color.info, 0.25) },
        },
      ],
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700, fontSize: '0.8125rem' },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          transition: 'background-color 140ms ease, color 140ms ease',
          '&.Mui-selected': {
            backgroundColor: color.primary,
            color: color.textInverse,
            '&:hover': { backgroundColor: color.primaryDark },
            '& .MuiListItemIcon-root': { color: color.textInverse },
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          fontSize: '0.625rem',
          fontFamily: "'Inter', 'Satoshi', sans-serif",
          minWidth: 18,
          height: 18,
          padding: 0,
          border: `2px solid ${color.bgSurface}`,
        },
        colorError: {
          backgroundColor: color.error,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: radius.pill, height: 6, backgroundColor: '#E8EEF5' },
        bar: { borderRadius: radius.pill, backgroundColor: color.primary },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: color.border },
      },
    },
  },
});

export type AppTheme = typeof theme;
