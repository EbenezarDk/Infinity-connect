import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { EmptyState } from '../../components/common/EmptyState';
import { PageHeader } from '../../components/common/PageHeader';
import { color, radius } from '../../theme/tokens';

type AutomationTab = 'workflows' | 'rules' | 'triggers';

interface AutomationItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  scope: string;
}

const initialWorkflows: AutomationItem[] = [
  {
    id: 'wf-1',
    title: 'Auto-assign new WhatsApp conversations',
    description: 'Route new conversations to the agent with the fewest active conversations.',
    enabled: true,
    scope: 'WhatsApp',
  },
  {
    id: 'wf-2',
    title: 'Escalate unresponded conversations',
    description: 'Escalate to a supervisor if no agent response within the SLA window.',
    enabled: true,
    scope: 'All channels',
  },
  {
    id: 'wf-3',
    title: 'Post-resolution satisfaction check-in',
    description: 'Send a short satisfaction prompt 1 hour after a conversation is resolved.',
    enabled: false,
    scope: 'WhatsApp, SMS',
  },
];

const initialRules: AutomationItem[] = [
  {
    id: 'rule-1',
    title: 'Tag VIP customers automatically',
    description: 'Apply the "VIP" tag when a customer\'s lifetime value exceeds ₹50,000.',
    enabled: true,
    scope: 'Contacts',
  },
  {
    id: 'rule-2',
    title: 'Flag payment-related keywords',
    description: 'Detect keywords like "charged twice" or "refund" and set priority to High.',
    enabled: true,
    scope: 'All channels',
  },
];

export function AutomationsPage() {
  const [tab, setTab] = useState<AutomationTab>('workflows');
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [rules, setRules] = useState(initialRules);

  const toggleWorkflow = (id: string) =>
    setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)));
  const toggleRule = (id: string) => setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));

  const renderList = (items: AutomationItem[], onToggle: (id: string) => void) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            p: 2,
            borderRadius: `${radius.md}px`,
            border: `1px solid ${color.border}`,
            backgroundColor: color.bgSurface,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Chip size="small" label={item.scope} variant="outlined" />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {item.description}
            </Typography>
          </Box>
          <Switch
            checked={item.enabled}
            onChange={() => onToggle(item.id)}
            slotProps={{ input: { 'aria-label': `Toggle ${item.title}` } }}
          />
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', backgroundColor: color.bgApp }}>
      <PageHeader
        title="Automations"
        subtitle="Reduce repetitive work with workflows, rules, and triggers"
        tabs={
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              minHeight: 44,
              '& .MuiTabs-flexContainer': { alignItems: 'flex-end' },
              '& .MuiTab-root': { minHeight: 44, pb: 1 },
            }}
          >
            <Tab value="workflows" label="Workflows" />
            <Tab value="rules" label="Rules" />
            <Tab value="triggers" label="Triggers" />
          </Tabs>
        }
      />

      <Box sx={{ p: { xs: 2, md: 2 }, pt: { xs: 2, md: 3 } }}>
        {tab === 'workflows' && renderList(workflows, toggleWorkflow)}
        {tab === 'rules' && renderList(rules, toggleRule)}
        {tab === 'triggers' && (
          <EmptyState
            icon={<BoltRoundedIcon />}
            title="No custom triggers yet"
            description="Triggers let you fire workflows based on specific events, like a channel disconnecting or a keyword being detected. This is a P1 capability — configuration will appear here once available."
          />
        )}
      </Box>
    </Box>
  );
}
