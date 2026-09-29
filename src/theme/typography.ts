import type { TypographyVariantsOptions } from '@mui/material/styles';

export const fontFamily = "'Satoshi', 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

export const typography: TypographyVariantsOptions = {
  fontFamily,
  htmlFontSize: 16,
  h1: { fontFamily, fontWeight: 700, fontSize: '2rem', lineHeight: 1.25, letterSpacing: '-0.01em', color: '#001833' },
  h2: { fontFamily, fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.28, letterSpacing: '-0.01em', color: '#001833' },
  // Page titles — Figma 22px / Bold
  h3: { fontFamily, fontWeight: 700, fontSize: '1.375rem', lineHeight: '30px', letterSpacing: '0.002em', color: '#001833' },
  // Section titles — Figma 18px / Bold
  h4: { fontFamily, fontWeight: 700, fontSize: '1.125rem', lineHeight: '26px', letterSpacing: '0.002em', color: '#000314' },
  h5: { fontFamily, fontWeight: 700, fontSize: '1rem', lineHeight: 1.4, color: '#001833' },
  h6: { fontFamily, fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.4, color: '#001833' },
  subtitle1: { fontFamily, fontWeight: 700, fontSize: '0.875rem', lineHeight: '18px', color: '#001833' },
  subtitle2: { fontFamily, fontWeight: 500, fontSize: '0.75rem', lineHeight: '18px', color: '#6D6E78' },
  body1: { fontFamily, fontWeight: 500, fontSize: '0.875rem', lineHeight: '18px', color: '#001833' },
  body2: { fontFamily, fontWeight: 500, fontSize: '0.875rem', lineHeight: '18px', color: '#6D6E78' },
  button: { fontFamily, fontWeight: 700, fontSize: '0.875rem', textTransform: 'none', lineHeight: '18px' },
  caption: { fontFamily, fontWeight: 500, fontSize: '0.75rem', lineHeight: '18px', color: '#6D6E78' },
  overline: {
    fontFamily,
    fontWeight: 700,
    fontSize: '0.6875rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#6D6E78',
  },
};
