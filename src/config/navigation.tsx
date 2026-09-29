import {
  NavIconAnalytics,
  NavIconInbox,
  NavIconContacts,
  NavIconCampaigns,
  NavIconAutomations,
  NavIconChannels,
  NavIconSettings,
} from '../components/navigation/NavIcons';
import type { Role } from '../types';

export interface NavItemConfig {
  key: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

/** Figma order: Analytics → Inbox → Contacts → Campaigns → Automations → Channels → Settings */
export const navItems: NavItemConfig[] = [
  { key: 'analytics', label: 'Analytics', path: '/analytics', icon: NavIconAnalytics },
  { key: 'inbox', label: 'Inbox', path: '/inbox', icon: NavIconInbox },
  { key: 'contacts', label: 'Contacts', path: '/contacts', icon: NavIconContacts },
  { key: 'campaigns', label: 'Campaigns', path: '/campaigns', icon: NavIconCampaigns },
  { key: 'automations', label: 'Automations', path: '/automations', icon: NavIconAutomations },
  { key: 'channels', label: 'Channels', path: '/channels', icon: NavIconChannels },
  { key: 'settings', label: 'Settings', path: '/settings', icon: NavIconSettings },
];

/**
 * Role-aware navigation — see spec §35 ("View as" demo switcher).
 * Order matches Figma side navigation for each visible set.
 */
const roleNavKeys: Record<Role, string[]> = {
  agent: ['analytics', 'inbox', 'contacts'],
  supervisor: ['analytics', 'inbox', 'contacts'],
  campaign_manager: ['analytics', 'campaigns', 'contacts'],
  admin: ['analytics', 'inbox', 'contacts', 'campaigns', 'automations', 'channels', 'settings'],
};

export function getNavItemsForRole(role: Role): NavItemConfig[] {
  const keys = roleNavKeys[role];
  return keys
    .map((key) => navItems.find((item) => item.key === key))
    .filter((item): item is NavItemConfig => Boolean(item));
}

export function getDefaultRouteForRole(role: Role): string {
  const items = getNavItemsForRole(role);
  const analytics = items.find((i) => i.key === 'analytics');
  return analytics?.path ?? items[0]?.path ?? '/analytics';
}
