export function formatRelativeTime(iso: string): string {
  const now = new Date('2026-09-29T11:00:00');
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export function formatTimeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTimeLabel(iso: string): string {
  return `${formatDateLabel(iso)} · ${formatTimeLabel(iso)}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}

export function formatSlaLabel(minutesRemaining?: number): { label: string; overdue: boolean } | null {
  if (minutesRemaining === undefined) return null;
  if (minutesRemaining < 0) {
    return { label: `Overdue by ${Math.abs(minutesRemaining)}m`, overdue: true };
  }
  return { label: `${minutesRemaining}m left`, overdue: false };
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
