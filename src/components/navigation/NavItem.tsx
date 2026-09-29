import { useLocation, useNavigate } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import type { NavItemConfig } from '../../config/navigation';
import { color } from '../../theme/tokens';

interface NavItemProps {
  item: NavItemConfig;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function NavItem({ item, collapsed, onNavigate }: NavItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname.startsWith(item.path);
  const Icon = item.icon;

  const button = (
    <ListItemButton
      selected={isActive}
      onClick={() => {
        navigate(item.path);
        onNavigate?.();
      }}
      aria-current={isActive ? 'page' : undefined}
      sx={{
        gap: 1.25,
        justifyContent: collapsed ? 'center' : 'flex-start',
        px: collapsed ? 1 : 1.5,
        py: 1.05,
        color: isActive ? color.primaryDark : color.textSecondary,
        border: '1px solid',
        borderColor: isActive ? color.primaryLight : 'transparent',
        backgroundColor: isActive ? color.primarySurface : 'transparent',
        '&:hover': {
          backgroundColor: isActive ? color.primaryLight : color.bgSubtle,
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
        <Icon fontSize="small" />
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={item.label}
          slotProps={{
            primary: {
              sx: {
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.875rem',
                transition: 'font-weight 140ms ease',
              },
            },
          }}
        />
      )}
    </ListItemButton>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.label} placement="right">
        {button}
      </Tooltip>
    );
  }

  return button;
}
