import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { color } from '../../theme/tokens';

export function AppShell() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [railCollapsed, setRailCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: color.bgApp,
      }}
    >
      {isDesktop && <Sidebar collapsed={false} onToggleCollapsed={() => {}} variant="permanent" />}
      {isTablet && (
        <Sidebar collapsed={railCollapsed} onToggleCollapsed={() => setRailCollapsed((c) => !c)} variant="rail" />
      )}
      {isMobile && <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />}

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <TopBar showMenuButton={isMobile} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: 'hidden',
            p: { xs: 0, md: 1.5 },
          }}
        >
          <Box
            sx={{
              height: '100%',
              overflow: 'hidden',
              borderRadius: { xs: 0, md: 2.5 },
              border: { xs: 'none', md: '1px solid' },
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              boxShadow: { xs: 'none', md: '0 1px 2px rgba(11,18,32,0.04)' },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
