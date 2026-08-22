// ─── ID Generator (ported from frontend utils/idGenerator.js) ─────────────────

/**
 * Generates a Dayflow employee Login ID.
 * Format: OI + First2(FirstName) + First2(LastName) + Year + 4-digit Serial
 * Example: OIJODO20260001
 */
export function generateLoginId(prefix = 'OIT', fullName, year, serial) {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.slice(0, 2).toUpperCase() || 'XX';
  const last = parts[1]?.slice(0, 2).toUpperCase() || 'XX';
  const serialStr = String(serial).padStart(4, '0');
  return `${prefix}${first}${last}${year}${serialStr}`;
}

/**
 * Generates a random 8-character alphanumeric initial password
 */
export function generateInitialPassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/**
 * Generates employee code from department and serial number
 * Example: DF-ENG-042
 */
export function generateEmployeeCode(department, serial) {
  const deptCode = department.slice(0, 3).toUpperCase();
  return `DF-${deptCode}-${String(serial).padStart(3, '0')}`;
}
