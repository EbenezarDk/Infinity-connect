import type { TypographyVariantsOptions } from '@mui/material/styles';

export const fontFamily = "'Satoshi', 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

export const typography: TypographyVariantsOptions = {
  fontFamily,
  htmlFontSize: 16,
  h1: { fontFamily, fontWeight: 700, fontSize: '2.25rem', lineHeight: 1.25, letterSpacing: '-0.01em' },
  h2: { fontFamily, fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.28, letterSpacing: '-0.01em' },
  h3: { fontFamily, fontWeight: 600, fontSize: '1.375rem', lineHeight: 1.3 },
  h4: { fontFamily, fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.35 },
  h5: { fontFamily, fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 },
  h6: { fontFamily, fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.4 },
  subtitle1: { fontFamily, fontWeight: 500, fontSize: '0.9375rem', lineHeight: 1.5 },
  subtitle2: { fontFamily, fontWeight: 500, fontSize: '0.8125rem', lineHeight: 1.45, color: undefined },
  body1: { fontFamily, fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.55 },
  body2: { fontFamily, fontWeight: 400, fontSize: '0.8125rem', lineHeight: 1.5 },
  button: { fontFamily, fontWeight: 600, fontSize: '0.8125rem', textTransform: 'none' },
  caption: { fontFamily, fontWeight: 500, fontSize: '0.6875rem', lineHeight: 1.4, letterSpacing: '0.01em' },
  overline: {
    fontFamily,
    fontWeight: 700,
    fontSize: '0.6875rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
};
