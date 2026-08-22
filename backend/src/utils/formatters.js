/**
 * Returns today's date as YYYY-MM-DD string
 */
export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Formats a Date object to 12-hour time string: "09:05 AM"
 */
export function formatTime12h(date = new Date()) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Returns the difference in hours between two 12h time strings
 * e.g. "09:00 AM" and "06:00 PM" → 9.0
 */
export function calcWorkHours(checkInStr, checkOutStr) {
  try {
    const parse = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    const inMinutes = parse(checkInStr);
    const outMinutes = parse(checkOutStr);
    const diff = outMinutes - inMinutes;
    return diff > 0 ? Number((diff / 60).toFixed(2)) : 0;
  } catch {
    return 0;
  }
}

/**
 * Calculates the number of working days (Mon-Fri) between two date strings
 */
export function calcWorkingDays(startDateStr, endDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  let count = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}
