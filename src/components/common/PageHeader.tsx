import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { color } from '../../theme/tokens';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
}

/**
 * Shared page chrome matching Figma header strip:
 * title + subtitle on the left, optional tabs/actions on the right.
 */
export function PageHeader({ title, subtitle, actions, tabs }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: tabs ? 'flex-end' : 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
        px: { xs: 2, md: '22px' },
        pt: { xs: 2, md: 1.5 },
        pb: 0,
        borderBottom: `0.5px solid ${color.border}`,
        backgroundColor: color.bgSurface,
        minHeight: { xs: 'auto', md: 76 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          py: 1.5,
          minWidth: 0,
          flex: '1 1 240px',
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: '1.375rem',
            fontWeight: 700,
            lineHeight: '30px',
            letterSpacing: '0.002em',
            color: color.textPrimary,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              lineHeight: '18px',
              color: color.textSecondary,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {(tabs || actions) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: tabs ? 'flex-end' : 'center',
            gap: 1.5,
            flex: { xs: '1 1 100%', md: '0 1 auto' },
            minWidth: 0,
            ml: { md: 'auto' },
            overflow: 'hidden',
          }}
        >
          {actions}
          {tabs}
        </Box>
      )}
    </Box>
  );
}
