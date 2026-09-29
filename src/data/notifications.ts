import type { NotificationItem } from '../types';

export const notifications: NotificationItem[] = [
  {
    id: 'notif-1',
    kind: 'escalation',
    title: 'New escalation',
    description: 'Farhan Ali\'s conversation was escalated to Supervisor review.',
    timestamp: '2026-09-29T06:01:00',
    read: false,
  },
  {
    id: 'notif-2',
    kind: 'sla',
    title: 'SLA approaching',
    description: 'Rahul Kumar — response due in 18 minutes.',
    timestamp: '2026-09-29T10:30:00',
    read: false,
  },
  {
    id: 'notif-3',
    kind: 'assignment',
    title: 'New assignment',
    description: 'You were assigned Ayesha Siddiqui\'s conversation.',
    timestamp: '2026-09-29T09:40:00',
    read: false,
  },
  {
    id: 'notif-4',
    kind: 'channel',
    title: 'Channel disconnected',
    description: 'RCS Business Messaging lost connection with carrier.',
    timestamp: '2026-09-29T05:00:00',
    read: true,
  },
  {
    id: 'notif-5',
    kind: 'campaign',
    title: 'Campaign completed',
    description: 'Payment Reminder — September finished sending to 3,210 recipients.',
    timestamp: '2026-09-24T12:00:00',
    read: true,
  },
];
