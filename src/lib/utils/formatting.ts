// Formatting utilities for Vertex CRM

export function formatCurrency(value: number | undefined, currency: string = 'USD'): string {
  if (value === undefined || value === null) return '';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number | undefined): string {
  if (value === undefined || value === null) return '';

  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPhone(phone: string | undefined): string {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX if 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
}

export function formatPercentage(value: number | undefined, decimals: number = 0): string {
  if (value === undefined || value === null) return '';

  return `${value.toFixed(decimals)}%`;
}

export function truncate(text: string | undefined, length: number = 50): string {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getInitials(name: string | undefined): string {
  if (!name) return '?';

  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Lead statuses
    'New': 'bg-blue-500',
    'Contacted': 'bg-purple-500',
    'Qualified': 'bg-green-500',
    'Lost': 'bg-red-500',
    'Disqualified': 'bg-gray-500',

    // Ratings
    'Hot': 'bg-red-500',
    'Warm': 'bg-yellow-500',
    'Cold': 'bg-blue-500',

    // Case statuses
    'Active': 'bg-blue-500',
    'Resolved': 'bg-green-500',
    'Cancelled': 'bg-gray-500',
    'On Hold': 'bg-yellow-500',

    // Priorities
    'High': 'bg-red-500',
    'Normal': 'bg-blue-500',
    'Low': 'bg-gray-500',

    // Generic
    'Completed': 'bg-green-500',
    'In Progress': 'bg-blue-500',
    'Not Started': 'bg-gray-500',
  };

  return statusColors[status] || 'bg-gray-500';
}
