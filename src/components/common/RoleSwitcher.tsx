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
import { color, radius } from '../../theme/tokens';

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
        startIcon={<PersonOutlineRoundedIcon sx={{ fontSize: 20 }} />}
        endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 16 }} />}
        aria-label="Switch demo role"
        sx={{
          color: '#1A1C3F',
          textTransform: 'none',
          borderRadius: `${radius.sm}px`,
          backgroundColor: color.bgSubtle,
          borderColor: color.border,
          borderWidth: '0.5px',
          px: { sm: 1.5, md: 2 },
          py: 1.5,
          minHeight: 44,
          maxWidth: { sm: 168, md: 'none' },
          fontWeight: 700,
          fontSize: '0.875rem',
          gap: 0.5,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          '& .MuiButton-startIcon': { mr: { sm: 0.5, md: 1 } },
          '& .MuiButton-endIcon': { ml: { sm: 0.5, md: 1 } },
          '&:hover': {
            borderColor: color.borderStrong,
            backgroundColor: color.bgSubtle,
            borderWidth: '0.5px',
          },
        }}
      >
        View as {roleMeta[role].label}
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
