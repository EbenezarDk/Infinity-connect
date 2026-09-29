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
import { GlobalSearch } from '../common/GlobalSearch';
import { NotificationsMenu } from '../common/NotificationsMenu';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { ContactAvatar } from '../common/ContactAvatar';
import { BrandMark } from '../common/BrandMark';
import { useCurrentAgent } from '../../context/RoleContext';
import { color, layout } from '../../theme/tokens';

interface TopBarProps {
  onOpenMobileNav?: () => void;
  showMenuButton: boolean;
}

export function TopBar({ onOpenMobileNav, showMenuButton }: TopBarProps) {
  const agent = useCurrentAgent();
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);

  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: (t) => t.zIndex.appBar }}>
      <Toolbar
        sx={{
          minHeight: { xs: 64, md: layout.topbarHeight },
          gap: { xs: 1, md: 1 },
          px: { xs: 1.5, sm: '22px' },
          py: { xs: 1, md: 2 },
        }}
      >
        {showMenuButton && (
          <IconButton edge="start" onClick={onOpenMobileNav} aria-label="Open navigation menu">
            <MenuRoundedIcon />
          </IconButton>
        )}

        {showMenuButton && <BrandMark collapsed size={22} />}

        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: '12px',
            minWidth: 0,
          }}
        >
          <RoleSwitcher />
          {agent && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  lineHeight: '18px',
                  color: color.textPrimary,
                  whiteSpace: 'nowrap',
                }}
              >
                Welcome, {agent.name.split(' ')[0]}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  lineHeight: '18px',
                  color: color.textSecondary,
                  whiteSpace: 'nowrap',
                }}
              >
                Meridian Retail
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ flex: { xs: 1, sm: 0 }, display: { xs: 'block', sm: 'none' } }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: { xs: 0, md: 'auto' }, flexShrink: 0 }}>
          <GlobalSearch />

          <Tooltip title="Help & resources">
            <IconButton aria-label="Help and resources" sx={{ display: { xs: 'none', sm: 'inline-flex' }, p: 0.5 }}>
              <HelpOutlineRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <NotificationsMenu />

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: 'none', sm: 'block' }, borderColor: color.border }} />

          {agent && (
            <>
              <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} aria-label="Open profile menu" sx={{ p: 0 }}>
                <ContactAvatar name={agent.name} color={agent.avatarColor} size={44} />
              </IconButton>
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={() => setProfileAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Box sx={{ px: 2, py: 1.25, minWidth: 220 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: color.textPrimary }}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}
