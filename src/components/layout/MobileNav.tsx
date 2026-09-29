import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { NavItem } from '../navigation/NavItem';
import { BrandMark } from '../common/BrandMark';
import { getNavItemsForRole } from '../../config/navigation';
import { useRole } from '../../context/RoleContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { color } from '../../theme/tokens';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { role } = useRole();
  const items = getNavItemsForRole(role);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="left"
      slotProps={{
        paper: {
          sx: {
            width: 280,
            backgroundColor: '#FFFFFF',
            borderRight: `0.5px solid ${color.border}`,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', px: '22px', py: '22px', minHeight: 68 }}>
        <BrandMark size={24} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          px: '4px',
          pt: '32px',
          pb: 1.5,
        }}
      >
        {items.map((item) => (
          <NavItem key={item.key} item={item} onNavigate={onClose} />
        ))}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Demo mode
        </Typography>
        <RoleSwitcher />
      </Box>
    </Drawer>
  );
}
