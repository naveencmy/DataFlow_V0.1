/**
 * Dayflow HRMS — MongoDB Seed Script
 * Seeds the database with the same data as the frontend seed file.
 * Run: npm run seed
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Payroll from '../models/Payroll.js';
import Notification from '../models/Notification.js';
import { buildDefaultSalaryComponents } from '../utils/salaryEngine.js';
import { getTodayDateString } from '../utils/formatters.js';

const today = getTodayDateString();

// ─── Seed Employees ───────────────────────────────────────────────────────────
const SEED_EMPLOYEES = [
  {
    loginId: 'OIALJO20220001',
    name: 'Alex Johnson',
    email: 'alex.johnson@dayflow.internal',
    mobile: '+91 98765 43210',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
    department: 'Engineering',
    jobPosition: 'Lead Frontend Architect',
    manager: 'Sarah Williams',
    location: 'Bangalore Tech Hub',
    company: 'Dayflow Technologies Pvt Ltd',
    dateOfJoining: '2022-03-15',
    dateOfBirth: '1992-06-18',
    residentialAddress: '#402, Pine Grove Apts, 12th Main, Indiranagar, Bangalore 560038',
    nationality: 'Indian',
    personalEmail: 'alex.j.personal@gmail.com',
    gender: 'Non-Binary',
    maritalStatus: 'Single',
    about: 'Passionate UI/UX architect obsessed with fluid interaction design, performance optimizations, and design system engineering.',
    whatILoveAboutMyJob: 'The collaborative autonomy, solving complex workflow ergonomics, and seeing our HR tools empower thousands of daily workdays.',
    interestsAndHobbies: 'Algorithmic sound synthesis, road cycling, specialty pour-over coffee brewing, and open-source contribution.',
    skills: [
      { name: 'React & TypeScript', level: 'Expert' },
      { name: 'Tailwind CSS & Design Systems', level: 'Expert' },
      { name: 'State Management & Web Performance', level: 'Advanced' },
      { name: 'UI Ergonomics & Accessibility (a11y)', level: 'Advanced' },
    ],
    certifications: [
      { name: 'Meta Certified Front-End Developer', issuer: 'Meta / Coursera', issueYear: '2023' },
      { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueYear: '2022' },
    ],
    documents: [
      { title: 'Employment Contract & Offer Letter', fileName: 'Alex_Johnson_Employment_Agreement.pdf', fileSize: '1.8 MB', uploadDate: '2022-03-15', category: 'Contract' },
    ],
    bankDetails: {
      accountNumber: '91823746192837', bankName: 'HDFC Bank Ltd', ifscCode: 'HDFC0001234',
      panNumber: 'ABCDE1234F', uanNumber: '100987654321', employeeCode: 'DF-ENG-042',
    },
    salary: {
      wageType: 'Fixed Wage', monthlyWage: 85000, annualWage: 1020000,
      components: buildDefaultSalaryComponents(85000),
      employeePFPercentage: 12, employerPFPercentage: 12, professionalTax: 200, workingDaysPerWeek: 5, breakTimeMinutes: 60,
    },
    status: 'Active',
  },
  {
    loginId: 'OIPRSH20230002',
    name: 'Priya Sharma',
    email: 'priya.sharma@dayflow.internal',
    mobile: '+91 91234 56780',
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
    department: 'Human Resources',
    jobPosition: 'People Operations Specialist',
    manager: 'Sarah Williams',
    location: 'Bangalore Tech Hub',
    company: 'Dayflow Technologies Pvt Ltd',
    dateOfJoining: '2023-01-10',
    dateOfBirth: '1995-11-24',
    residentialAddress: 'Flat 12B, Skyline Towers, Outer Ring Road, Bellandur, Bangalore 560103',
    nationality: 'Indian',
    personalEmail: 'priya.sharma.hr@outlook.com',
    gender: 'Female',
    maritalStatus: 'Married',
    about: 'Dedicated to cultivating an inclusive, high-trust workplace culture and building friction-free onboarding experiences.',
    whatILoveAboutMyJob: 'Fostering genuine career growth, listening to team needs, and making every employee feel valued from day one.',
    interestsAndHobbies: 'Classical Hindustani music, weekend pottery workshops, marathon running, and reading historical fiction.',
    skills: [
      { name: 'Talent Acquisition & Onboarding', level: 'Expert' },
      { name: 'Payroll Compliance & Labor Law', level: 'Advanced' },
      { name: 'Employee Engagement Strategy', level: 'Advanced' },
    ],
    certifications: [{ name: 'SHRM Certified Professional (SHRM-CP)', issuer: 'SHRM', issueYear: '2023' }],
    documents: [{ title: 'HR Specialist Offer Letter', fileName: 'Priya_Sharma_Offer.pdf', fileSize: '1.2 MB', uploadDate: '2023-01-10', category: 'Contract' }],
    bankDetails: {
      accountNumber: '44556677889900', bankName: 'ICICI Bank Ltd', ifscCode: 'ICIC0000456',
      panNumber: 'PQRST5678G', uanNumber: '100876543210', employeeCode: 'DF-HR-019',
    },
    salary: {
      wageType: 'Fixed Wage', monthlyWage: 65000, annualWage: 780000,
      components: buildDefaultSalaryComponents(65000),
      employeePFPercentage: 12, employerPFPercentage: 12, professionalTax: 200, workingDaysPerWeek: 5, breakTimeMinutes: 60,
    },
    status: 'Active',
  },
  {
    loginId: 'OIMACH20210003',
    name: 'Marcus Chen',
    email: 'marcus.chen@dayflow.internal',
    mobile: '+91 99887 76655',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
    department: 'Product',
    jobPosition: 'Senior Product Manager',
    manager: 'Sarah Williams',
    location: 'Bangalore Tech Hub',
    company: 'Dayflow Technologies Pvt Ltd',
    dateOfJoining: '2021-08-01',
    dateOfBirth: '1989-03-12',
    residentialAddress: 'Villa 18, Palm Meadows, Whitefield, Bangalore 560066',
    nationality: 'Indian',
    personalEmail: 'marcus.chen.pm@gmail.com',
    gender: 'Male',
    maritalStatus: 'Married',
    about: 'Product strategist bridging deep user empathy with data-driven roadmapping and metric execution.',
    whatILoveAboutMyJob: 'Transforming ambiguous workplace friction into seamless, high-retention software experiences.',
    interestsAndHobbies: 'Amateur photography, scuba diving, strategy board games, and chess.',
    skills: [
      { name: 'Product Roadmapping & OKRs', level: 'Expert' },
      { name: 'User Journey Mapping & Specs', level: 'Expert' },
      { name: 'A/B Testing & Metrics Analytics', level: 'Advanced' },
    ],
    certifications: [{ name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', issueYear: '2021' }],
    documents: [{ title: 'Product Director NDA & Agreement', fileName: 'Marcus_Chen_Agreement.pdf', fileSize: '2.1 MB', uploadDate: '2021-08-01', category: 'Contract' }],
    bankDetails: {
      accountNumber: '11223344556677', bankName: 'Axis Bank Ltd', ifscCode: 'UTIB0000789',
      panNumber: 'LMNOP9012K', uanNumber: '100765432109', employeeCode: 'DF-PRD-007',
    },
    salary: {
      wageType: 'Fixed Wage', monthlyWage: 120000, annualWage: 1440000,
      components: buildDefaultSalaryComponents(120000),
      employeePFPercentage: 12, employerPFPercentage: 12, professionalTax: 200, workingDaysPerWeek: 5, breakTimeMinutes: 60,
    },
    status: 'Active',
  },
  {
    loginId: 'OISAW I20200004',
    name: 'Sarah Williams',
    email: 'sarah.williams@dayflow.internal',
    mobile: '+91 98450 11223',
    profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces',
    department: 'Management',
    jobPosition: 'VP of Engineering & HR',
    manager: 'Board of Directors',
    location: 'Bangalore Tech Hub',
    company: 'Dayflow Technologies Pvt Ltd',
    dateOfJoining: '2020-01-05',
    dateOfBirth: '1985-09-03',
    residentialAddress: 'Penthouse 7, Regency Heights, Koramangala 4th Block, Bangalore 560034',
    nationality: 'Indian',
    personalEmail: 'sarah.williams.exec@gmail.com',
    gender: 'Female',
    maritalStatus: 'Married',
    about: 'Executive leader passionate about scaling high-velocity engineering organizations with balanced human-centered values.',
    whatILoveAboutMyJob: 'Empowering smart leaders to do the best work of their lives while maintaining balance.',
    interestsAndHobbies: 'Triathlon training, classical piano, angel investing, and mentorship.',
    skills: [
      { name: 'Organizational Leadership', level: 'Expert' },
      { name: 'System Architecture & Scale', level: 'Expert' },
      { name: 'Strategic Budgeting & Payroll Planning', level: 'Expert' },
    ],
    certifications: [{ name: 'Executive Leadership Certification', issuer: 'Stanford GSB', issueYear: '2020' }],
    documents: [{ title: 'Executive Employment Deed', fileName: 'Sarah_Williams_Deed.pdf', fileSize: '3.4 MB', uploadDate: '2020-01-05', category: 'Contract' }],
    bankDetails: {
      accountNumber: '99887766554433', bankName: 'State Bank of India', ifscCode: 'SBIN0001999',
      panNumber: 'WXYZ9876Q', uanNumber: '100654321098', employeeCode: 'DF-EXE-001',
    },
    salary: {
      wageType: 'Fixed Wage', monthlyWage: 180000, annualWage: 2160000,
      components: buildDefaultSalaryComponents(180000),
      employeePFPercentage: 12, employerPFPercentage: 12, professionalTax: 200, workingDaysPerWeek: 5, breakTimeMinutes: 60,
    },
    status: 'Active',
  },
  {
    loginId: 'OIDAKI20220005',
    name: 'David Kim',
    email: 'david.kim@dayflow.internal',
    mobile: '+91 97654 32109',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces',
    department: 'Design',
    jobPosition: 'Principal UX Designer',
    manager: 'Marcus Chen',
    location: 'Bangalore Tech Hub',
    company: 'Dayflow Technologies Pvt Ltd',
    dateOfJoining: '2022-10-01',
    dateOfBirth: '1993-04-20',
    residentialAddress: '#204, Green Glen Layout, Bellandur, Bangalore 560103',
    nationality: 'Indian',
    personalEmail: 'david.kim.design@gmail.com',
    gender: 'Male',
    maritalStatus: 'Single',
    about: 'Design systems fanatic, obsessed with typography, micro-interactions, and high-density enterprise software UX.',
    whatILoveAboutMyJob: 'Crafting clean, peaceful software interfaces that save people hours of tedious administrative toil.',
    interestsAndHobbies: 'Typeface design, urban sketching, mechanical keyboards, and tea ceremonies.',
    skills: [
      { name: 'Design Systems & Tokens', level: 'Expert' },
      { name: 'Figma & Interactive Prototyping', level: 'Expert' },
      { name: 'User Testing & Heuristic Evaluation', level: 'Advanced' },
    ],
    certifications: [{ name: 'Nielsen Norman Group UX Master Certified', issuer: 'NN/g', issueYear: '2022' }],
    documents: [{ title: 'Design Employment Contract', fileName: 'David_Kim_Contract.pdf', fileSize: '1.5 MB', uploadDate: '2022-10-01', category: 'Contract' }],
    bankDetails: {
      accountNumber: '33445566778899', bankName: 'Kotak Mahindra Bank', ifscCode: 'KKBK0000234',
      panNumber: 'KIMDK4321R', uanNumber: '100543210987', employeeCode: 'DF-DES-014',
    },
    salary: {
      wageType: 'Fixed Wage', monthlyWage: 75000, annualWage: 900000,
      components: buildDefaultSalaryComponents(75000),
      employeePFPercentage: 12, employerPFPercentage: 12, professionalTax: 200, workingDaysPerWeek: 5, breakTimeMinutes: 60,
    },
    status: 'Active',
  },
];

async function seedDatabase() {
  try {
    await connectDB();

    console.log('🌱 Starting database seed...\n');

    // ─── Clear existing data ────────────────────────────────────────────────
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Attendance.deleteMany({}),
      Leave.deleteMany({}),
      Payroll.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing collections');

    // ─── Create Admin user ──────────────────────────────────────────────────
    const admin = await User.create({
      loginId: 'admin@dayflow.internal',
      email: 'admin@dayflow.internal',
      passwordHash: 'admin123',  // will be hashed by pre-save
      role: 'ADMIN',
    });
    console.log(`✅ Admin user created: admin@dayflow.internal / admin123`);

    // ─── Create Employees & linked Users ───────────────────────────────────
    const createdEmployees = [];
    for (const empData of SEED_EMPLOYEES) {
      const emp = await Employee.create(empData);
      createdEmployees.push(emp);

      await User.create({
        loginId: empData.loginId,
        email: empData.email,
        passwordHash: 'employee123', // will be hashed
        role: 'EMPLOYEE',
        employeeId: emp._id,
      });
    }
    console.log(`✅ Created ${createdEmployees.length} employees and linked user accounts`);
    console.log(`   Default employee password: employee123`);

    // ─── Seed Attendance (last 10 weekdays) ────────────────────────────────
    const attendanceRecords = [];

    // Today's records for emp 1, 2, 4
    attendanceRecords.push(
      { employeeId: createdEmployees[0]._id, date: today, checkInTime: '08:55 AM', checkOutTime: null, workHours: 7.2, extraHours: 0, status: 'Present', notes: 'Working from Bangalore Tech Hub' },
      { employeeId: createdEmployees[1]._id, date: today, checkInTime: '09:15 AM', checkOutTime: '06:30 PM', workHours: 9.25, extraHours: 1.25, status: 'Present', notes: 'Completed payroll sprint review' },
      { employeeId: createdEmployees[3]._id, date: today, checkInTime: '08:30 AM', checkOutTime: null, workHours: 7.6, extraHours: 0, status: 'Present', notes: 'Executive alignment session' }
    );

    // Past 10 days records
    for (let i = 1; i <= 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      const dateStr = d.toISOString().split('T')[0];

      createdEmployees.forEach((emp, idx) => {
        if (idx === 2 && i === 1) return; // Marcus on leave day 1
        const randomMinutes = (idx * 7) % 20;
        const randomWorkHours = Number((8.2 + (idx % 3) * 0.4).toFixed(2));
        const extra = Math.max(0, Number((randomWorkHours - 8).toFixed(2)));

        attendanceRecords.push({
          employeeId: emp._id,
          date: dateStr,
          checkInTime: `09:${String(randomMinutes).padStart(2, '0')} AM`,
          checkOutTime: `06:${String(15 + randomMinutes).padStart(2, '0')} PM`,
          workHours: randomWorkHours,
          extraHours: extra,
          status: 'Present',
          notes: 'Regular on-schedule workday',
        });
      });
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Created ${attendanceRecords.length} attendance records`);

    // ─── Seed Leaves ───────────────────────────────────────────────────────
    await Leave.insertMany([
      {
        employeeId: createdEmployees[2]._id,
        employeeName: 'Marcus Chen', department: 'Product',
        employeeAvatar: createdEmployees[2].profilePicture,
        leaveType: 'Paid Time Off', startDate: today, endDate: today, totalDays: 1,
        remarks: 'Annual family wellness retreat.', status: 'Approved',
        appliedDate: '2026-08-18', reviewedDate: '2026-08-19',
        reviewedBy: 'admin@dayflow.internal', reviewRemarks: 'Approved. Enjoy your time off!',
      },
      {
        employeeId: createdEmployees[0]._id,
        employeeName: 'Alex Johnson', department: 'Engineering',
        employeeAvatar: createdEmployees[0].profilePicture,
        leaveType: 'Sick Leave', startDate: '2026-08-28', endDate: '2026-08-29', totalDays: 2,
        remarks: 'Scheduled minor outpatient dental surgery.', status: 'Pending',
        appliedDate: '2026-08-21',
      },
      {
        employeeId: createdEmployees[1]._id,
        employeeName: 'Priya Sharma', department: 'Human Resources',
        employeeAvatar: createdEmployees[1].profilePicture,
        leaveType: 'Paid Time Off', startDate: '2026-09-05', endDate: '2026-09-08', totalDays: 4,
        remarks: 'Attending National HR Tech Summit in Hyderabad.', status: 'Pending',
        appliedDate: '2026-08-20',
      },
      {
        employeeId: createdEmployees[4]._id,
        employeeName: 'David Kim', department: 'Design',
        employeeAvatar: createdEmployees[4].profilePicture,
        leaveType: 'Unpaid Leave', startDate: '2026-07-15', endDate: '2026-07-16', totalDays: 2,
        remarks: 'Extended personal leave for design workshop.', status: 'Approved',
        appliedDate: '2026-07-10', reviewedDate: '2026-07-11',
        reviewedBy: 'admin@dayflow.internal', reviewRemarks: 'Approved as Unpaid Leave.',
      },
    ]);
    console.log('✅ Created 4 leave records');

    // ─── Seed Payroll ──────────────────────────────────────────────────────
    const payrollData = [
      { emp: createdEmployees[0], wage: 85000, paidDays: 22, unpaidDays: 0 },
      { emp: createdEmployees[4], wage: 75000, paidDays: 20, unpaidDays: 2 },
    ];

    for (const { emp, wage, paidDays, unpaidDays } of payrollData) {
      const basic = Math.round(wage * 0.5);
      const hra = Math.round(basic * 0.5);
      const empPF = Math.round(basic * 0.12);
      const netPay = Math.round((wage / 22) * paidDays) - empPF - 200;

      await Payroll.create({
        employeeId: emp._id,
        employeeName: emp.name,
        department: emp.department,
        month: 'July 2026', year: 2026, monthIndex: 6,
        totalWorkingDays: 22, paidDays, unpaidDays, payableDays: paidDays,
        grossMonthlyWage: wage,
        basicSalary: basic, hra, standardAllowance: 4000, performanceBonus: 3000,
        lta: 2000, fixedAllowance: Math.max(0, wage - (basic + hra + 9000)),
        employeePFDeduction: empPF, employerPFContribution: empPF,
        professionalTax: 200, totalDeductions: empPF + 200,
        netPayableAmount: Math.max(0, netPay),
        status: 'Paid', processedDate: '2026-07-31',
      });
    }
    console.log('✅ Created 2 payroll records');

    // ─── Seed Notifications ────────────────────────────────────────────────
    await Notification.insertMany([
      { title: 'New Leave Request Pending Review', message: 'Alex Johnson applied for Sick Leave (28 Aug - 29 Aug, 2 days).', type: 'leave' },
      { title: 'Leave Approved', message: "Marcus Chen's Paid Time Off for today has been approved.", type: 'leave' },
      { title: 'Payroll Calculation Engine Synced', message: 'Payable days updated from attendance & unpaid leave records for August cycle.', type: 'payroll' },
    ]);
    console.log('✅ Created 3 notifications');

    console.log('\n✨ Seed complete! Database is ready.\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Admin Login:    admin@dayflow.internal / admin123');
    console.log('  Employee Login: OIALJO20220001 / employee123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
