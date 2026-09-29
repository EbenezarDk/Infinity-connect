import { color } from '../theme/tokens';
import type { ChannelType, ConversationStatus, Priority, ChannelHealth, CampaignStatus, Role } from '../types';

export const channelMeta: Record<ChannelType, { label: string; main: string; surface: string }> = {
  whatsapp: { label: 'WhatsApp', main: color.channelWhatsapp, surface: color.channelWhatsappSurface },
  sms: { label: 'SMS', main: color.channelSms, surface: color.channelSmsSurface },
  email: { label: 'Email', main: color.channelEmail, surface: color.channelEmailSurface },
  rcs: { label: 'RCS', main: color.channelRcs, surface: color.channelRcsSurface },
};

export const statusMeta: Record<ConversationStatus, { label: string; main: string; surface: string }> = {
  new: { label: 'New', main: color.info, surface: color.infoSurface },
  assigned: { label: 'Assigned', main: color.primary, surface: color.primarySurface },
  in_progress: { label: 'In Progress', main: color.primary, surface: color.primarySurface },
  waiting: { label: 'Waiting', main: color.warning, surface: color.warningSurface },
  escalated: { label: 'Escalated', main: color.error, surface: color.errorSurface },
  resolved: { label: 'Resolved', main: color.success, surface: color.successSurface },
};

export const priorityMeta: Record<Priority, { label: string; main: string; surface: string }> = {
  low: { label: 'Low', main: color.textSecondary, surface: color.bgSubtle },
  normal: { label: 'Normal', main: color.info, surface: color.infoSurface },
  high: { label: 'High', main: color.warning, surface: color.warningSurface },
  urgent: { label: 'Urgent', main: color.error, surface: color.errorSurface },
};

export const channelHealthMeta: Record<ChannelHealth, { label: string; main: string; surface: string }> = {
  connected: { label: 'Connected', main: color.success, surface: color.successSurface },
  needs_attention: { label: 'Needs attention', main: color.warning, surface: color.warningSurface },
  disconnected: { label: 'Disconnected', main: color.error, surface: color.errorSurface },
};

export const campaignStatusMeta: Record<CampaignStatus, { label: string; main: string; surface: string }> = {
  draft: { label: 'Draft', main: color.textSecondary, surface: color.bgSubtle },
  scheduled: { label: 'Scheduled', main: color.info, surface: color.infoSurface },
  sending: { label: 'Sending', main: color.primary, surface: color.primarySurface },
  completed: { label: 'Completed', main: color.success, surface: color.successSurface },
  paused: { label: 'Paused', main: color.warning, surface: color.warningSurface },
};

export const roleMeta: Record<Role, { label: string }> = {
  agent: { label: 'Agent' },
  supervisor: { label: 'Supervisor' },
  campaign_manager: { label: 'Campaign Manager' },
  admin: { label: 'Administrator' },
};

export const inboxFilterOrder: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'assigned_to_me', label: 'Assigned to me' },
  { key: 'unassigned', label: 'Unassigned' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'resolved', label: 'Resolved' },
];
