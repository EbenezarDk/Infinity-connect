import type { Agent } from '../types';

export const agents: Agent[] = [
  { id: 'agent-priya', name: 'Priya Sharma', avatarColor: '#2F4CDD', role: 'agent', status: 'online', activeConversations: 8, escalations: 1, avgResponseTimeMinutes: 4 },
  { id: 'agent-arun', name: 'Arun Nair', avatarColor: '#1FA855', role: 'agent', status: 'online', activeConversations: 6, escalations: 0, avgResponseTimeMinutes: 6 },
  { id: 'agent-meena', name: 'Meena Iyer', avatarColor: '#B5730A', role: 'agent', status: 'away', activeConversations: 5, escalations: 2, avgResponseTimeMinutes: 9 },
  { id: 'agent-rahul-agent', name: 'Rahul Verma', avatarColor: '#7B4FE0', role: 'agent', status: 'online', activeConversations: 3, escalations: 0, avgResponseTimeMinutes: 3 },
  { id: 'agent-sana', name: 'Sana Khan', avatarColor: '#C4362F', role: 'supervisor', status: 'online', activeConversations: 2, escalations: 0, avgResponseTimeMinutes: 5 },
  { id: 'agent-vikram', name: 'Vikram Desai', avatarColor: '#2C6EBF', role: 'campaign_manager', status: 'online', activeConversations: 0, escalations: 0, avgResponseTimeMinutes: 0 },
  { id: 'agent-admin', name: 'Ananya Rao', avatarColor: '#0B1220', role: 'admin', status: 'online', activeConversations: 0, escalations: 0, avgResponseTimeMinutes: 0 },
];

export const currentAgentByRole: Record<string, string> = {
  agent: 'agent-priya',
  supervisor: 'agent-sana',
  campaign_manager: 'agent-vikram',
  admin: 'agent-admin',
};

export function getAgentById(id?: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}
