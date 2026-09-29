import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded';
import { agents } from '../../data/agents';
import { ContactAvatar } from '../../components/common/ContactAvatar';
import { PermissionGate } from '../../components/common/PermissionGate';
import { useSnackbar } from '../../context/SnackbarContext';
import { hasPermission, type PermissionAction } from '../../context/RoleContext';
import { roleMeta } from '../../utils/meta';
import { color } from '../../theme/tokens';
import type { Role } from '../../types';

type SettingsTab = 'users' | 'roles' | 'integrations' | 'workspace';

const roles: Role[] = ['agent', 'supervisor', 'campaign_manager', 'admin'];

const permissionRows: { action: PermissionAction; label: string }[] = [
  { action: 'view_assigned_conversations', label: 'View assigned conversations' },
  { action: 'reply', label: 'Reply to customers' },
  { action: 'reassign', label: 'Reassign conversations' },
  { action: 'escalate', label: 'Escalate conversations' },
  { action: 'team_analytics', label: 'Team analytics' },
  { action: 'create_campaigns', label: 'Create campaigns' },
  { action: 'manage_users', label: 'Manage users' },
  { action: 'configure_channels', label: 'Configure channels' },
];

function PermissionCell({ value }: { value: boolean | 'limited' }) {
  if (value === true) return <CheckRoundedIcon sx={{ fontSize: 18, color: color.success }} />;
  if (value === 'limited')
    return (
      <Tooltip title="Limited — scoped to the agent's own conversations">
        <HorizontalRuleRoundedIcon sx={{ fontSize: 18, color: color.warning }} />
      </Tooltip>
    );
  return <RemoveRoundedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />;
}

const integrations = [
  { id: 'crm', name: 'CRM (Customer records)', status: 'Connected', description: 'Syncs customer profile and order history.' },
  { id: 'ai', name: 'AI Provider', status: 'Connected', description: 'Powers AI summaries, suggested replies, and intent detection.' },
  { id: 'wa', name: 'WhatsApp Cloud API', status: 'Connected', description: 'Meta Business messaging integration.' },
  { id: 'sso', name: 'Single sign-on (SSO)', status: 'Not connected', description: 'Enterprise identity provider for team login.' },
];

export function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('users');
  const { notify } = useSnackbar();

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <Box sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, pb: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your workspace, users, permissions, and integrations
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: { xs: 2, md: 3 }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tab value="users" label="Users" />
        <Tab value="roles" label="Roles & Permissions" />
        <Tab value="integrations" label="Integrations" />
        <Tab value="workspace" label="Workspace" />
      </Tabs>

      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {tab === 'users' && (
          <PermissionGate action="manage_users" fallbackLabel="Only administrators can manage users.">
            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agents.map((a) => (
                    <TableRow key={a.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                          <ContactAvatar name={a.name} color={a.avatarColor} size={32} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {a.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={roleMeta[a.role].label} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={a.status === 'online' ? 'Online' : a.status === 'away' ? 'Away' : 'Offline'}
                          sx={{
                            backgroundColor: a.status === 'online' ? color.successSurface : color.bgSubtle,
                            color: a.status === 'online' ? color.success : color.textSecondary,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => notify(`Opened permissions for ${a.name}`, 'info')}>
                          Edit permissions
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </PermissionGate>
        )}

        {tab === 'roles' && (
          <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper', overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  {roles.map((r) => (
                    <TableCell key={r} align="center">
                      {roleMeta[r].label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {permissionRows.map((row) => (
                  <TableRow key={row.action} hover>
                    <TableCell>
                      <Typography variant="body2">{row.label}</Typography>
                    </TableCell>
                    {roles.map((r) => (
                      <TableCell key={r} align="center">
                        <PermissionCell value={hasPermission(r, row.action)} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {tab === 'roles' && (
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1.5 }}>
            This is a UX model for demonstration, not a confirmed business permission matrix. Validate with RCOS before production use.
          </Typography>
        )}

        {tab === 'integrations' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {integrations.map((i) => (
              <Box
                key={i.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">{i.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {i.description}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={i.status}
                  sx={{
                    backgroundColor: i.status === 'Connected' ? color.successSurface : color.bgSubtle,
                    color: i.status === 'Connected' ? color.success : color.textSecondary,
                  }}
                />
                <Switch
                  checked={i.status === 'Connected'}
                  onChange={() => notify(`${i.name} ${i.status === 'Connected' ? 'disconnected' : 'connected'}`)}
                />
              </Box>
            ))}
          </Box>
        )}

        {tab === 'workspace' && (
          <Box sx={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Workspace name" defaultValue="Meridian Retail Workspace" size="small" fullWidth />
            <TextField label="Primary timezone" defaultValue="Asia/Kolkata (IST, UTC+5:30)" size="small" fullWidth />
            <TextField label="Default SLA (first response)" defaultValue="15 minutes" size="small" fullWidth />
            <TextField label="Support contact email" defaultValue="support@infinityconnect.io" size="small" fullWidth />
            <Button variant="contained" sx={{ alignSelf: 'flex-start' }} onClick={() => notify('Workspace settings saved')}>
              Save changes
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
