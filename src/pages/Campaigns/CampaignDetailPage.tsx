import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { getCampaignById } from '../../data/campaigns';
import { ChannelIcon } from '../../components/common/ChannelIcon';
import { CampaignStatusChip } from '../../components/common/StatusChip';
import { KpiCard } from '../../components/analytics/KpiCard';
import { EmptyState } from '../../components/common/EmptyState';
import { PermissionGate } from '../../components/common/PermissionGate';
import { useSnackbar } from '../../context/SnackbarContext';
import { formatDateTimeLabel, formatNumber } from '../../utils/format';
import { channelMeta } from '../../utils/meta';

export function CampaignDetailPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const campaign = getCampaignById(campaignId);

  if (!campaign) {
    return <EmptyState title="Campaign not found" description="This campaign may have been removed or the link is outdated." />;
  }

  const engagementRate = campaign.delivered > 0 ? Math.round((campaign.engaged / campaign.delivered) * 100) : 0;
  const failureRate = campaign.delivered > 0 ? ((campaign.failedCount / campaign.delivered) * 100).toFixed(1) : '0.0';

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 2, md: 3 }, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', flexWrap: 'wrap' }}>
        <IconButton size="small" onClick={() => navigate('/campaigns')} aria-label="Back to campaigns">
          <ArrowBackRoundedIcon fontSize="small" />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h4" noWrap>
            {campaign.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
            <ChannelIcon channel={campaign.channel} size={13} />
            <Typography variant="caption" color="text.secondary">
              {channelMeta[campaign.channel].label} · {campaign.templateName}
            </Typography>
          </Box>
        </Box>
        <CampaignStatusChip status={campaign.status} />
        <PermissionGate action="create_campaigns" fallbackLabel="View-only access">
          {campaign.status === 'sending' || campaign.status === 'scheduled' ? (
            <Button
              size="small"
              variant="outlined"
              startIcon={<PauseCircleOutlineRoundedIcon fontSize="small" />}
              onClick={() => notify('Campaign paused', 'warning')}
            >
              Pause
            </Button>
          ) : null}
        </PermissionGate>
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={`Audience: ${campaign.audienceLabel}`} variant="outlined" />
          <Chip label={`Scheduled: ${formatDateTimeLabel(campaign.scheduledAt)}`} variant="outlined" />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <KpiCard label="Audience size" value={formatNumber(campaign.audienceSize)} />
          <KpiCard label="Delivered" value={formatNumber(campaign.delivered)} />
          <KpiCard label="Engaged" value={`${formatNumber(campaign.engaged)} (${engagementRate}%)`} />
          <KpiCard label="Failed" value={`${formatNumber(campaign.failedCount)} (${failureRate}%)`} />
        </Box>

        {campaign.delivered > 0 && (
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper', p: 2 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Delivery breakdown
            </Typography>
            <BarChart
              height={220}
              layout="horizontal"
              yAxis={[{ data: ['Delivered', 'Engaged', 'Failed'], scaleType: 'band' }]}
              series={[{ data: [campaign.delivered, campaign.engaged, campaign.failedCount] }]}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
