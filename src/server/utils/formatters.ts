/**
 * Formatting utility functions
 */

/**
 * Format duration in seconds to mm:ss format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "3:45")
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Format date to readable string
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format price to currency string
 * @param price - Price as number
 * @returns Formatted price string (e.g., "$9.99")
 */
export function formatPrice(price: number): string {
  if (!Number.isFinite(price) || price < 0) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
