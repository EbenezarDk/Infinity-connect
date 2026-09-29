import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Chip from '@mui/material/Chip';
import { channelConfigs } from '../../data/channels';
import { ChannelIcon } from '../common/ChannelIcon';
import { channelMeta } from '../../utils/meta';
import { useSnackbar } from '../../context/SnackbarContext';
import type { ChannelType } from '../../types';

const steps = ['Audience', 'Channel', 'Message', 'Schedule', 'Review'];

const audiences = [
  { id: 'all', label: 'All active customers', size: 12480 },
  { id: 'vip', label: 'VIP tagged customers', size: 640 },
  { id: 'pending', label: 'Customers with pending invoices', size: 3210 },
  { id: 'west', label: 'Active orders — West region', size: 1540 },
];

interface CreateCampaignFlowProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCampaignFlow({ open, onClose }: CreateCampaignFlowProps) {
  const [step, setStep] = useState(0);
  const [audienceId, setAudienceId] = useState<string>('all');
  const [channel, setChannel] = useState<ChannelType>('whatsapp');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState('2026-09-30');
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const { notify } = useSnackbar();

  const audience = audiences.find((a) => a.id === audienceId)!;

  const reset = () => {
    setStep(0);
    setAudienceId('all');
    setChannel('whatsapp');
    setName('');
    setMessage('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleLaunch = () => {
    notify(`"${name || 'Untitled campaign'}" scheduled for ${scheduleDate} at ${scheduleTime}`);
    handleClose();
  };

  const canProceed = () => {
    if (step === 0) return Boolean(audienceId);
    if (step === 1) return Boolean(channel);
    if (step === 2) return name.trim().length > 0 && message.trim().length > 0;
    return true;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>New campaign</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((s) => (
            <Step key={s}>
              <StepLabel>{s}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {step === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Choose who this campaign should reach.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {audiences.map((a) => (
                <Box
                  key={a.id}
                  onClick={() => setAudienceId(a.id)}
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: a.id === audienceId ? 'primary.main' : 'divider',
                    backgroundColor: a.id === audienceId ? 'primary.50' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {a.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {a.size.toLocaleString('en-IN')} recipients
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Choose the channel for this campaign.
            </Typography>
            <ToggleButtonGroup
              value={channel}
              exclusive
              onChange={(_, v) => v && setChannel(v)}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {channelConfigs.map((c) => (
                <ToggleButton key={c.channel} value={c.channel} sx={{ gap: 1, textTransform: 'none', borderRadius: 1.5 }}>
                  <ChannelIcon channel={c.channel} withTooltip={false} size={14} />
                  {c.displayName}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Campaign name" value={name} onChange={(e) => setName(e.target.value)} fullWidth size="small" placeholder="e.g. Festival Service Update" />
            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              multiline
              minRows={4}
              size="small"
              placeholder="Write the message customers will receive…"
            />
          </Box>
        )}

        {step === 3 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Date"
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Time"
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        )}

        {step === 4 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Review campaign details before scheduling.
            </Typography>
            <Box sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2">{name || 'Untitled campaign'}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75 }}>
                <ChannelIcon channel={channel} withTooltip={false} size={13} />
                <Typography variant="body2">{channelMeta[channel].label}</Typography>
                <Chip size="small" label={`${audience.size.toLocaleString('en-IN')} recipients`} sx={{ ml: 1 }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {message || 'No message written yet.'}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                Scheduled for {scheduleDate} at {scheduleTime}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        {step > 0 && <Button onClick={() => setStep((s) => s - 1)}>Back</Button>}
        {step < steps.length - 1 ? (
          <Button variant="contained" disabled={!canProceed()} onClick={() => setStep((s) => s + 1)}>
            Continue
          </Button>
        ) : (
          <Button variant="contained" onClick={handleLaunch}>
            Schedule campaign
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
