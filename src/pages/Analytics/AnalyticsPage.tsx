import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { KpiCard } from '../../components/analytics/KpiCard';
import { TeamWorkload } from '../../components/analytics/TeamWorkload';
import { EscalationsTable } from '../../components/analytics/EscalationsTable';
import { ChannelDistribution } from '../../components/analytics/ChannelDistribution';
import { VolumeTrendChart } from '../../components/analytics/VolumeTrendChart';
import { ResponseTimeChart } from '../../components/analytics/ResponseTimeChart';
import { ChannelMessagesChart } from '../../components/analytics/ChannelMessagesChart';
import { CampaignEngagementChart } from '../../components/analytics/CampaignEngagementChart';
import { AgentsTable } from '../../components/analytics/AgentsTable';
import { PageHeader } from '../../components/common/PageHeader';
import { color } from '../../theme/tokens';

type AnalyticsTab = 'overview' | 'conversations' | 'agents' | 'channels' | 'campaigns';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const volumeByDay = [186, 204, 178, 231, 254, 142, 98];
const frtByDay = [6.2, 5.8, 6.5, 5.1, 4.6, 4.9, 5.3];

export function AnalyticsPage() {
  const [tab, setTab] = useState<AnalyticsTab>('overview');

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', backgroundColor: color.bgApp }} className="ic-fade-up">
      <PageHeader
        title="Analytics"
        subtitle="Operational visibility across conversations, agents, channels, and campaigns"
        tabs={
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 44,
              width: '100%',
              '& .MuiTabs-list': { alignItems: 'flex-end', gap: '16px' },
              '& .MuiTab-root': { minHeight: 44, pb: 1, minWidth: 'auto', px: 0 },
            }}
          >
            <Tab value="overview" label="Overview" />
            <Tab value="conversations" label="Conversations" />
            <Tab value="agents" label="Agents" />
            <Tab value="channels" label="Channels" />
            <Tab value="campaigns" label="Campaigns" />
          </Tabs>
        }
      />

      <Box sx={{ p: { xs: 2, md: 2 }, pt: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {tab === 'overview' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <KpiCard label="Open conversations" value="24" trend={{ direction: 'up', label: '8%', positive: false }} />
              <KpiCard label="Waiting" value="6" trend={{ direction: 'down', label: '-12%', positive: true }} />
              <KpiCard label="Escalated" value="1" trend={{ direction: 'down', label: '-50%', positive: true }} />
              <KpiCard label="Avg. response time" value="5.4m" trend={{ direction: 'down', label: '9%', positive: true }} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'stretch' }}>
              <Box sx={{ flex: '2 1 420px', minWidth: 280 }}>
                <TeamWorkload />
              </Box>
              <Box sx={{ flex: '1 1 320px', minWidth: 300, maxWidth: { lg: 600 } }}>
                <ChannelDistribution />
              </Box>
            </Box>

            <EscalationsTable />
          </Box>
        )}

        {tab === 'conversations' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <KpiCard label="First response time" value="4.2m" trend={{ direction: 'down', label: '-6%', positive: true }} />
              <KpiCard label="Resolution time" value="22m" trend={{ direction: 'down', label: '-4%', positive: true }} />
              <KpiCard label="Escalation rate" value="3.8%" trend={{ direction: 'up', label: '+0.4pt', positive: false }} />
              <KpiCard label="Cross-channel resolution" value="61%" trend={{ direction: 'up', label: '+3pt', positive: true }} />
            </Box>
            <VolumeTrendChart labels={weekDays} values={volumeByDay} />
            <ResponseTimeChart labels={weekDays} values={frtByDay} />
          </Box>
        )}

        {tab === 'agents' && <AgentsTable />}

        {tab === 'channels' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <ChannelMessagesChart />
          </Box>
        )}

        {tab === 'campaigns' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <CampaignEngagementChart />
          </Box>
        )}
      </Box>
    </Box>
  );
}
