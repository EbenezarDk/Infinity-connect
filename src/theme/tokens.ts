/**
 * Design tokens for InfinityConnect.
 * Visual north star: cool light SaaS (Feedly / Google Workspace / Dust) — not purple demo MUI.
 */

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const color = {
  // Neutral surfaces — cool airy field
  bgApp: '#F4F7FB',
  bgSurface: '#FFFFFF',
  bgSubtle: '#EEF2F8',
  bgElevated: '#FFFFFF',
  bgInverse: '#0B1220',
  bgRail: '#F8FAFD',

  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  divider: '#E8EEF5',

  textPrimary: '#0B1220',
  textSecondary: '#5B6575',
  textMuted: '#8B95A5',
  textInverse: '#F4F7FB',
  textDisabled: '#B0B8C4',

  // Brand — cool professional blue
  primary: '#1A6BFF',
  primaryDark: '#0F4FD1',
  primaryLight: '#D6E6FF',
  primarySurface: '#EBF2FF',

  // Semantic
  success: '#159A5A',
  successSurface: '#E3F6EC',
  warning: '#C47A0A',
  warningSurface: '#FCF0DA',
  error: '#D13A32',
  errorSurface: '#FBEAE9',
  info: '#1A6BFF',
  infoSurface: '#EBF2FF',

  // Channel semantic accents (identity only)
  channelWhatsapp: '#1FA855',
  channelWhatsappSurface: '#E6F6ED',
  channelSms: '#0D9488',
  channelSmsSurface: '#E6F7F5',
  channelEmail: '#2563EB',
  channelEmailSurface: '#E8EFFC',
  channelRcs: '#7C3AED',
  channelRcsSurface: '#F1EBFC',

  // AI — soft cyan-blue, restrained
  aiAccent: '#0E8FBF',
  aiSurface: '#E8F6FB',
} as const;

export const elevation = {
  0: 'none',
  1: '0 1px 2px rgba(11, 18, 32, 0.05)',
  2: '0 2px 8px rgba(11, 18, 32, 0.06)',
  3: '0 8px 24px rgba(11, 18, 32, 0.08)',
  4: '0 16px 40px rgba(11, 18, 32, 0.10)',
} as const;

export const zIndex = {
  sidebar: 1100,
  topbar: 1200,
  drawer: 1300,
  modal: 1400,
  toast: 1500,
} as const;

export const breakpointsPx = {
  mobileS: 360,
  mobileM: 390,
  mobileL: 430,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  desktopL: 1440,
} as const;
