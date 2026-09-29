import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { NavItem } from '../navigation/NavItem';
import { BrandMark } from '../common/BrandMark';
import { getNavItemsForRole } from '../../config/navigation';
import { useRole } from '../../context/RoleContext';
import { color, layout } from '../../theme/tokens';

export const SIDEBAR_WIDTH_EXPANDED = layout.sidebarExpanded;
export const SIDEBAR_WIDTH_COLLAPSED = layout.sidebarCollapsed;

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  variant: 'permanent' | 'rail';
}

export function Sidebar({ collapsed, onToggleCollapsed }: SidebarProps) {
  const { role } = useRole();
  const items = getNavItemsForRole(role);

  return (
    <Box
      component="nav"
      aria-label="Primary"
      sx={{
        position: 'relative',
        width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '0.5px solid',
        borderColor: color.border,
        backgroundColor: '#FFFFFF',
        transition: 'width 180ms ease',
        overflow: 'visible',
        zIndex: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: collapsed ? 1 : '16px',
          py: '16px',
          justifyContent: 'center',
          minHeight: 68,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Tooltip title={collapsed ? 'Expand navigation' : 'Collapse navigation'}>
          <ButtonBase
            onClick={onToggleCollapsed}
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            sx={{
              borderRadius: '8px',
              p: 0.5,
              '&:hover': { backgroundColor: color.bgSubtle },
            }}
          >
            <BrandMark collapsed={collapsed} size={24} />
          </ButtonBase>
        </Tooltip>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          px: '4px',
          pt: '32px',
          pb: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {items.map((item) => (
          <NavItem key={item.key} item={item} collapsed={collapsed} />
        ))}
      </Box>

      {/* Edge toggle — 50% inside / 50% outside the border */}
      <Tooltip title={collapsed ? 'Expand navigation' : 'Collapse navigation'} placement="right">
        <IconButton
          size="small"
          onClick={onToggleCollapsed}
          aria-label="Toggle navigation width"
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 16,
            transform: 'translateX(50%)',
            width: 28,
            height: 28,
            p: 0,
            backgroundColor: '#FFFFFF',
            border: `1px solid ${color.border}`,
            boxShadow: '0 1px 4px rgba(0,24,51,0.08)',
            color: color.textSecondary,
            zIndex: 3,
            '&:hover': {
              backgroundColor: color.bgSubtle,
              color: color.textPrimary,
            },
          }}
        >
          {collapsed ? (
            <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
          ) : (
            <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
