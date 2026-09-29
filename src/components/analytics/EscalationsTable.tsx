import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversations } from '../../context/ConversationsContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { getContactById } from '../../data/contacts';
import { getAgentById, agents } from '../../data/agents';
import { formatRelativeTime } from '../../utils/format';
import { EmptyState } from '../common/EmptyState';
import ReportOffRoundedIcon from '@mui/icons-material/ReportOffRounded';
import { color, radius } from '../../theme/tokens';
import { priorityMeta } from '../../utils/meta';
import type { Conversation, Priority } from '../../types';

const HEADER_BG = '#F1F6FB';
const TITLE_COLOR = '#000314';
const URGENT_COLOR = '#FF0B0B';

const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

const pillButtonSx = {
  borderRadius: '100px',
  px: '14px',
  py: '10px',
  minHeight: 0,
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: '18px',
  textTransform: 'none' as const,
};

interface EscalationRow {
  conversation: Conversation;
  customerName: string;
  issue: string;
  ownerName: string;
  waitingLabel: string;
  priority: Priority;
  priorityLabel: string;
  priorityColor: string;
}

function buildEscalationRows(conversations: Conversation[]): EscalationRow[] {
  return conversations
    .filter((c) => c.status === 'escalated')
    .map((conversation) => {
      const contact = getContactById(conversation.contactId);
      const owner = getAgentById(conversation.assigneeId);
      const priority = conversation.priority;
      const meta = priorityMeta[priority];
      return {
        conversation,
        customerName: contact?.name ?? 'Unknown customer',
        issue: conversation.lastMessagePreview,
        ownerName: owner?.name ?? 'Unassigned',
        waitingLabel: formatRelativeTime(conversation.lastMessageAt),
        priority,
        priorityLabel: meta.label,
        priorityColor: priority === 'urgent' || priority === 'high' ? URGENT_COLOR : meta.main,
      };
    })
    .sort((a, b) => {
      const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (byPriority !== 0) return byPriority;
      return new Date(a.conversation.lastMessageAt).getTime() - new Date(b.conversation.lastMessageAt).getTime();
    });
}

export function EscalationsTable() {
  const { conversations, assign, resolve } = useConversations();
  const { notify } = useSnackbar();
  const navigate = useNavigate();
  const [reassignAnchor, setReassignAnchor] = useState<{ el: HTMLElement; conversationId: string } | null>(null);

  const rows = useMemo(() => buildEscalationRows(conversations), [conversations]);

  const header = (
    <Box sx={{ px: '22px' }}>
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: 700,
          lineHeight: '26px',
          letterSpacing: '0.036px',
          color: TITLE_COLOR,
        }}
      >
        Escalations
      </Typography>
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 500,
          lineHeight: '18px',
          color: color.textSecondary,
        }}
      >
        Conversations that breached SLA or require supervisor intervention
      </Typography>
    </Box>
  );

  if (rows.length === 0) {
    return (
      <Box
        sx={{
          border: `1px solid ${color.border}`,
          borderRadius: `${radius.md}px`,
          backgroundColor: color.bgSurface,
          py: '22px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {header}
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
    <Box
      sx={{
        border: `1px solid ${color.border}`,
        borderRadius: `${radius.md}px`,
        backgroundColor: color.bgSurface,
        overflow: 'hidden',
        py: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {header}

      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: HEADER_BG,
          minWidth: { xs: 720, sm: 880 },
        }}
      >
        {[
          { label: 'Customer', width: 168 },
          { label: 'Issue', width: 311 },
          { label: 'Current owner', width: 184 },
          { label: 'Time waiting', width: 113 },
        ].map((col) => (
            <Box key={col.label} sx={{ width: col.width, flexShrink: 0, px: '12px', py: '16px' }}>
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 700,
                  lineHeight: '18px',
                  color: color.textSecondary,
                  textTransform: 'uppercase',
                }}
              >
                {col.label}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              flex: 1,
              minWidth: 280,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.5,
              px: '12px',
              py: '16px',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: '18px',
                color: color.textSecondary,
                textTransform: 'uppercase',
              }}
            >
              Priority
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: '18px',
                color: color.textSecondary,
                textTransform: 'uppercase',
                textAlign: 'right',
              }}
            >
              Action
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: { xs: 720, sm: 880 }, pt: 1.5 }}>
          {rows.map((row, index) => {
            const { conversation: c } = row;
            return (
              <Box key={c.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ width: 168, flexShrink: 0, px: '12px' }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        lineHeight: '18px',
                        color: color.textPrimary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={row.customerName}
                    >
                      {row.customerName}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 311, flexShrink: 0, px: '12px', py: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 500,
                        lineHeight: '18px',
                        color: color.textPrimary,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={row.issue}
                    >
                      {row.issue}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 184, flexShrink: 0, px: '12px', py: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 500,
                        lineHeight: '18px',
                        color: color.textPrimary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={row.ownerName}
                    >
                      {row.ownerName}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 113, flexShrink: 0, px: '12px', py: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: '18px',
                        color: color.textPrimary,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.waitingLabel}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 280,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      px: '12px',
                      py: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        flex: 1,
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: '18px',
                        color: row.priorityColor,
                        minWidth: 0,
                      }}
                    >
                      {row.priorityLabel}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/inbox?conversation=${c.id}`)}
                        sx={{
                          ...pillButtonSx,
                          borderColor: color.primary,
                          color: color.primary,
                          backgroundColor: 'transparent',
                          '&:hover': {
                            borderColor: color.primaryDark,
                            backgroundColor: color.primarySurface,
                          },
                        }}
                      >
                        Open
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={(e) => setReassignAnchor({ el: e.currentTarget, conversationId: c.id })}
                        sx={{
                          ...pillButtonSx,
                          borderColor: color.primary,
                          color: color.primary,
                          backgroundColor: 'transparent',
                          '&:hover': {
                            borderColor: color.primaryDark,
                            backgroundColor: color.primarySurface,
                          },
                        }}
                      >
                        Reassign
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          resolve(c.id);
                          notify(`Resolved ${row.customerName}'s conversation`);
                        }}
                        sx={{
                          ...pillButtonSx,
                          backgroundColor: color.primary,
                          color: '#fff',
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: color.primaryDark,
                            boxShadow: 'none',
                          },
                        }}
                      >
                        Resolve
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {index < rows.length - 1 && (
                  <Box sx={{ height: 0, borderBottom: `1px solid ${color.border}`, mt: 1.5 }} />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

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
