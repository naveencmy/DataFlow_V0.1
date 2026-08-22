import bcrypt from 'bcryptjs';
import { pgPool, initializeDatabase } from '../config/db.js';
import { buildDefaultSalaryComponents } from '../shared/utils/salaryEngine.js';
import { logger } from '../config/logger.js';

const today = new Date().toISOString().split('T')[0];

export const INITIAL_USERS = [
  {
    id: 'user-admin',
    loginId: 'admin@dayflow.internal',
    email: 'admin@dayflow.internal',
    role: 'ADMIN',
  },
  {
    id: 'user-emp-1',
    loginId: 'OITKASU0220001',
    email: 'karthik.sundaram@dayflow.internal',
    role: 'EMPLOYEE',
    employeeId: 'emp-1',
  },
  {
    id: 'user-emp-2',
    loginId: 'OITANRA0220002',
    email: 'ananya.ramaswamy@dayflow.internal',
    role: 'EMPLOYEE',
    employeeId: 'emp-2',
  },
  {
    id: 'user-emp-3',
    loginId: 'OITSEMU0220003',
    email: 'senthil.murugan@dayflow.internal',
    role: 'EMPLOYEE',
    employeeId: 'emp-3',
  },
  {
    id: 'user-emp-4',
    loginId: 'OITKABA0220004',
    email: 'kavitha.balasubramanian@dayflow.internal',
    role: 'HR',
    employeeId: 'emp-4',
  },
  {
    id: 'user-emp-5',
    loginId: 'OITDIRA0220005',
    email: 'dinesh.rajendran@dayflow.internal',
    role: 'EMPLOYEE',
    employeeId: 'emp-5',
  },
];

export const INITIAL_EMPLOYEES = [
  {
    id: 'emp-1',
    userId: 'user-emp-1',
    loginId: 'OITKASU0220001',
    name: 'Karthik Sundaram',
    email: 'karthik.sundaram@dayflow.internal',
    mobile: '+91 98401 23456',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces',
    department: 'Engineering',
    jobPosition: 'Lead Frontend Architect',
    manager: 'Kavitha Balasubramanian',
    location: 'Chennai Tech Park, Taramani',
    company: 'Dayflow Technologies Pvt Ltd',
    dateOfJoining: '2022-03-15',
    dateOfBirth: '1992-06-18',
    residentialAddress: 'Flat 4B, Shanthi Niketan Apts, 4th Main Road, Adyar, Chennai, Tamil Nadu 600020',
    nationality: 'Indian',
    personalEmail: 'karthik.sundaram.dev@gmail.com',
    gender: 'Male',
    maritalStatus: 'Single',
    about: 'Passionate UI architect specializing in high-performance web systems, component ergonomical design, and micro-frontend orchestration.',
    whatILoveAboutMyJob: 'Collaborating across multidisciplinary engineering hubs and building friction-free HR tools that elevate daily employee work lives.',
    interestsAndHobbies: 'Carnatic violin, amateur astrophotography, filter coffee brewing, and open source web standards contribution.',
    skills: [
      { id: 'sk-1', name: 'React 19 & TypeScript', level: 'Expert' },
      { id: 'sk-2', name: 'Tailwind CSS & Design Systems', level: 'Expert' },
      { id: 'sk-3', name: 'State Management & Web Performance', level: 'Advanced' },
      { id: 'sk-4', name: 'UI Ergonomics & Web Accessibility (a11y)', level: 'Advanced' },
    ],
    certifications: [
      { id: 'cert-1', name: 'Meta Certified Front-End Developer', issuer: 'Meta / Coursera', issueYear: '2023' },
      { id: 'cert-2', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueYear: '2022' },
    ],
    documents: [
      { id: 'doc-1', title: 'Employment Contract & Offer Letter', fileName: 'Karthik_Sundaram_Employment_Deed.pdf', fileSize: '1.8 MB', uploadDate: '2022-03-15', category: 'Contract' },
      { id: 'doc-2', title: 'Aadhaar & PAN Verification Card', fileName: 'Karthik_ID_Proofs_Combined.pdf', fileSize: '2.4 MB', uploadDate: '2022-03-16', category: 'ID Proof' },
    ],
    bankDetails: {
      accountNumber: '91823746192837',
      bankName: 'Indian Bank',
      ifscCode: 'IDIB000A020',
      panNumber: 'ABCKS1234F',
      uanNumber: '100987654321',
      employeeCode: 'DF-ENG-042',
    },
    salary: {
      wageType: 'Fixed Wage',
      monthlyWage: 85000,
      annualWage: 1020000,
      components: buildDefaultSalaryComponents(85000),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
    },
  },
  {
    id: 'emp-2',
    userId: 'user-emp-2',
    loginId: 'OITANRA0220002',
    name: 'Ananya Ramaswamy',
    email: 'ananya.ramaswamy@dayflow.internal',
    mobile: '+91 94440 98765',
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
    department: 'Human Resources',
    jobPosition: 'People Operations Specialist',
    manager: 'Kavitha Balasubramanian',
    location: 'Chennai Tech Park, Taramani',
    company: 'Dayflow Technologies Pvt Ltd',
    dateOfJoining: '2023-01-10',
    dateOfBirth: '1995-11-24',
    residentialAddress: 'Door No. 12, Sundaram Avenue, RA Puram, Chennai, Tamil Nadu 600028',
    nationality: 'Indian',
    personalEmail: 'ananya.ramaswamy.hr@outlook.com',
    gender: 'Female',
    maritalStatus: 'Married',
    about: 'Dedicated to cultivating an empathetic, high-trust workplace culture and building seamless onboarding journeys for every team member.',
    whatILoveAboutMyJob: 'Fostering genuine career growth, listening to team needs, and making every new joiner feel welcomed from day one.',
    interestsAndHobbies: 'Bharatanatyam, weekend pottery workshops, marathon running along Marina Beach, and reading historical Tamil literature.',
    skills: [
      { id: 'sk-5', name: 'Talent Acquisition & Global Onboarding', level: 'Expert' },
      { id: 'sk-6', name: 'Indian Payroll Compliance & Labor Law', level: 'Advanced' },
      { id: 'sk-7', name: 'Employee Engagement & Culture Strategy', level: 'Advanced' },
    ],
    certifications: [
      { id: 'cert-3', name: 'SHRM Certified Professional (SHRM-CP)', issuer: 'SHRM', issueYear: '2023' },
    ],
    documents: [
      { id: 'doc-3', title: 'HR Specialist Offer Letter', fileName: 'Ananya_Ramaswamy_Offer.pdf', fileSize: '1.2 MB', uploadDate: '2023-01-10', category: 'Contract' },
    ],
    bankDetails: {
      accountNumber: '44556677889900',
      bankName: 'Canara Bank',
      ifscCode: 'CNRB0000456',
      panNumber: 'PQRAR5678G',
      uanNumber: '100876543210',
      employeeCode: 'DF-HR-019',
    },
    salary: {
      wageType: 'Fixed Wage',
      monthlyWage: 65000,
      annualWage: 780000,
      components: buildDefaultSalaryComponents(65000),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
    },
  },
  {
    id: 'emp-3',
    userId: 'user-emp-3',
    loginId: 'OITSEMU0220003',
    name: 'Senthil Murugan',
    email: 'senthil.murugan@dayflow.internal',
    mobile: '+91 98940 55443',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
    department: 'Product',
    jobPosition: 'Senior Product Manager',
    manager: 'Kavitha Balasubramanian',
    location: 'Coimbatore Innovation Hub',
    company: 'Dayflow Technologies Pvt Ltd',
    dateOfJoining: '2021-08-01',
    dateOfBirth: '1989-03-12',
    residentialAddress: 'Villa 18, Green Meadows, Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004',
    nationality: 'Indian',
    personalEmail: 'senthil.murugan.pm@gmail.com',
    gender: 'Male',
    maritalStatus: 'Married',
    about: 'Product strategist bridging deep user empathy with data-driven roadmapping and metric execution across workforce software.',
    whatILoveAboutMyJob: 'Transforming complex administrative friction into intuitive, delightfully simple software interactions.',
    interestsAndHobbies: 'Trekking in Nilgiris, chess strategy, landscape photography, and temple architecture documentation.',
    skills: [
      { id: 'sk-8', name: 'Product Roadmapping & Enterprise OKRs', level: 'Expert' },
      { id: 'sk-9', name: 'User Journey Mapping & PRD Architecture', level: 'Expert' },
      { id: 'sk-10', name: 'A/B Testing & Metrics Analytics', level: 'Advanced' },
    ],
    certifications: [
      { id: 'cert-4', name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', issueYear: '2021' },
    ],
    documents: [
      { id: 'doc-4', title: 'Product Director NDA & Agreement', fileName: 'Senthil_Murugan_Agreement.pdf', fileSize: '2.1 MB', uploadDate: '2021-08-01', category: 'Contract' },
    ],
    bankDetails: {
      accountNumber: '11223344556677',
      bankName: 'HDFC Bank Ltd',
      ifscCode: 'HDFC0000789',
      panNumber: 'LMNSM9012K',
      uanNumber: '100765432109',
      employeeCode: 'DF-PRD-007',
    },
    salary: {
      wageType: 'Fixed Wage',
      monthlyWage: 120000,
      annualWage: 1440000,
      components: buildDefaultSalaryComponents(120000),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
    },
  },
  {
    id: 'emp-4',
    userId: 'user-emp-4',
    loginId: 'OITKABA0220004',
    name: 'Kavitha Balasubramanian',
    email: 'kavitha.balasubramanian@dayflow.internal',
    mobile: '+91 98410 77889',
    profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces',
    department: 'Management',
    jobPosition: 'VP of Engineering & HR',
    manager: 'Board of Directors',
    location: 'Chennai Tech Park, Taramani',
    company: 'Dayflow Technologies Pvt Ltd',
    dateOfJoining: '2020-01-05',
    dateOfBirth: '1985-09-03',
    residentialAddress: 'Penthouse 7, Horizon Tower, OMR Expressway, Thoraipakkam, Chennai, Tamil Nadu 600097',
    nationality: 'Indian',
    personalEmail: 'kavitha.balasubramanian.exec@gmail.com',
    gender: 'Female',
    maritalStatus: 'Married',
    about: 'Executive leader passionate about scaling high-velocity engineering organizations with balanced human-centered values and robust governance.',
    whatILoveAboutMyJob: 'Empowering smart leaders to do the best work of their lives while maintaining culture, balance, and operational excellence.',
    interestsAndHobbies: 'Marathon training along ECR, classical Veena recital, angel mentorship for women in tech, and rooftop gardening.',
    skills: [
      { id: 'sk-11', name: 'Organizational Leadership & Scaling', level: 'Expert' },
      { id: 'sk-12', name: 'Cloud Architecture & Enterprise Security', level: 'Expert' },
      { id: 'sk-13', name: 'Strategic Budgeting & Payroll Planning', level: 'Expert' },
    ],
    certifications: [
      { id: 'cert-5', name: 'Executive Leadership Certification', issuer: 'IIM Bangalore / Stanford GSB', issueYear: '2020' },
    ],
    documents: [
      { id: 'doc-5', title: 'Executive Employment Deed', fileName: 'Kavitha_Balasubramanian_Deed.pdf', fileSize: '3.4 MB', uploadDate: '2020-01-05', category: 'Contract' },
    ],
    bankDetails: {
      accountNumber: '99887766554433',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0001999',
      panNumber: 'WXYKB9876Q',
      uanNumber: '100654321098',
      employeeCode: 'DF-EXE-001',
    },
    salary: {
      wageType: 'Fixed Wage',
      monthlyWage: 180000,
      annualWage: 2160000,
      components: buildDefaultSalaryComponents(180000),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
    },
  },
  {
    id: 'emp-5',
    userId: 'user-emp-5',
    loginId: 'OITDIRA0220005',
    name: 'Dinesh Rajendran',
    email: 'dinesh.rajendran@dayflow.internal',
    mobile: '+91 97900 11223',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces',
    department: 'Design',
    jobPosition: 'Principal UX Designer',
    manager: 'Senthil Murugan',
    location: 'Madurai Digital Campus',
    company: 'Dayflow Technologies Pvt Ltd',
    dateOfJoining: '2022-10-01',
    dateOfBirth: '1993-04-20',
    residentialAddress: 'Door No. 24, Meenakshi Nagar, KK Nagar, Madurai, Tamil Nadu 625020',
    nationality: 'Indian',
    personalEmail: 'dinesh.rajendran.design@gmail.com',
    gender: 'Male',
    maritalStatus: 'Single',
    about: 'Design systems fanatic, obsessed with typography, micro-interactions, neo-pastel design language, and high-density enterprise software UX.',
    whatILoveAboutMyJob: 'Crafting clean, peaceful software interfaces that save thousands of hours of tedious administrative toil.',
    interestsAndHobbies: 'Tamil typography & calligraphy, urban sketching, mechanical keyboard modding, and traditional tea ceremonies.',
    skills: [
      { id: 'sk-14', name: 'Design Systems & Multi-Brand Tokens', level: 'Expert' },
      { id: 'sk-15', name: 'Figma Prototyping & Motion Design', level: 'Expert' },
      { id: 'sk-16', name: 'User Research & Heuristic Evaluation', level: 'Advanced' },
    ],
    certifications: [
      { id: 'cert-6', name: 'Nielsen Norman Group UX Master Certified', issuer: 'NN/g', issueYear: '2022' },
    ],
    documents: [
      { id: 'doc-6', title: 'Design Employment Contract', fileName: 'Dinesh_Rajendran_Contract.pdf', fileSize: '1.5 MB', uploadDate: '2022-10-01', category: 'Contract' },
    ],
    bankDetails: {
      accountNumber: '33445566778899',
      bankName: 'ICICI Bank Ltd',
      ifscCode: 'ICIC0000234',
      panNumber: 'KIMDR4321R',
      uanNumber: '100543210987',
      employeeCode: 'DF-DES-014',
    },
    salary: {
      wageType: 'Fixed Wage',
      monthlyWage: 75000,
      annualWage: 900000,
      components: buildDefaultSalaryComponents(75000),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
    },
  },
];

export const INITIAL_LEAVES = [
  {
    id: 'leave-1',
    employeeId: 'emp-3',
    leaveType: 'Paid Time Off',
    startDate: today,
    endDate: today,
    totalDays: 1,
    remarks: 'Attending annual family temple festival in Madurai.',
    attachmentFileName: 'festival_invitation.pdf',
    status: 'Approved',
    appliedDate: '2026-08-18',
    reviewedDate: '2026-08-19',
    reviewedBy: 'Kavitha Balasubramanian (HR)',
    reviewRemarks: 'Approved. Have a great time with family!',
  },
  {
    id: 'leave-2',
    employeeId: 'emp-1',
    leaveType: 'Sick Leave',
    startDate: '2026-08-28',
    endDate: '2026-08-29',
    totalDays: 2,
    remarks: 'Scheduled outpatient dental consultation and recovery.',
    attachmentFileName: 'dental_clinic_receipt.pdf',
    status: 'Pending',
    appliedDate: '2026-08-21',
  },
  {
    id: 'leave-3',
    employeeId: 'emp-2',
    leaveType: 'Paid Time Off',
    startDate: '2026-09-05',
    endDate: '2026-09-08',
    totalDays: 4,
    remarks: 'Attending National HR Tech Leadership Summit in Hyderabad.',
    attachmentFileName: 'conference_ticket.pdf',
    status: 'Pending',
    appliedDate: '2026-08-20',
  },
  {
    id: 'leave-4',
    employeeId: 'emp-5',
    leaveType: 'Unpaid Leave',
    startDate: '2026-07-15',
    endDate: '2026-07-16',
    totalDays: 2,
    remarks: 'Extended personal leave for Design Typography Biennale in Kochi.',
    status: 'Approved',
    appliedDate: '2026-07-10',
    reviewedDate: '2026-07-11',
    reviewedBy: 'Kavitha Balasubramanian (HR)',
    reviewRemarks: 'Approved as Unpaid Leave. 2 days deducted from payable days for July cycle.',
  },
  {
    id: 'leave-5',
    employeeId: 'emp-1',
    leaveType: 'Paid Time Off',
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    totalDays: 3,
    remarks: 'Summer vacation trip to Ooty & Coonoor hills.',
    status: 'Approved',
    appliedDate: '2026-06-01',
    reviewedDate: '2026-06-02',
    reviewedBy: 'Kavitha Balasubramanian (HR)',
    reviewRemarks: 'Approved. Enjoy your holiday!',
  },
];

export const INITIAL_PAYROLL = [
  {
    id: 'pay-2026-07-emp-1',
    employeeId: 'emp-1',
    month: 'July 2026',
    year: 2026,
    monthIndex: 6,
    totalWorkingDays: 22,
    paidDays: 22,
    unpaidDays: 0,
    payableDays: 22,
    grossMonthlyWage: 85000,
    basicSalary: 42500,
    hra: 21250,
    standardAllowance: 4000,
    performanceBonus: 3000,
    lta: 2000,
    fixedAllowance: 12250,
    employeePFDeduction: 5100,
    employerPFContribution: 5100,
    professionalTax: 200,
    totalDeductions: 5300,
    netPayableAmount: 79700,
    status: 'Paid',
    processedDate: '2026-07-31',
  },
  {
    id: 'pay-2026-07-emp-5',
    employeeId: 'emp-5',
    month: 'July 2026',
    year: 2026,
    monthIndex: 6,
    totalWorkingDays: 22,
    paidDays: 20,
    unpaidDays: 2,
    payableDays: 20,
    grossMonthlyWage: 75000,
    basicSalary: 37500,
    hra: 18750,
    standardAllowance: 4000,
    performanceBonus: 3000,
    lta: 2000,
    fixedAllowance: 9750,
    employeePFDeduction: 4500,
    employerPFContribution: 4500,
    professionalTax: 200,
    totalDeductions: 4700,
    netPayableAmount: 63482,
    status: 'Paid',
    processedDate: '2026-07-31',
  },
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New Leave Request Pending Review',
    message: 'Karthik Sundaram applied for Sick Leave (28 Aug - 29 Aug, 2 days).',
    type: 'leave',
    read: false,
    employeeId: 'emp-1',
  },
  {
    id: 'notif-2',
    title: 'Leave Approved',
    message: "Senthil Murugan's Paid Time Off for today has been approved by Kavitha Balasubramanian.",
    type: 'leave',
    read: false,
    employeeId: 'emp-3',
  },
  {
    id: 'notif-3',
    title: 'Payroll Calculation Engine Synced',
    message: 'Payable days updated from attendance & unpaid leave records for August cycle.',
    type: 'payroll',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'On-Time Check-In Recorded',
    message: 'Your check-in at 08:55 AM was successfully recorded. Status: Present 🟢.',
    type: 'attendance',
    read: true,
    employeeId: 'emp-1',
  },
];

export async function seed() {
  await initializeDatabase();
  const client = await pgPool.connect();

  try {
    logger.info('🌱 Seeding Dayflow HRMS PostgreSQL Database with Indian Tamil records...');
    await client.query('BEGIN');

    // Default passwords for demo accounts
    const salt = await bcrypt.genSalt(12);
    const defaultPasswordHash = await bcrypt.hash('Dayflow@123', salt);

    // 1. Seed Users
    for (const u of INITIAL_USERS) {
      await client.query(
        `
        INSERT INTO "User" ("id", "email", "loginId", "passwordHash", "role", "isEmailVerified")
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT ("id") DO UPDATE SET
          "email" = EXCLUDED."email",
          "loginId" = EXCLUDED."loginId",
          "role" = EXCLUDED."role",
          "passwordHash" = EXCLUDED."passwordHash"
      `,
        [u.id, u.email, u.loginId, defaultPasswordHash, u.role, true]
      );
    }

    // 2. Seed Employees
    for (const emp of INITIAL_EMPLOYEES) {
      await client.query(
        `
        INSERT INTO "Employee" (
          "id", "userId", "loginId", "name", "email", "mobile", "profilePicture",
          "department", "jobPosition", "manager", "location", "company",
          "dateOfJoining", "dateOfBirth", "residentialAddress", "nationality",
          "personalEmail", "gender", "maritalStatus", "about", "whatILoveAboutMyJob",
          "interestsAndHobbies", "skills", "certifications", "documents", "bankDetails", "salary"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
        ON CONFLICT ("id") DO UPDATE SET
          "name" = EXCLUDED."name",
          "email" = EXCLUDED."email",
          "mobile" = EXCLUDED."mobile",
          "profilePicture" = EXCLUDED."profilePicture",
          "department" = EXCLUDED."department",
          "jobPosition" = EXCLUDED."jobPosition",
          "manager" = EXCLUDED."manager",
          "location" = EXCLUDED."location",
          "residentialAddress" = EXCLUDED."residentialAddress",
          "about" = EXCLUDED."about",
          "whatILoveAboutMyJob" = EXCLUDED."whatILoveAboutMyJob",
          "interestsAndHobbies" = EXCLUDED."interestsAndHobbies",
          "salary" = EXCLUDED."salary",
          "skills" = EXCLUDED."skills",
          "certifications" = EXCLUDED."certifications",
          "documents" = EXCLUDED."documents",
          "bankDetails" = EXCLUDED."bankDetails"
      `,
        [
          emp.id,
          emp.userId,
          emp.loginId,
          emp.name,
          emp.email,
          emp.mobile,
          emp.profilePicture,
          emp.department,
          emp.jobPosition,
          emp.manager,
          emp.location,
          emp.company,
          emp.dateOfJoining,
          emp.dateOfBirth,
          emp.residentialAddress,
          emp.nationality,
          emp.personalEmail,
          emp.gender,
          emp.maritalStatus,
          emp.about,
          emp.whatILoveAboutMyJob,
          emp.interestsAndHobbies,
          JSON.stringify(emp.skills),
          JSON.stringify(emp.certifications),
          JSON.stringify(emp.documents),
          JSON.stringify(emp.bankDetails),
          JSON.stringify(emp.salary),
        ]
      );
    }

    // 3. Seed Today's Attendance
    const todayAtt = [
      { id: 'att-today-emp-1', employeeId: 'emp-1', date: today, checkIn: '08:55 AM', checkOut: null, workHours: 7.2, extraHours: 0, status: 'Present' },
      { id: 'att-today-emp-2', employeeId: 'emp-2', date: today, checkIn: '09:15 AM', checkOut: '06:30 PM', workHours: 9.25, extraHours: 1.25, status: 'Present' },
      { id: 'att-today-emp-4', employeeId: 'emp-4', date: today, checkIn: '08:30 AM', checkOut: null, workHours: 7.6, extraHours: 0, status: 'Present' },
    ];

    for (const a of todayAtt) {
      await client.query(
        `
        INSERT INTO "Attendance" ("id", "employeeId", "date", "checkInTime", "checkOutTime", "workHours", "extraHours", "status")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT ("employeeId", "date") DO UPDATE SET
          "checkInTime" = EXCLUDED."checkInTime",
          "checkOutTime" = EXCLUDED."checkOutTime",
          "workHours" = EXCLUDED."workHours"
      `,
        [a.id, a.employeeId, a.date, a.checkIn, a.checkOut, a.workHours, a.extraHours, a.status]
      );
    }

    // Past 10 workdays
    for (let i = 1; i <= 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      const dateStr = d.toISOString().split('T')[0];

      for (const emp of INITIAL_EMPLOYEES) {
        if (emp.id === 'emp-3' && i === 1) continue; // leave day
        const attId = `att-past-${emp.id}-${dateStr}`;
        await client.query(
          `
          INSERT INTO "Attendance" ("id", "employeeId", "date", "checkInTime", "checkOutTime", "workHours", "extraHours", "status", "notes")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT ("employeeId", "date") DO UPDATE SET
            "status" = EXCLUDED."status",
            "workHours" = EXCLUDED."workHours"
        `,
          [attId, emp.id, dateStr, '09:05 AM', '06:15 PM', 8.2, 0.2, 'Present', 'Regular workday']
        );
      }
    }

    // 4. Seed Leaves
    for (const l of INITIAL_LEAVES) {
      await client.query(
        `
        INSERT INTO "LeaveRequest" (
          "id", "employeeId", "leaveType", "startDate", "endDate",
          "totalDays", "remarks", "attachmentFileName", "status",
          "appliedDate", "reviewedDate", "reviewedBy", "reviewRemarks"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT ("id") DO UPDATE SET
          "status" = EXCLUDED."status",
          "reviewedBy" = EXCLUDED."reviewedBy",
          "reviewRemarks" = EXCLUDED."reviewRemarks"
      `,
        [
          l.id,
          l.employeeId,
          l.leaveType,
          l.startDate,
          l.endDate,
          l.totalDays,
          l.remarks,
          l.attachmentFileName || null,
          l.status,
          l.appliedDate,
          l.reviewedDate || null,
          l.reviewedBy || null,
          l.reviewRemarks || null,
        ]
      );
    }

    // 5. Seed Payroll Runs
    for (const p of INITIAL_PAYROLL) {
      await client.query(
        `
        INSERT INTO "PayrollRun" (
          "id", "employeeId", "month", "year", "monthIndex",
          "totalWorkingDays", "paidDays", "unpaidDays", "payableDays",
          "grossMonthlyWage", "basicSalary", "hra", "standardAllowance",
          "performanceBonus", "lta", "fixedAllowance",
          "employeePFDeduction", "employerPFContribution", "professionalTax",
          "totalDeductions", "netPayableAmount", "status", "processedDate"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        ON CONFLICT ("employeeId", "month", "year") DO UPDATE SET
          "netPayableAmount" = EXCLUDED."netPayableAmount",
          "status" = EXCLUDED."status"
      `,
        [
          p.id,
          p.employeeId,
          p.month,
          p.year,
          p.monthIndex,
          p.totalWorkingDays,
          p.paidDays,
          p.unpaidDays,
          p.payableDays,
          p.grossMonthlyWage,
          p.basicSalary,
          p.hra,
          p.standardAllowance,
          p.performanceBonus,
          p.lta,
          p.fixedAllowance,
          p.employeePFDeduction,
          p.employerPFContribution,
          p.professionalTax,
          p.totalDeductions,
          p.netPayableAmount,
          p.status,
          p.processedDate,
        ]
      );
    }

    // 6. Seed Notifications
    for (const n of INITIAL_NOTIFICATIONS) {
      await client.query(
        `
        INSERT INTO "Notification" ("id", "employeeId", "title", "message", "type", "read")
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT ("id") DO UPDATE SET
          "title" = EXCLUDED."title",
          "message" = EXCLUDED."message"
      `,
        [n.id, n.employeeId || null, n.title, n.message, n.type, n.read]
      );
    }

    await client.query('COMMIT');
    logger.info('🎉 Database seeded successfully with Indian Tamil named employees, attendance, leaves, payroll & notifications!');
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error({ err }, '❌ Database seeding failed');
    throw err;
  } finally {
    client.release();
  }
}

if (process.argv[1]?.includes('seed.js')) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seed;
