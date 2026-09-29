import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import { channelConfigs as initialChannels } from '../../data/channels';
import { ChannelIcon } from '../../components/common/ChannelIcon';
import { ChannelHealthChip } from '../../components/common/StatusChip';
import { useSnackbar } from '../../context/SnackbarContext';
import { PermissionGate } from '../../components/common/PermissionGate';
import { formatNumber } from '../../utils/format';
import { channelMeta } from '../../utils/meta';
import type { ChannelConfig } from '../../types';

export function ChannelsPage() {
  const [channels, setChannels] = useState<ChannelConfig[]>(initialChannels);
  const [configuring, setConfiguring] = useState<ChannelConfig | null>(null);
  const { notify } = useSnackbar();

  const handleToggleConnection = (channel: ChannelConfig) => {
    const nextHealth = channel.health === 'connected' ? 'disconnected' : 'connected';
    setChannels((prev) => prev.map((c) => (c.channel === channel.channel ? { ...c, health: nextHealth } : c)));
    notify(
      nextHealth === 'connected' ? `${channel.displayName} reconnected` : `${channel.displayName} disconnected`,
      nextHealth === 'connected' ? 'success' : 'warning',
    );
    setConfiguring(null);
  };

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: { xs: 2, md: 3 } }} className="ic-fade-up">
      <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
        Channels
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        WhatsApp-first connectivity, expanding to SMS, Email, and RCS
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {channels.map((c) => {
          const meta = channelMeta[c.channel];
          return (
          <Box
            key={c.channel}
            sx={{
              flex: '1 1 300px',
              minWidth: 280,
              maxWidth: 420,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2.5,
              backgroundColor: 'background.paper',
              p: 2.5,
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 140ms ease, box-shadow 140ms ease',
              '&:hover': { borderColor: meta.main, boxShadow: '0 8px 24px rgba(11,18,32,0.06)' },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                backgroundColor: meta.main,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <ChannelIcon channel={c.channel} withBackground withTooltip={false} size={18} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{c.displayName}</Typography>
                <ChannelHealthChip health={c.health} />
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              {c.connectionLabel}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="overline" color="text.disabled">
              Capabilities
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.75, mb: 1.5 }}>
              {c.capabilities.map((cap) => (
                <Chip key={cap} size="small" label={cap} variant="outlined" />
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="caption" color="text.disabled">
                {formatNumber(c.messagesToday)} messages today
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Synced {c.lastSyncLabel}
              </Typography>
            </Box>

            <PermissionGate action="configure_channels" fallbackLabel="Only administrators can configure channels.">
              <Button fullWidth variant="outlined" onClick={() => setConfiguring(c)}>
                Configure
              </Button>
            </PermissionGate>
          </Box>
          );
        })}
      </Box>

      <Dialog open={Boolean(configuring)} onClose={() => setConfiguring(null)} maxWidth="xs" fullWidth>
        {configuring && (
          <>
            <DialogTitle>Configure {configuring.displayName}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {configuring.connectionLabel}
              </Typography>
              <ChannelHealthChip health={configuring.health} />
              <Typography variant="body2" sx={{ mt: 2 }}>
                {configuring.health === 'connected'
                  ? 'This channel is actively receiving and sending messages. Disconnecting will pause message delivery.'
                  : 'This channel is not currently connected. Reconnecting will resume message delivery.'}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfiguring(null)} color="inherit">
                Close
              </Button>
              <Button
                variant="contained"
                color={configuring.health === 'connected' ? 'error' : 'primary'}
                onClick={() => handleToggleConnection(configuring)}
              >
                {configuring.health === 'connected' ? 'Disconnect' : 'Reconnect'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
