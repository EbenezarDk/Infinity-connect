import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversations } from '../../context/ConversationsContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { getContactById } from '../../data/contacts';
import { getAgentById, agents } from '../../data/agents';
import { PriorityChip } from '../common/StatusChip';
import { formatRelativeTime } from '../../utils/format';
import { EmptyState } from '../common/EmptyState';
import ReportOffRoundedIcon from '@mui/icons-material/ReportOffRounded';

export function EscalationsTable() {
  const { conversations, assign, resolve } = useConversations();
  const { notify } = useSnackbar();
  const navigate = useNavigate();
  const [reassignAnchor, setReassignAnchor] = useState<{ el: HTMLElement; conversationId: string } | null>(null);

  const escalated = conversations.filter((c) => c.status === 'escalated');

  if (escalated.length === 0) {
    return (
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper' }}>
        <EmptyState
          icon={<ReportOffRoundedIcon />}
          title="No active escalations"
          description="Escalated conversations requiring supervisor review will appear here."
          compact
        />
      </Box>
    );
  }

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper', overflow: 'hidden' }}>
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="h4">Escalations</Typography>
        <Typography variant="body2" color="text.secondary">
          Conversations that breached SLA or require supervisor intervention
        </Typography>
      </Box>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Issue</TableCell>
              <TableCell>Current owner</TableCell>
              <TableCell>Time waiting</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {escalated.map((c) => {
              const contact = getContactById(c.contactId);
              const owner = getAgentById(c.assigneeId);
              return (
                <TableRow key={c.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {contact?.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 220 }} noWrap>
                      {c.lastMessagePreview}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{owner?.name ?? 'Unassigned'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="error.main" sx={{ fontWeight: 700 }}>
                      {formatRelativeTime(c.lastMessageAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <PriorityChip priority={c.priority} />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'flex-end' }}>
                      <Button size="small" variant="outlined" onClick={() => navigate(`/inbox?conversation=${c.id}`)}>
                        Open
                      </Button>
                      <Button size="small" variant="outlined" onClick={(e) => setReassignAnchor({ el: e.currentTarget, conversationId: c.id })}>
                        Reassign
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          resolve(c.id);
                          notify(`Resolved ${contact?.name}'s conversation`);
                        }}
                      >
                        Resolve
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={reassignAnchor?.el} open={Boolean(reassignAnchor)} onClose={() => setReassignAnchor(null)}>
        {agents
          .filter((a) => a.role === 'agent')
          .map((a) => (
            <MenuItem
              key={a.id}
              onClick={() => {
                if (reassignAnchor) {
                  assign(reassignAnchor.conversationId, a.id, a.name);
                  notify(`Reassigned to ${a.name}`);
                }
                setReassignAnchor(null);
              }}
            >
              {a.name}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
}
