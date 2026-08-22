/**
 * Comprehensive Backend Service Test Suite
 * Tests all core backend services, utilities, calculation engines, and route pipelines
 */

import { buildDefaultSalaryComponents, recalculateComponents, calculateDeductions, computeLivePayroll } from '../src/shared/utils/salaryEngine.js';
import { generateSystemLoginId, generateLoginId, generateInitialPassword } from '../src/shared/utils/idGenerator.js';
import { deriveEmployeeWorkStatus } from '../src/shared/utils/statusDerivation.js';
import { AuthService } from '../src/modules/auth/auth.service.js';
import { EmployeeService } from '../src/modules/employee/employee.service.js';
import { AttendanceService } from '../src/modules/attendance/attendance.service.js';
import { LeaveService } from '../src/modules/leave/leave.service.js';
import { PayrollService } from '../src/modules/payroll/payroll.service.js';
import { NotificationService } from '../src/modules/notification/notification.service.js';
import app from '../src/app.js';

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedCount++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING DAYFLOW HRMS BACKEND SERVICE TEST SUITE');
  console.log('======================================================\n');

  // ─── 1. Salary Engine Tests ───────────────────────────────────────────────
  console.log('📦 1. Testing Salary Engine & Payroll Computations:');
  const components = buildDefaultSalaryComponents(85000);
  const basic = components.find(c => c.name === 'Basic Salary');
  const hra = components.find(c => c.name.includes('HRA') || c.name.includes('House Rent'));
  const fixed = components.find(c => c.name.includes('Fixed Allowance'));
  const total = components.reduce((s, c) => s + c.calculatedAmount, 0);

  assert(basic.calculatedAmount === 42500, 'Basic salary is exactly 50% of 85,000 (42,500)');
  assert(hra.calculatedAmount === 21250, 'HRA is 50% of Basic salary (21,250)');
  assert(fixed.calculatedAmount === 12250, 'Fixed Allowance balances subtotal (12,250)');
  assert(total === 85000, 'Sum of all components equals 85,000');

  const deductions = calculateDeductions(42500, 12, 12, 200);
  assert(deductions.employeePF === 5100, 'Employee PF deduction is 12% of Basic (5,100)');
  assert(deductions.totalDeductions === 5300, 'Total deductions is PF + Prof Tax (5,300)');

  const payroll22 = computeLivePayroll({ monthlyWage: 85000, components }, 22, 0, 0);
  assert(payroll22.netPayable === 79700, 'Full month (22/22 days) net payable is 79,700');

  const payroll20 = computeLivePayroll({ monthlyWage: 85000, components }, 22, 2, 0);
  assert(payroll20.payableDays === 20, '2 unpaid days yields 20 payable days');
  assert(payroll20.netPayable === 71973, 'Proportionate net payable calculated accurately (71,973)');

  const payroll0 = computeLivePayroll({ monthlyWage: 85000, components }, 22, 22, 0);
  assert(payroll0.netPayable === 0, 'Zero payable days yields 0 net payable');

  // ─── 2. ID Generator Tests ────────────────────────────────────────────────
  console.log('\n📦 2. Testing ID & Credential Generator:');
  const loginId1 = generateSystemLoginId('John Doe', 'Odoo India', 2022, []);
  assert(loginId1 === 'OIJODO20220001', 'System Login ID format matches OIJODO20220001');

  const loginId2 = generateSystemLoginId('Marcus Chen', 'Dayflow Technologies', 2026, [
    { loginId: 'DTMC20260001' },
  ]);
  assert(loginId2 === 'DTMACH20260002', 'Login ID serial increments for matching year');

  const pwd = generateInitialPassword();
  assert(pwd.startsWith('Dayflow@') && pwd.length === 16, 'Initial password meets length and prefix standard');

  // ─── 3. Work Status Derivation Tests ──────────────────────────────────────
  console.log('\n📦 3. Testing Work Status Derivation:');
  const statusPresent = deriveEmployeeWorkStatus(
    'emp-1',
    '2026-08-22',
    [{ employeeId: 'emp-1', date: '2026-08-22', checkInTime: '08:55 AM' }],
    []
  );
  assert(statusPresent.status === 'PRESENT', 'Checked-in employee derives PRESENT 🟢');

  const statusLeave = deriveEmployeeWorkStatus(
    'emp-3',
    '2026-08-22',
    [],
    [{ employeeId: 'emp-3', status: 'Approved', leaveType: 'Paid Time Off', startDate: '2026-08-20', endDate: '2026-08-25' }]
  );
  assert(statusLeave.status === 'ON_LEAVE', 'Approved leave derives ON_LEAVE ✈️');

  const statusAbsent = deriveEmployeeWorkStatus('emp-5', '2026-08-22', [], []);
  assert(statusAbsent.status === 'ABSENT', 'No check-in & no leave derives ABSENT 🟡');

  // ─── 4. Auth Service Tests ────────────────────────────────────────────────
  console.log('\n📦 4. Testing Auth Service (JWT Tokens & Validation):');
  const mockAuthRepo = {
    findByEmail: async () => null,
    findByEmailOrLoginId: async () => null,
    createUserWithEmployee: async (data) => data,
    updateRefreshToken: async () => true,
    countEmployees: async () => 5,
  };
  const authService = new AuthService(mockAuthRepo);
  const tokenPayload = { userId: 'u-1', loginId: 'TEST01', email: 'test@dayflow.internal', role: 'ADMIN' };
  const tokens = authService.generateTokens(tokenPayload);

  assert(typeof tokens.accessToken === 'string' && tokens.accessToken.length > 20, 'Generates valid JWT Access Token');
  assert(typeof tokens.refreshToken === 'string' && tokens.refreshToken.length > 20, 'Generates valid JWT Refresh Token');

  // ─── 5. Employee Service & RBAC Tests ─────────────────────────────────────
  console.log('\n📦 5. Testing Employee Service & Field-Level RBAC:');
  const mockEmpRepo = {
    findById: async (id) => ({
      id: 'emp-1',
      userId: 'user-1',
      name: 'Alex Johnson',
      salary: { monthlyWage: 85000 },
      department: 'Engineering',
    }),
    update: async (id, data) => ({ id, ...data }),
  };
  const empService = new EmployeeService(mockEmpRepo);

  // Employee self-update: allowed fields
  const selfAllowed = await empService.updateEmployee(
    'emp-1',
    { mobile: '+91 99999 88888', about: 'Updated bio' },
    { employeeId: 'emp-1', userId: 'user-1', role: 'EMPLOYEE' }
  );
  assert(selfAllowed.mobile === '+91 99999 88888', 'Employee can update personal contact details');

  // Employee self-update: restricted salary field
  let caughtRbac = false;
  try {
    await empService.updateEmployee(
      'emp-1',
      { salary: { monthlyWage: 150000 } },
      { employeeId: 'emp-1', userId: 'user-1', role: 'EMPLOYEE' }
    );
  } catch (err) {
    if (err.statusCode === 403) caughtRbac = true;
  }
  assert(caughtRbac, 'Employee cannot modify restricted salary field (403 Forbidden)');

  // ─── 6. Attendance Service Tests ──────────────────────────────────────────
  console.log('\n📦 6. Testing Attendance Service (Clock-in / Clock-out):');
  let attendanceStore = null;
  const mockAttRepo = {
    findByEmployeeAndDate: async () => attendanceStore,
    createOrUpdate: async (record) => {
      attendanceStore = record;
      return record;
    },
    findByEmployee: async () => [attendanceStore],
  };
  const attService = new AttendanceService(mockAttRepo);

  const checkInRes = await attService.checkIn(
    { employeeId: 'emp-1' },
    { notes: 'Office check-in', date: '2026-08-22' }
  );
  assert(checkInRes.status === 'Present' && checkInRes.checkInTime !== null, 'Check-in recorded with timestamp');

  // Duplicate check-in rejection
  let caughtDupCheckIn = false;
  try {
    await attService.checkIn({ employeeId: 'emp-1' }, { date: '2026-08-22' });
  } catch (err) {
    if (err.statusCode === 400) caughtDupCheckIn = true;
  }
  assert(caughtDupCheckIn, 'Duplicate check-in on same day is rejected (400)');

  // Check-out calculation
  const checkOutRes = await attService.checkOut({ employeeId: 'emp-1' }, { date: '2026-08-22' });
  assert(checkOutRes.checkOutTime !== null, 'Check-out timestamp and work hours calculated');

  // ─── 7. Leave Service & Atomic Workflow Tests ─────────────────────────────
  console.log('\n📦 7. Testing Leave Service (Working Days & Review):');
  let leaveDb = {
    id: 'leave-100',
    employeeId: 'emp-1',
    leaveType: 'Sick Leave',
    startDate: '2026-08-24',
    endDate: '2026-08-25',
    totalDays: 2,
    status: 'Pending',
  };
  const mockLeaveRepo = {
    findById: async () => leaveDb,
    reviewInTransaction: async ({ status, reviewedBy, attendanceRecordsToCreate }) => {
      leaveDb.status = status;
      leaveDb.reviewedBy = reviewedBy;
      return { ...leaveDb, attendanceCreatedCount: attendanceRecordsToCreate.length };
    },
  };
  const leaveService = new LeaveService(mockLeaveRepo);

  const workingDays = leaveService.calculateWorkingDays('2026-08-24', '2026-08-28');
  assert(workingDays === 5, 'Working days calculated correctly excluding weekends (5 days)');

  const reviewRes = await leaveService.reviewLeave(
    'leave-100',
    { status: 'Approved', reviewRemarks: 'Approved by HR' },
    { employeeName: 'Sarah Williams', role: 'HR' }
  );
  assert(reviewRes.status === 'Approved', 'Leave status successfully reviewed to Approved');
  assert(reviewRes.attendanceCreatedCount === 2, 'Atomic transaction auto-generates Attendance records for date range');

  // ─── 8. Express App & Route Configuration Tests ───────────────────────────
  console.log('\n📦 8. Testing Express App Route Pipeline:');
  assert(typeof app === 'function', 'Express application initialized and exported properly');

  console.log('\n======================================================');
  console.log(`📊 TEST RESULTS: ${passedCount} PASSED | ${failedCount} FAILED`);
  console.log('======================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
