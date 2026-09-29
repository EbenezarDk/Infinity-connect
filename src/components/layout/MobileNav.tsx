import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import { NavItem } from '../navigation/NavItem';
import { getNavItemsForRole } from '../../config/navigation';
import { useRole } from '../../context/RoleContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { color, elevation } from '../../theme/tokens';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { role } = useRole();
  const items = getNavItemsForRole(role);

  return (
    <Drawer open={open} onClose={onClose} anchor="left" slotProps={{ paper: { sx: { width: 280, backgroundColor: color.bgRail } } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2, height: 64 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            background: `linear-gradient(145deg, ${color.primary} 0%, #0D9488 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: elevation[1],
          }}
        >
          <HubRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 800, lineHeight: 1.2 }}>
            InfinityConnect
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Omnichannel workspace
          </Typography>
        </Box>
      </Box>
      <List sx={{ px: 1.25, py: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {items.map((item) => (
          <NavItem key={item.key} item={item} onNavigate={onClose} />
        ))}
      </List>
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
