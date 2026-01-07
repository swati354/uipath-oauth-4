import { format, formatDistanceToNow, isValid } from 'date-fns';
import type { ProcessGetResponse } from 'uipath-sdk';
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
export function getProcessStatusColor(isLatestVersion: boolean): string {
  return isLatestVersion ? 'text-green-600' : 'text-orange-600';
}
/**
 * Get status background color class for process status
 */
export function getProcessStatusBgColor(isLatestVersion: boolean): string {
  return isLatestVersion ? 'bg-green-100' : 'bg-orange-100';
}
/**
 * Filter processes by search query
 */
export function filterProcessesByQuery(
  processes: ProcessGetResponse[],
  query: string
): ProcessGetResponse[] {
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
  processes: ProcessGetResponse[],
  field: string,
  direction: 'asc' | 'desc'
): ProcessGetResponse[] {
  return [...processes].sort((a, b) => {
    let aValue: any = '';
    let bValue: any = '';
    switch (field) {
      case 'name':
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case 'processVersion':
        aValue = a.processVersion || '';
        bValue = b.processVersion || '';
        break;
      case 'lastModified':
        aValue = new Date(a.lastModifiedTime || 0).getTime();
        bValue = new Date(b.lastModifiedTime || 0).getTime();
        break;
      case 'status':
        aValue = a.isLatestVersion ? 'latest' : 'outdated';
        bValue = b.isLatestVersion ? 'latest' : 'outdated';
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
export function calculateProcessMetrics(processes: ProcessGetResponse[]) {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return {
    total: processes.length,
    latest: processes.filter(p => p.isLatestVersion).length,
    outdated: processes.filter(p => !p.isLatestVersion).length,
    recentlyModified: processes.filter(p =>
      p.lastModifiedTime && new Date(p.lastModifiedTime) > oneDayAgo
    ).length
  };
}
/**
 * Determine if a process can be started
 */
export function canStartProcess(process: ProcessGetResponse): boolean {
  return process.isLatestVersion && !!process.key;
}
/**
 * Get process status text
 */
export function getProcessStatusText(process: ProcessGetResponse): string {
  if (process.isLatestVersion) {
    return 'Latest Version';
  }
  return 'Outdated Version';
}
/**
 * Get process display name with fallback
 */
export function getProcessDisplayName(process: ProcessGetResponse): string {
  return process.name || process.key || 'Unnamed Process';
}
/**
 * Format process version for display
 */
export function formatProcessVersion(process: ProcessGetResponse): string {
  return process.processVersion || 'Unknown';
}
/**
 * Check if process has description
 */
export function hasProcessDescription(process: ProcessGetResponse): boolean {
  return !!(process.description && process.description.trim());
}
/**
 * Get process description with fallback
 */
export function getProcessDescription(process: ProcessGetResponse): string {
  return process.description || 'No description available';
}