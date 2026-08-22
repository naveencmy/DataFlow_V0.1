import {
  generateSystemLoginId,
  generateLoginId,
  generateInitialPassword,
} from '../../src/shared/utils/idGenerator.js';

describe('ID Generator Unit Tests', () => {
  describe('generateSystemLoginId', () => {
    it('should generate standard format: OIJODO20220001 for Odoo India + John Doe (2022, #1)', () => {
      const loginId = generateSystemLoginId('John Doe', 'Odoo India', 2022, []);
      expect(loginId).toBe('OIJODO20220001');
    });

    it('should increment serial number based on existing employees in that year', () => {
      const existing = [
        { loginId: 'OIJODO20220001' },
        { loginId: 'OIPSHA20220002' },
      ];
      const loginId = generateSystemLoginId('Marcus Chen', 'Odoo India', 2022, existing);
      expect(loginId).toBe('OIMACH20220003');
    });

    it('should handle single names gracefully with padding', () => {
      const loginId = generateSystemLoginId('Naveen', 'Google', 2026, []);
      expect(loginId.startsWith('GONANA2026')).toBe(true);
    });

    it('should handle single word company names', () => {
      const loginId = generateSystemLoginId('Sarah Williams', 'Dayflow', 2026, []);
      expect(loginId.startsWith('DASAWI2026')).toBe(true);
    });
  });

  describe('generateInitialPassword', () => {
    it('should generate secure password prefixed with Dayflow@', () => {
      const pwd = generateInitialPassword();
      expect(pwd.startsWith('Dayflow@')).toBe(true);
      expect(pwd.length).toBe(16); // Dayflow@(8) + 8 random
    });
  });
});
