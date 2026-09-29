import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import { GlobalSearch } from '../common/GlobalSearch';
import { NotificationsMenu } from '../common/NotificationsMenu';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { ContactAvatar } from '../common/ContactAvatar';
import { useCurrentAgent } from '../../context/RoleContext';
import { color, elevation } from '../../theme/tokens';

interface TopBarProps {
  onOpenMobileNav?: () => void;
  showMenuButton: boolean;
}

export function TopBar({ onOpenMobileNav, showMenuButton }: TopBarProps) {
  const agent = useCurrentAgent();
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);

  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: (t) => t.zIndex.appBar }}>
      <Toolbar sx={{ minHeight: 64, gap: 1.5, px: { xs: 1.5, sm: 2.5 } }}>
        {showMenuButton && (
          <IconButton edge="start" onClick={onOpenMobileNav} aria-label="Open navigation menu">
            <MenuRoundedIcon />
          </IconButton>
        )}

        {showMenuButton && (
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: 1.25,
              background: `linear-gradient(145deg, ${color.primary} 0%, #0D9488 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: elevation[1],
            }}
          >
            <HubRoundedIcon sx={{ fontSize: 15, color: '#fff' }} />
          </Box>
        )}

        <Box sx={{ flex: 1, display: 'flex', justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
          <GlobalSearch />
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <RoleSwitcher />
        </Box>

        <Tooltip title="Help & resources">
          <IconButton aria-label="Help and resources" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            <HelpOutlineRoundedIcon />
          </IconButton>
        </Tooltip>

        <NotificationsMenu />

        {agent && (
          <>
            <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} aria-label="Open profile menu" sx={{ p: 0.25 }}>
              <ContactAvatar name={agent.name} color={agent.avatarColor} size={34} />
            </IconButton>
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={() => setProfileAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Box sx={{ px: 2, py: 1.25, minWidth: 220 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {agent.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {agent.status === 'online' ? 'Online' : agent.status === 'away' ? 'Away' : 'Offline'} · Meridian Retail
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => setProfileAnchor(null)}>Profile settings</MenuItem>
              <MenuItem onClick={() => setProfileAnchor(null)}>Notification preferences</MenuItem>
              <Divider />
              <MenuItem onClick={() => setProfileAnchor(null)}>Sign out</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
