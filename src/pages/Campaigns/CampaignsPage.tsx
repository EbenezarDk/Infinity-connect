import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import { useNavigate } from 'react-router-dom';
import { campaigns } from '../../data/campaigns';
import { ChannelIcon } from '../../components/common/ChannelIcon';
import { CampaignStatusChip } from '../../components/common/StatusChip';
import { CreateCampaignFlow } from '../../components/campaigns/CreateCampaignFlow';
import { PermissionGate } from '../../components/common/PermissionGate';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDateTimeLabel, formatNumber } from '../../utils/format';
import { channelMeta } from '../../utils/meta';

export function CampaignsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Campaigns</Typography>
          <Typography variant="body2" color="text.secondary">
            Plan, schedule, and monitor outbound communication
          </Typography>
        </Box>
        <PermissionGate action="create_campaigns" fallbackLabel="Your role can view campaigns but not create new ones.">
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setCreateOpen(true)}>
            New campaign
          </Button>
        </PermissionGate>
      </Box>

      {campaigns.length === 0 ? (
        <EmptyState icon={<CampaignRoundedIcon />} title="No campaigns yet" description="Create your first campaign to reach customers at scale." />
      ) : (
        <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Campaign</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell>Audience</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Scheduled</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Delivery</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((c) => (
                <TableRow key={c.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/campaigns/${c.id}`)}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {c.name}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {c.templateName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <ChannelIcon channel={c.channel} withTooltip={false} size={13} />
                      <Typography variant="body2">{channelMeta[c.channel].label}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatNumber(c.audienceSize)}</Typography>
                    <Typography variant="caption" color="text.disabled" noWrap sx={{ display: 'block', maxWidth: 180 }}>
                      {c.audienceLabel}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <CampaignStatusChip status={c.status} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTimeLabel(c.scheduledAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {c.delivered > 0 ? (
                      <>
                        <LinearProgress variant="determinate" value={(c.delivered / c.audienceSize) * 100} sx={{ mb: 0.5 }} />
                        <Typography variant="caption" color="text.disabled">
                          {formatNumber(c.delivered)} / {formatNumber(c.audienceSize)} delivered
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="caption" color="text.disabled">
                        Not started
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateCampaignFlow open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  );
}
