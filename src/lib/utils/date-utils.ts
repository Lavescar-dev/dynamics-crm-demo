import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';

export function formatDate(date: Date | string | undefined, formatStr: string = 'MMM d, yyyy'): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return '';
  }
}

export function formatDateTime(date: Date | string | undefined): string {
  return formatDate(date, 'MMM d, yyyy h:mm a');
}

export function formatTime(date: Date | string | undefined): string {
  return formatDate(date, 'h:mm a');
}

export function formatRelativeTime(date: Date | string | undefined): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return '';
  }
}

export function formatSmartDate(date: Date | string | undefined): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isToday(dateObj)) {
      return `Today at ${format(dateObj, 'h:mm a')}`;
    }

    if (isYesterday(dateObj)) {
      return `Yesterday at ${format(dateObj, 'h:mm a')}`;
    }

    if (isThisWeek(dateObj)) {
      return format(dateObj, 'EEEE \'at\' h:mm a');
    }

    if (isThisYear(dateObj)) {
      return format(dateObj, 'MMM d \'at\' h:mm a');
    }

    return format(dateObj, 'MMM d, yyyy');
  } catch {
    return '';
  }
}

export function getDaysUntil(date: Date | string | undefined): number {
  if (!date) return 0;

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = dateObj.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export function isOverdue(date: Date | string | undefined): boolean {
  if (!date) return false;

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date();
  } catch {
    return false;
  }
}
