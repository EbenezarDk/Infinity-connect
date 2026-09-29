import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import type { Role } from '../types';

export interface NavItemConfig {
  key: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

export const navItems: NavItemConfig[] = [
  { key: 'inbox', label: 'Inbox', path: '/inbox', icon: InboxRoundedIcon },
  { key: 'contacts', label: 'Contacts', path: '/contacts', icon: PeopleAltRoundedIcon },
  { key: 'campaigns', label: 'Campaigns', path: '/campaigns', icon: CampaignRoundedIcon },
  { key: 'automations', label: 'Automations', path: '/automations', icon: BoltRoundedIcon },
  { key: 'analytics', label: 'Analytics', path: '/analytics', icon: InsightsRoundedIcon },
  { key: 'channels', label: 'Channels', path: '/channels', icon: HubRoundedIcon },
  { key: 'settings', label: 'Settings', path: '/settings', icon: SettingsRoundedIcon },
];

/**
 * Role-aware navigation — see spec §35 ("View as" demo switcher).
 * This governs which primary nav items are visible/enabled per role,
 * demonstrating scoped access without building real authentication.
 */
const roleNavKeys: Record<Role, string[]> = {
  agent: ['inbox', 'contacts', 'analytics'],
  supervisor: ['inbox', 'contacts', 'analytics'],
  campaign_manager: ['campaigns', 'contacts', 'analytics'],
  admin: ['inbox', 'contacts', 'campaigns', 'automations', 'analytics', 'channels', 'settings'],
};

export function getNavItemsForRole(role: Role): NavItemConfig[] {
  const keys = roleNavKeys[role];
  return keys
    .map((key) => navItems.find((item) => item.key === key))
    .filter((item): item is NavItemConfig => Boolean(item));
}

export function getDefaultRouteForRole(role: Role): string {
  const items = getNavItemsForRole(role);
  return items[0]?.path ?? '/inbox';
}
