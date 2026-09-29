import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Role } from '../types';
import { currentAgentByRole, getAgentById } from '../data/agents';

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  currentAgentId: string;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('agent');

  const value = useMemo<RoleContextValue>(
    () => ({ role, setRole, currentAgentId: currentAgentByRole[role] }),
    [role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}

export function useCurrentAgent() {
  const { currentAgentId } = useRole();
  return getAgentById(currentAgentId);
}

/**
 * Permission model — see spec §24.
 * NOTE: this is a UX model, not a confirmed business permission matrix.
 * VALIDATE with RCOS before treating as authoritative.
 */
export type PermissionAction =
  | 'view_assigned_conversations'
  | 'reply'
  | 'reassign'
  | 'escalate'
  | 'team_analytics'
  | 'create_campaigns'
  | 'manage_users'
  | 'configure_channels';

const permissionMatrix: Record<PermissionAction, Record<Role, boolean | 'limited'>> = {
  view_assigned_conversations: { agent: true, supervisor: true, campaign_manager: false, admin: true },
  reply: { agent: true, supervisor: true, campaign_manager: false, admin: true },
  reassign: { agent: 'limited', supervisor: true, campaign_manager: false, admin: true },
  escalate: { agent: true, supervisor: true, campaign_manager: false, admin: true },
  team_analytics: { agent: 'limited', supervisor: true, campaign_manager: true, admin: true },
  create_campaigns: { agent: false, supervisor: 'limited', campaign_manager: true, admin: true },
  manage_users: { agent: false, supervisor: false, campaign_manager: false, admin: true },
  configure_channels: { agent: false, supervisor: false, campaign_manager: false, admin: true },
};

export function hasPermission(role: Role, action: PermissionAction): boolean | 'limited' {
  return permissionMatrix[action][role];
}

export function useHasPermission(action: PermissionAction) {
  const { role } = useRole();
  return hasPermission(role, action);
}
