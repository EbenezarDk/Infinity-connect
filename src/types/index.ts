/**
 * Core domain types for InfinityConnect.
 *
 * NOTE ON RESEARCH POSITIONING (see spec §38):
 * - KNOWN: fields explicitly implied by the assignment brief.
 * - ASSUMPTION: reasonable product hypotheses used to make the UI concrete.
 * - VALIDATE: marked inline where a real implementation would need RCOS / stakeholder confirmation.
 */

export type ChannelType = 'whatsapp' | 'sms' | 'email' | 'rcs';

export type ConversationStatus =
  | 'new'
  | 'assigned'
  | 'in_progress'
  | 'waiting'
  | 'escalated'
  | 'resolved';

export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export type Role = 'agent' | 'supervisor' | 'campaign_manager' | 'admin';

export type MessageDirection = 'inbound' | 'outbound';

export type MessageType =
  | 'text'
  | 'image'
  | 'attachment'
  | 'template'
  | 'rich'
  | 'system'
  | 'internal_note';

export type DeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'doc' | 'other';
  sizeLabel: string;
}

export interface Message {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  sender: string;
  senderAvatarColor?: string;
  text: string;
  channel: ChannelType;
  timestamp: string; // ISO
  type: MessageType;
  deliveryStatus?: DeliveryStatus;
  isInternal?: boolean;
  attachments?: Attachment[];
  templateName?: string;
}

export interface ChannelIdentity {
  channel: ChannelType;
  handle: string; // phone / email / handle
  lastActiveLabel: string;
}

export interface Contact {
  id: string;
  name: string;
  avatarColor: string;
  phone?: string;
  email?: string;
  primaryChannel: ChannelType;
  channels: ChannelIdentity[];
  tags: string[];
  lastInteraction: string; // ISO
  status: 'active' | 'dormant';
  company?: string;
  location?: string;
}

export interface ConversationHistoryEntry {
  channel: ChannelType;
  label: string;
  date: string; // ISO
  conversationId: string;
}

export interface ActivityEvent {
  id: string;
  label: string;
  timestamp: string; // ISO
  kind: 'assignment' | 'escalation' | 'identity_match' | 'note' | 'resolution' | 'channel_switch';
}

export interface Conversation {
  id: string;
  contactId: string;
  channel: ChannelType;
  status: ConversationStatus;
  priority: Priority;
  assigneeId?: string; // agent id
  unread: number;
  lastMessagePreview: string;
  lastMessageAt: string; // ISO
  subject?: string; // used for email
  slaMinutesRemaining?: number; // ASSUMPTION: SLA model — VALIDATE with RCOS
  messages: Message[];
  tags: string[];
}

export interface Agent {
  id: string;
  name: string;
  avatarColor: string;
  role: Role;
  status: 'online' | 'away' | 'offline';
  activeConversations: number;
  escalations: number;
  avgResponseTimeMinutes: number;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused';

export interface Campaign {
  id: string;
  name: string;
  channel: ChannelType;
  audienceLabel: string;
  audienceSize: number;
  status: CampaignStatus;
  scheduledAt: string; // ISO
  delivered: number;
  engaged: number;
  failedCount: number;
  templateName: string;
}

export type ChannelHealth = 'connected' | 'needs_attention' | 'disconnected';

export interface ChannelConfig {
  channel: ChannelType;
  displayName: string;
  health: ChannelHealth;
  connectionLabel: string;
  capabilities: string[];
  messagesToday: number;
  lastSyncLabel: string;
}

export interface NotificationItem {
  id: string;
  kind: 'escalation' | 'campaign' | 'channel' | 'sla' | 'assignment';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface AiSummary {
  conversationId: string;
  summary: string;
  sourceMessageIds: string[];
}

export interface AiSuggestedReply {
  conversationId: string;
  text: string;
}

export interface AiIntent {
  conversationId: string;
  intent: string;
  confidence: number; // 0-1
  suggestedNextStep: string;
}
