import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import type { ReactNode } from 'react';
import { useHasPermission, type PermissionAction } from '../../context/RoleContext';

interface PermissionGateProps {
  action: PermissionAction;
  children: ReactNode;
  fallbackLabel?: string;
}

/**
 * Renders children only if the current demo role has permission.
 * Otherwise shows a "Permission denied" state (spec §25).
 */
export function PermissionGate({ action, children, fallbackLabel }: PermissionGateProps) {
  const permitted = useHasPermission(action);

  if (permitted === false) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 2,
          borderRadius: 1.5,
          border: '1px dashed',
          borderColor: 'divider',
          color: 'text.secondary',
          backgroundColor: 'background.default',
        }}
      >
        <LockOutlinedIcon fontSize="small" />
        <Typography variant="body2">
          {fallbackLabel ?? "You don't have permission to perform this action."}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
