/**
 * Formats numbers into Indian Rupee Currency string
 * e.g., 50000 -> ₹50,000
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats annual and monthly wage string
 * e.g. "₹50,000 / month (₹6,00,000 / year)"
 */
export function formatWagePair(monthlyWage = 0) {
  const monthly = formatCurrency(monthlyWage);
  const annual = formatCurrency(monthlyWage * 12);
  return { monthly, annual };
}

/**
 * Format decimal hours to "Xh Ym" string (e.g. 8.5 -> "8h 30m")
 */
export function formatWorkHours(decimalHours) {
  if (!decimalHours || decimalHours <= 0) return '0h 00m';
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

/**
 * Formats ISO date "YYYY-MM-DD" to human readable "DD MMM YYYY"
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
