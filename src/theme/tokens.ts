/**
 * Design tokens for InfinityConnect.
 * Visual source of truth: Figma Design file (node 21:2890).
 */

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const color = {
  // Neutral surfaces — clean white SaaS from Figma
  bgApp: '#FFFFFF',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F5F5F5',
  bgElevated: '#FFFFFF',
  bgInverse: '#001833',
  bgRail: '#FFFFFF',

  border: '#E2E2E4',
  borderStrong: '#D0D0D4',
  divider: '#E2E2E4',

  textPrimary: '#001833',
  textSecondary: '#6D6E78',
  textMuted: '#76768B',
  textInverse: '#FFFFFF',
  textDisabled: '#A0A1AB',

  // Brand — iOS-style system blue from Figma (#007AFF)
  primary: '#007AFF',
  primaryDark: '#0062CC',
  primaryLight: '#D6E9FF',
  primarySurface: '#E8F2FF',

  // Semantic
  success: '#168969',
  successSurface: '#F0FFF7',
  warning: '#F79009',
  warningSurface: '#FFF7EB',
  error: '#E31F26',
  errorSurface: '#FDF0F0',
  info: '#007AFF',
  infoSurface: '#E8F2FF',

  // Trend / KPI accents
  trendUp: '#F03131',
  trendDown: '#168969',
  kpiNegativeBorder: '#F0CBCB',
  kpiPositiveBorder: '#CBF0DA',
  kpiNegativeWash: 'rgb(243, 215, 215)',
  kpiPositiveWash: 'rgb(240, 255, 247)',

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

  // Status labels (agent presence)
  statusOnline: '#168969',
  statusAway: '#F79009',
  statusOffline: '#6D6E78',
} as const;

export const elevation = {
  0: 'none',
  1: '0 1px 2px rgba(0, 24, 51, 0.04)',
  2: '0 2px 8px rgba(0, 24, 51, 0.06)',
  3: '0 8px 24px rgba(0, 24, 51, 0.08)',
  4: '0 16px 40px rgba(0, 24, 51, 0.10)',
} as const;

export const zIndex = {
  sidebar: 1100,
  topbar: 1200,
  drawer: 1300,
  modal: 1400,
  toast: 1500,
} as const;

export const layout = {
  sidebarExpanded: 220,
  sidebarCollapsed: 72,
  topbarHeight: 76,
  pageHeaderHeight: 76,
  /** Conversation header + context panel tabs share this so their bottoms align. */
  inboxHeaderHeight: 78,
  contentPaddingX: 16,
  contentPaddingY: 24,
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
