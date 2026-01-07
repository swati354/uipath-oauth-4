import { format, formatDistanceToNow, isValid } from 'date-fns';
/**
 * Format a process date for display
 */
export function formatProcessDate(dateString?: string | null): string {
  if (!dateString) {
    return 'Never';
  }
  const date = new Date(dateString);
  if (!isValid(date)) {
    return 'Invalid date';
  }
  // If the date is within the last 7 days, show relative time
  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  if (diffInDays < 7) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  // Otherwise show formatted date
  return format(date, 'MMM d, yyyy');
}
/**
 * Get status color class for process status
 */
export function getProcessStatusColor(isActive: boolean): string {
  return isActive ? 'text-green-600' : 'text-red-600';
}
/**
 * Get status background color class for process status
 */
export function getProcessStatusBgColor(isActive: boolean): string {
  return isActive ? 'bg-green-100' : 'bg-red-100';
}
/**
 * Filter processes by search query
 */
export function filterProcessesByQuery(
  processes: any[], 
  query: string
): any[] {
  if (!query.trim()) {
    return processes;
  }
  const searchTerm = query.toLowerCase();
  return processes.filter(process => 
    process.name?.toLowerCase().includes(searchTerm) ||
    process.key?.toLowerCase().includes(searchTerm) ||
    process.description?.toLowerCase().includes(searchTerm)
  );
}
/**
 * Sort processes by field and direction
 */
export function sortProcesses(
  processes: any[], 
  field: string, 
  direction: 'asc' | 'desc'
): any[] {
  return [...processes].sort((a, b) => {
    let aValue: any = '';
    let bValue: any = '';
    switch (field) {
      case 'name':
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case 'version':
        aValue = a.version || '';
        bValue = b.version || '';
        break;
      case 'lastModified':
        aValue = new Date(a.lastModifiedTime || 0).getTime();
        bValue = new Date(b.lastModifiedTime || 0).getTime();
        break;
      case 'status':
        aValue = a.isActive ? 'active' : 'inactive';
        bValue = b.isActive ? 'active' : 'inactive';
        break;
      default:
        return 0;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return direction === 'asc' ? comparison : -comparison;
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });
}
/**
 * Calculate process metrics
 */
export function calculateProcessMetrics(processes: any[]) {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return {
    total: processes.length,
    active: processes.filter(p => p.isActive).length,
    inactive: processes.filter(p => !p.isActive).length,
    recentlyModified: processes.filter(p => 
      p.lastModifiedTime && new Date(p.lastModifiedTime) > oneDayAgo
    ).length
  };
}