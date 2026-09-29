import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
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
    <ButtonBase
      onClick={() => {
        navigate(item.path);
        onNavigate?.();
      }}
      aria-current={isActive ? 'page' : undefined}
      focusRipple={false}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '8px',
        width: '100%',
        height: 46,
        px: collapsed ? 1 : '12px',
        py: '12px',
        borderRadius: '8px',
        color: isActive ? '#FFFFFF' : '#6D6E78',
        backgroundColor: isActive ? color.primary : 'transparent',
        fontFamily: 'inherit',
        textAlign: 'left',
        transition: 'background-color 140ms ease, color 140ms ease',
        '&:hover': {
          backgroundColor: isActive ? color.primaryDark : color.bgSubtle,
          color: isActive ? '#FFFFFF' : color.textPrimary,
        },
      }}
    >
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          width: 20,
          height: 20,
          flexShrink: 0,
          color: 'inherit',
          '& svg': { display: 'block', width: 20, height: 20 },
        }}
      >
        <Icon />
      </Box>
      {!collapsed && (
        <Box
          component="span"
          sx={{
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '18px',
            whiteSpace: 'nowrap',
            color: 'inherit',
          }}
        >
          {item.label}
        </Box>
      )}
    </ButtonBase>
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
