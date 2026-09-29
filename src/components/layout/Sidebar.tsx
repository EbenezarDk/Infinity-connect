import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { NavItem } from '../navigation/NavItem';
import { getNavItemsForRole } from '../../config/navigation';
import { useRole } from '../../context/RoleContext';
import { color, elevation } from '../../theme/tokens';

export const SIDEBAR_WIDTH_EXPANDED = 236;
export const SIDEBAR_WIDTH_COLLAPSED = 76;

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  variant: 'permanent' | 'rail';
}

export function Sidebar({ collapsed, onToggleCollapsed, variant }: SidebarProps) {
  const { role } = useRole();
  const items = getNavItemsForRole(role);

  return (
    <Box
      component="nav"
      aria-label="Primary"
      sx={{
        width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid',
        borderColor: 'divider',
        backgroundColor: color.bgRail,
        transition: 'width 180ms ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: collapsed ? 1.5 : 2,
          height: 64,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            background: `linear-gradient(145deg, ${color.primary} 0%, #0D9488 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: elevation[1],
          }}
        >
          <HubRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
        </Box>
        {!collapsed && (
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontSize: '0.95rem', lineHeight: 1.2, fontWeight: 800 }}>
              InfinityConnect
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
              Omnichannel workspace
            </Typography>
          </Box>
        )}
      </Box>

      <List sx={{ flex: 1, px: 1.25, py: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {items.map((item) => (
          <NavItem key={item.key} item={item} collapsed={collapsed} />
        ))}
      </List>

      {variant === 'rail' && (
        <>
          <Divider />
          <Box sx={{ p: 1, display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
            <Tooltip title={collapsed ? 'Expand navigation' : 'Collapse navigation'}>
              <IconButton size="small" onClick={onToggleCollapsed} aria-label="Toggle navigation width">
                {collapsed ? <ChevronRightRoundedIcon fontSize="small" /> : <ChevronLeftRoundedIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}
    </Box>
  );
}
