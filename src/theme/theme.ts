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
          backgroundImage: `radial-gradient(1200px 600px at 0% 0%, ${alpha(color.primary, 0.06)} 0%, transparent 55%), radial-gradient(900px 500px at 100% 0%, ${alpha('#0D9488', 0.05)} 0%, transparent 50%)`,
          backgroundAttachment: 'fixed',
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
          paddingBlock: space.xs,
          fontWeight: 600,
          transition: 'background-color 140ms ease, border-color 140ms ease, color 140ms ease',
        },
        outlined: {
          borderColor: color.border,
          '&:hover': { borderColor: color.borderStrong, backgroundColor: color.bgSubtle },
        },
        sizeSmall: { paddingInline: space.sm, fontSize: '0.75rem' },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none', backgroundColor: color.primaryDark },
          },
        },
      ],
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
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
        rounded: { borderRadius: radius.lg },
        outlined: { borderColor: color.border },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          border: `1px solid ${color.border}`,
          boxShadow: 'none',
          backgroundColor: color.bgSurface,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(color.bgSurface, 0.86),
          backdropFilter: 'blur(10px)',
          color: color.textPrimary,
          boxShadow: `inset 0 -1px 0 ${color.border}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: color.bgRail,
          borderRight: `1px solid ${color.border}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: radius.sm, fontWeight: 600, fontSize: '0.6875rem' },
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
          backgroundColor: color.bgSurface,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: color.border },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: color.borderStrong },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: color.primary, borderWidth: 1.5 },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 40 },
        indicator: { height: 2.5, borderRadius: 2, backgroundColor: color.primary },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 40,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.8125rem',
          color: color.textSecondary,
          '&.Mui-selected': { color: color.primary },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${color.divider}`, padding: `${space.sm}px ${space.md}px` },
        head: {
          color: color.textSecondary,
          fontWeight: 700,
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          backgroundColor: color.bgSubtle,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: color.bgInverse,
          fontSize: '0.6875rem',
          fontWeight: 500,
          borderRadius: radius.sm,
          padding: `${space.xxs}px ${space.xs}px`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: radius.md, border: `1px solid ${color.border}`, boxShadow: elevation[3] },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: radius.lg },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: radius.md, border: '1px solid transparent' },
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
          style: { backgroundColor: color.infoSurface, color: '#0F4FD1', borderColor: alpha(color.info, 0.25) },
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
          borderRadius: radius.md,
          transition: 'background-color 140ms ease, color 140ms ease',
          '&.Mui-selected': {
            backgroundColor: color.primarySurface,
            color: color.primaryDark,
            '&:hover': { backgroundColor: color.primaryLight },
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { fontWeight: 700, fontSize: '0.625rem' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: radius.pill, height: 6, backgroundColor: color.divider },
      },
    },
  },
});

export type AppTheme = typeof theme;
