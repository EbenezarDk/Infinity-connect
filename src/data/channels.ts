import type { ChannelConfig } from '../types';

export const channelConfigs: ChannelConfig[] = [
  {
    channel: 'whatsapp',
    displayName: 'WhatsApp Business',
    health: 'connected',
    connectionLabel: 'Connected via WhatsApp Cloud API',
    capabilities: ['Text', 'Images', 'Documents', 'Templates', 'Interactive content'],
    messagesToday: 1284,
    lastSyncLabel: '2 minutes ago',
  },
  {
    channel: 'sms',
    displayName: 'SMS',
    health: 'connected',
    connectionLabel: 'Connected via carrier gateway (Route Mobile)',
    capabilities: ['Text', 'Character-limited segments', 'Delivery receipts'],
    messagesToday: 642,
    lastSyncLabel: '5 minutes ago',
  },
  {
    channel: 'email',
    displayName: 'Email',
    health: 'needs_attention',
    connectionLabel: 'Domain verification expiring in 4 days',
    capabilities: ['Subject line', 'Rich HTML content', 'Attachments', 'Threading'],
    messagesToday: 318,
    lastSyncLabel: '12 minutes ago',
  },
  {
    channel: 'rcs',
    displayName: 'RCS Business Messaging',
    health: 'disconnected',
    connectionLabel: 'Agent verification pending with carrier',
    capabilities: ['Rich cards', 'Suggested replies', 'Read receipts'],
    messagesToday: 0,
    lastSyncLabel: '3 hours ago',
  },
];

export function getChannelConfig(channel: string): ChannelConfig | undefined {
  return channelConfigs.find((c) => c.channel === channel);
}
