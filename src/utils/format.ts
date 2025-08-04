/**
 * Utility functions for formatting data
 */

/**
 * Format a date string or Date object to locale string
 */
export function formatDate(date: string | Date, locale: string = 'es-ES'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '-';
  }
}

/**
 * Format a date string or Date object to datetime string
 */
export function formatDateTime(date: string | Date, locale: string = 'es-ES'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number, currency: string = 'EUR', locale: string = 'es-ES'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

/**
 * Format number with thousands separators
 */
export function formatNumber(num: number, locale: string = 'es-ES'): string {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch {
    return num.toString();
  }
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a Spanish phone number (9 digits starting with 6, 7, or 9)
  if (cleaned.length === 9 && /^[679]/.test(cleaned)) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  
  // Check if it's an international number with Spanish country code (+34)
  if (cleaned.length === 11 && cleaned.startsWith('34')) {
    const national = cleaned.substring(2);
    return `+34 ${national.substring(0, 3)} ${national.substring(3, 6)} ${national.substring(6)}`;
  }
  
  // Return original if doesn't match expected patterns
  return phone;
}

/**
 * Get initials from full name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date, locale: string = 'es'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    const intervals = [
      { label: locale === 'es' ? 'año' : 'year', seconds: 31536000, plural: locale === 'es' ? 'años' : 'years' },
      { label: locale === 'es' ? 'mes' : 'month', seconds: 2592000, plural: locale === 'es' ? 'meses' : 'months' },
      { label: locale === 'es' ? 'día' : 'day', seconds: 86400, plural: locale === 'es' ? 'días' : 'days' },
      { label: locale === 'es' ? 'hora' : 'hour', seconds: 3600, plural: locale === 'es' ? 'horas' : 'hours' },
      { label: locale === 'es' ? 'minuto' : 'minute', seconds: 60, plural: locale === 'es' ? 'minutos' : 'minutes' },
    ];
    
    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count > 0) {
        const unit = count === 1 ? interval.label : interval.plural;
        const suffix = locale === 'es' ? 'hace' : 'ago';
        return locale === 'es' 
          ? `${suffix} ${count} ${unit}`
          : `${count} ${unit} ${suffix}`;
      }
    }
    
    return locale === 'es' ? 'ahora mismo' : 'just now';
  } catch {
    return '-';
  }
}
