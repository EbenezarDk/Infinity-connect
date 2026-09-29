import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { roleMeta } from '../../utils/meta';
import { getDefaultRouteForRole } from '../../config/navigation';
import type { Role } from '../../types';

const roles: Role[] = ['agent', 'supervisor', 'campaign_manager', 'admin'];

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const { notify } = useSnackbar();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleSelect = (next: Role) => {
    setAnchorEl(null);
    if (next === role) return;
    setRole(next);
    notify(`Viewing as ${roleMeta[next].label}`, 'info');
    navigate(getDefaultRouteForRole(next));
  };

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        variant="outlined"
        size="small"
        startIcon={<PersonOutlineRoundedIcon fontSize="small" />}
        endIcon={<KeyboardArrowDownRoundedIcon fontSize="small" />}
        aria-label="Switch demo role"
        sx={{
          color: 'text.primary',
          textTransform: 'none',
          borderRadius: 2,
          backgroundColor: 'background.paper',
          borderColor: 'divider',
          '&:hover': { borderColor: 'primary.light', backgroundColor: 'primary.light' },
        }}
      >
        View as: {roleMeta[role].label}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {roles.map((r) => (
          <MenuItem key={r} onClick={() => handleSelect(r)} selected={r === role}>
            <ListItemIcon>{r === role ? <CheckRoundedIcon fontSize="small" color="primary" /> : null}</ListItemIcon>
            <ListItemText>{roleMeta[r].label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
