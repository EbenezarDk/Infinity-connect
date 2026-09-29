import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MarkEmailUnreadRoundedIcon from '@mui/icons-material/MarkEmailUnreadRounded';
import type { Conversation } from '../../types';
import { getContactById } from '../../data/contacts';
import { getAgentById, agents } from '../../data/agents';
import { ContactAvatar } from '../common/ContactAvatar';
import { ChannelIcon } from '../common/ChannelIcon';
import { StatusChip, PriorityChip } from '../common/StatusChip';
import { useConversations } from '../../context/ConversationsContext';
import { useCurrentAgent, useHasPermission } from '../../context/RoleContext';
import { useSnackbar } from '../../context/SnackbarContext';

interface ConversationHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
  onOpenContext?: () => void;
  showContextButton?: boolean;
}

export function ConversationHeader({ conversation, onBack, onOpenContext, showContextButton }: ConversationHeaderProps) {
  const contact = getContactById(conversation.contactId);
  const assignee = getAgentById(conversation.assigneeId);
  const currentAgent = useCurrentAgent();
  const { assign, escalate, resolve, markRead } = useConversations();
  const { notify } = useSnackbar();
  const canReassignFully = useHasPermission('reassign') === true;
  const canEscalate = useHasPermission('escalate') === true;

  const [assignAnchor, setAssignAnchor] = useState<HTMLElement | null>(null);
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);

  if (!contact) return null;

  const handleAssignToMe = () => {
    if (currentAgent) {
      assign(conversation.id, currentAgent.id, currentAgent.name);
      notify(`Assigned to ${currentAgent.name}`);
    }
    setAssignAnchor(null);
  };

  const handleAssignTo = (agentId: string, agentName: string) => {
    assign(conversation.id, agentId, agentName);
    notify(`Assigned to ${agentName}`);
    setAssignAnchor(null);
  };

  const handleEscalate = () => {
    escalate(conversation.id);
    notify('Conversation escalated to Supervisor', 'warning');
  };

  const handleResolve = () => {
    resolve(conversation.id);
    notify('Conversation marked as resolved');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        px: { xs: 1.5, md: 2.5 },
        py: 1.25,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        flexWrap: 'wrap',
      }}
    >
      {onBack && (
        <IconButton onClick={onBack} aria-label="Back to conversation list" size="small">
          <ArrowBackRoundedIcon fontSize="small" />
        </IconButton>
      )}

      <ContactAvatar name={contact.name} color={contact.avatarColor} size={38} />

      <Box sx={{ minWidth: 0, flex: '1 1 220px' }}>
        <Typography variant="subtitle1" noWrap sx={{ lineHeight: 1.2 }}>
          {contact.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25, flexWrap: 'wrap' }}>
          <ChannelIcon channel={conversation.channel} size={13} />
          <Typography variant="caption" color="text.secondary" noWrap>
            {assignee ? `Assigned to ${assignee.name}` : 'Unassigned'}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            ·
          </Typography>
          <StatusChip status={conversation.status} />
          <PriorityChip priority={conversation.priority} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<PersonAddAltRoundedIcon fontSize="small" />}
          onClick={(e) => setAssignAnchor(e.currentTarget)}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          {assignee ? 'Reassign' : 'Assign'}
        </Button>
        <Menu anchorEl={assignAnchor} open={Boolean(assignAnchor)} onClose={() => setAssignAnchor(null)}>
          <MenuItem onClick={handleAssignToMe}>
            <ListItemText>Assign to me</ListItemText>
          </MenuItem>
          <Divider />
          {canReassignFully ? (
            agents
              .filter((a) => a.role === 'agent')
              .map((a) => (
                <MenuItem key={a.id} onClick={() => handleAssignTo(a.id, a.name)}>
                  <ListItemText>{a.name}</ListItemText>
                </MenuItem>
              ))
          ) : (
            <MenuItem disabled sx={{ maxWidth: 260, whiteSpace: 'normal' }}>
              <ListItemText primary="Limited permission — contact your supervisor to reassign to others" />
            </MenuItem>
          )}
        </Menu>

        <Tooltip title={conversation.status === 'escalated' ? 'Already escalated' : 'Escalate to supervisor'}>
          <span>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              startIcon={<ReportProblemRoundedIcon fontSize="small" />}
              onClick={handleEscalate}
              disabled={!canEscalate || conversation.status === 'escalated' || conversation.status === 'resolved'}
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              Escalate
            </Button>
          </span>
        </Tooltip>

        <Button
          size="small"
          variant="contained"
          startIcon={<CheckCircleRoundedIcon fontSize="small" />}
          onClick={handleResolve}
          disabled={conversation.status === 'resolved'}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Resolve
        </Button>

        {showContextButton && (
          <Tooltip title="Customer context">
            <IconButton onClick={onOpenContext} aria-label="Open customer context panel" size="small">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        <IconButton onClick={(e) => setMoreAnchor(e.currentTarget)} aria-label="More actions" size="small">
          <MoreVertRoundedIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={() => setMoreAnchor(null)}>
          <MenuItem
            onClick={() => {
              markRead(conversation.id);
              setMoreAnchor(null);
            }}
          >
            <ListItemIcon>
              <MarkEmailUnreadRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as read</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleEscalate();
              setMoreAnchor(null);
            }}
            sx={{ display: { sm: 'none' } }}
          >
            <ListItemIcon>
              <ReportProblemRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Escalate</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleResolve();
              setMoreAnchor(null);
            }}
            sx={{ display: { sm: 'none' } }}
          >
            <ListItemIcon>
              <CheckCircleRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Resolve</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
