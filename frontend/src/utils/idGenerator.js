/**
 * Automatic Login ID Generator adhering strictly to Wireframe Rule:
 * Format: [CompanyPrefix][First2FirstName][First2LastName][YearOfJoining][SerialNumber]
 * Example: Odoo India + John Doe (2022, #1) -> OIJODO20220001
 */
export function generateSystemLoginId(fullName, companyName = 'Odoo India', year = new Date().getFullYear(), existingEmployees = []) {
  // 1. Company Prefix (First letters of words in company name, e.g. "Odoo India" -> "OI", "Google" -> "GO")
  let companyPrefix = 'OI';
  if (companyName) {
    const words = companyName.trim().split(/\s+/);
    if (words.length >= 2) {
      companyPrefix = (words[0][0] + words[1][0]).toUpperCase();
    } else if (words[0].length >= 2) {
      companyPrefix = words[0].substring(0, 2).toUpperCase();
    } else {
      companyPrefix = words[0].toUpperCase() + 'X';
    }
  }

  // 2. Name Code: First 2 letters of first name + First 2 letters of last name (e.g. John Doe -> JODO)
  const nameParts = (fullName || 'John Doe').trim().split(/\s+/);
  let firstName = nameParts[0] || 'User';
  let lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : firstName;

  const first2First = (firstName.substring(0, 2) + 'XX').substring(0, 2).toUpperCase();
  const first2Last = (lastName.substring(0, 2) + 'XX').substring(0, 2).toUpperCase();
  const nameCode = first2First + first2Last;

  // 3. Year of Joining (4 digits)
  const yearStr = String(year);

  // 4. Serial number (4 digits zero-padded) for that year/prefix
  const yearEmployees = existingEmployees.filter((emp) => {
    if (!emp.loginId) return false;
    return emp.loginId.includes(yearStr);
  });
  const serial = String(yearEmployees.length + 1).padStart(4, '0');

  return `${companyPrefix}${nameCode}${yearStr}${serial}`;
}

export function generateLoginId(companyPrefix = 'OIT', fullName = 'User', year = new Date().getFullYear(), serial = 1) {
  const nameParts = (fullName || 'User').trim().split(/\s+/);
  let firstName = nameParts[0] || 'User';
  let lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : firstName;

  const first2First = (firstName.substring(0, 2) + 'XX').substring(0, 2).toUpperCase();
  const first2Last = (lastName.substring(0, 2) + 'XX').substring(0, 2).toUpperCase();
  const nameCode = first2First + first2Last;

  const paddedSerial = String(serial).padStart(4, '0');
  return `${companyPrefix}${nameCode}${year}${paddedSerial}`;
}

export function generateInitialPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let pass = '';
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Dayflow@${pass}`;
}
