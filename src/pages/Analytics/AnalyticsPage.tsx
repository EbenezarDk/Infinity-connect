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
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import { KpiCard } from '../../components/analytics/KpiCard';
import { TeamWorkload } from '../../components/analytics/TeamWorkload';
import { EscalationsTable } from '../../components/analytics/EscalationsTable';
import { agents } from '../../data/agents';
import { campaigns } from '../../data/campaigns';
import { channelConfigs } from '../../data/channels';
import { channelMeta } from '../../utils/meta';
import { color } from '../../theme/tokens';
import { formatNumber } from '../../utils/format';

type AnalyticsTab = 'overview' | 'conversations' | 'agents' | 'channels' | 'campaigns';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const volumeByDay = [186, 204, 178, 231, 254, 142, 98];
const frtByDay = [6.2, 5.8, 6.5, 5.1, 4.6, 4.9, 5.3];

export function AnalyticsPage() {
  const [tab, setTab] = useState<AnalyticsTab>('overview');
  const teamAgents = agents.filter((a) => a.role === 'agent');

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }} className="ic-fade-up">
      <Box sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, pb: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Operational visibility across conversations, agents, channels, and campaigns
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: { xs: 2, md: 3 }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tab value="overview" label="Overview" />
        <Tab value="conversations" label="Conversations" />
        <Tab value="agents" label="Agents" />
        <Tab value="channels" label="Channels" />
        <Tab value="campaigns" label="Campaigns" />
      </Tabs>

      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {tab === 'overview' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <KpiCard label="Open conversations" value="24" trend={{ direction: 'up', label: '+8%', positive: false }} icon={<ForumRoundedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />} />
              <KpiCard label="Waiting" value="6" trend={{ direction: 'down', label: '-12%', positive: true }} icon={<ScheduleRoundedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />} />
              <KpiCard label="Escalated" value="1" trend={{ direction: 'down', label: '-50%', positive: true }} icon={<ReportProblemRoundedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />} />
              <KpiCard label="Avg. response time" value="5.4m" trend={{ direction: 'down', label: '-9%', positive: true }} icon={<BoltRoundedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <Box sx={{ flex: '2 1 420px', minWidth: 320 }}>
                <TeamWorkload />
              </Box>
              <Box sx={{ flex: '1 1 280px', minWidth: 260, border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper', p: 2 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  Channel distribution
                </Typography>
                <PieChart
                  height={180}
                  series={[
                    {
                      data: channelConfigs.map((c) => ({
                        id: c.channel,
                        value: c.messagesToday,
                        label: c.displayName,
                        color: channelMeta[c.channel].main,
                      })),
                      innerRadius: 36,
                      paddingAngle: 2,
                    },
                  ]}
                />
              </Box>
            </Box>

            <EscalationsTable />
          </Box>
        )}

        {tab === 'conversations' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <KpiCard label="First response time" value="4.2m" trend={{ direction: 'down', label: '-6%', positive: true }} />
              <KpiCard label="Resolution time" value="22m" trend={{ direction: 'down', label: '-4%', positive: true }} />
              <KpiCard label="Escalation rate" value="3.8%" trend={{ direction: 'up', label: '+0.4pt', positive: false }} />
              <KpiCard label="Cross-channel resolution" value="61%" trend={{ direction: 'up', label: '+3pt', positive: true }} />
            </Box>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper', p: 2 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Conversation volume — last 7 days
              </Typography>
              <LineChart
                height={280}
                xAxis={[{ data: weekDays, scaleType: 'point' }]}
                series={[{ data: volumeByDay, label: 'Conversations', color: color.primary, area: true }]}
              />
            </Box>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper', p: 2 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                First response time (minutes) — last 7 days
              </Typography>
              <LineChart
                height={240}
                xAxis={[{ data: weekDays, scaleType: 'point' }]}
                series={[{ data: frtByDay, label: 'Avg. FRT (min)', color: color.info }]}
              />
            </Box>
          </Box>
        )}

        {tab === 'agents' && (
          <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Agent</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Active conversations</TableCell>
                  <TableCell align="right">Escalations</TableCell>
                  <TableCell align="right">Avg. response time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamAgents.map((a) => (
                  <TableRow key={a.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {a.name}
                      </Typography>
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
                    <TableCell align="right">{a.activeConversations}</TableCell>
                    <TableCell align="right">
                      <Typography sx={{ color: a.escalations > 0 ? color.error : 'text.secondary', fontWeight: a.escalations > 0 ? 700 : 400 }} variant="body2">
                        {a.escalations}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{a.avgResponseTimeMinutes}m</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tab === 'channels' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper', p: 2 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Messages today by channel
              </Typography>
              <BarChart
                height={280}
                xAxis={[{ data: channelConfigs.map((c) => c.displayName), scaleType: 'band' }]}
                series={[{ data: channelConfigs.map((c) => c.messagesToday), label: 'Messages today' }]}
                colors={channelConfigs.map((c) => channelMeta[c.channel].main)}
              />
            </Box>
          </Box>
        )}

        {tab === 'campaigns' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper', p: 2 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Delivered vs. engaged by campaign
              </Typography>
              <BarChart
                height={300}
                xAxis={[{ data: campaigns.map((c) => c.name), scaleType: 'band' }]}
                series={[
                  { data: campaigns.map((c) => c.delivered), label: 'Delivered', color: color.primary },
                  { data: campaigns.map((c) => c.engaged), label: 'Engaged', color: color.success },
                ]}
              />
            </Box>
            <Typography variant="caption" color="text.disabled">
              Delivered {formatNumber(campaigns.reduce((sum, c) => sum + c.delivered, 0))} messages across {campaigns.length} campaigns to date.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
