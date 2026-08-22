import bcrypt from 'bcryptjs';
import { pgPool, initializeDatabase } from '../config/db.js';
import { buildDefaultSalaryComponents } from '../shared/utils/salaryEngine.js';
import { logger } from '../config/logger.js';

const today = new Date().toISOString().split('T')[0];

export const ALL_USERS = [
  { id: 'user-admin', loginId: 'admin@dayflow.internal', email: 'admin@dayflow.internal', role: 'ADMIN' },
  { id: 'user-emp-1', loginId: 'OITKASU0220001', email: 'karthik.sundaram@dayflow.internal', role: 'EMPLOYEE', employeeId: 'emp-1' },
  { id: 'user-emp-2', loginId: 'OITANRA0220002', email: 'ananya.ramaswamy@dayflow.internal', role: 'EMPLOYEE', employeeId: 'emp-2' },
  { id: 'user-emp-3', loginId: 'OITSEMU0220003', email: 'senthil.murugan@dayflow.internal', role: 'EMPLOYEE', employeeId: 'emp-3' },
  { id: 'user-emp-4', loginId: 'OITKABA0220004', email: 'kavitha.balasubramanian@dayflow.internal', role: 'HR', employeeId: 'emp-4' },
  { id: 'user-emp-5', loginId: 'OITDIRA0220005', email: 'dinesh.rajendran@dayflow.internal', role: 'EMPLOYEE', employeeId: 'emp-5' },
  { id: 'user-emp-6', loginId: 'OITMELO0220006', email: 'meenakshi.loganathan@dayflow.internal', role: 'EMPLOYEE', employeeId: 'emp-6' },
  { id: 'user-emp-7', loginId: 'OITVINA0220007', email: 'vignesh.natarajan@dayflow.internal', role: 'EMPLOYEE', employeeId: 'emp-7' },
  { id: 'user-emp-8', loginId: 'OITPRAK0220008', email: 'praveen.kumar@dayflow.internal', role: 'EMPLOYEE', employeeId: 'emp-8' },
  { id: 'user-emp-9', loginId: 'OITSHRA0220009', email: 'shruthi.radhakrishnan@dayflow.internal', role: 'EMPLOYEE', employeeId: 'emp-9' },
  { id: 'user-emp-10', loginId: 'OITARVE0220010', email: 'aravind.venkatesh@dayflow.internal', role: 'EMPLOYEE', employeeId: 'emp-10' },
];

export const ALL_EMPLOYEES = [
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
    company: 'Dayflow Technologies India Pvt Ltd',
    dateOfJoining: '2022-03-15',
    dateOfBirth: '1992-06-18',
    residentialAddress: 'Flat 4B, Shanthi Niketan Apts, 4th Main Road, Adyar, Chennai, Tamil Nadu 600020',
    nationality: 'Indian',
    personalEmail: 'karthik.sundaram.dev@gmail.com',
    gender: 'Male',
    maritalStatus: 'Single',
    about: 'Passionate UI architect obsessed with reactive state ergonomics, micro-frontend performance, and accessible web systems.',
    whatILoveAboutMyJob: 'Designing fluid, beautiful user experiences that remove friction from thousands of workdays.',
    interestsAndHobbies: 'Carnatic classical violin, filter coffee brewing, cycling along Marina Beach, and OSS contribution.',
    skills: [
      { id: 'sk-1', name: 'React 19 & TypeScript', level: 'Expert' },
      { id: 'sk-2', name: 'Tailwind CSS & Design Systems', level: 'Expert' },
      { id: 'sk-3', name: 'Web Performance Optimization', level: 'Advanced' },
      { id: 'sk-4', name: 'Accessibility (WCAG & a11y)', level: 'Advanced' },
    ],
    certifications: [
      { id: 'cert-1', name: 'Meta Certified Front-End Developer', issuer: 'Meta / Coursera', issueYear: '2023' },
      { id: 'cert-2', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', issueYear: '2022' },
    ],
    documents: [
      { id: 'doc-1', title: 'Employment Offer Letter', fileName: 'Karthik_Sundaram_Employment_Deed.pdf', fileSize: '1.8 MB', uploadDate: '2022-03-15', category: 'Contract' },
      { id: 'doc-2', title: 'Aadhaar & PAN Verification Card', fileName: 'Karthik_ID_Proofs.pdf', fileSize: '2.4 MB', uploadDate: '2022-03-16', category: 'ID Proof' },
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
    company: 'Dayflow Technologies India Pvt Ltd',
    dateOfJoining: '2023-01-10',
    dateOfBirth: '1995-11-24',
    residentialAddress: 'Door No. 12, Sundaram Avenue, RA Puram, Chennai, Tamil Nadu 600028',
    nationality: 'Indian',
    personalEmail: 'ananya.ramaswamy.hr@outlook.com',
    gender: 'Female',
    maritalStatus: 'Married',
    about: 'Dedicated to cultivating an inclusive, high-trust workplace culture and building friction-free onboarding experiences.',
    whatILoveAboutMyJob: 'Fostering genuine career growth, listening to team needs, and making every employee feel valued from day one.',
    interestsAndHobbies: 'Bharatanatyam, weekend pottery workshops, marathon running, and reading historical Tamil fiction.',
    skills: [
      { id: 'sk-5', name: 'Talent Acquisition & Onboarding', level: 'Expert' },
      { id: 'sk-6', name: 'Payroll Compliance & Indian Labor Law', level: 'Advanced' },
      { id: 'sk-7', name: 'Employee Engagement Strategy', level: 'Advanced' },
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
    company: 'Dayflow Technologies India Pvt Ltd',
    dateOfJoining: '2021-08-01',
    dateOfBirth: '1989-03-12',
    residentialAddress: 'Villa 18, Green Meadows, Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004',
    nationality: 'Indian',
    personalEmail: 'senthil.murugan.pm@gmail.com',
    gender: 'Male',
    maritalStatus: 'Married',
    about: 'Product strategist bridging deep user empathy with data-driven roadmapping and metric execution.',
    whatILoveAboutMyJob: 'Transforming ambiguous workplace friction into seamless, high-retention software experiences.',
    interestsAndHobbies: 'Trekking in Nilgiris, chess strategy, landscape photography, and temple architecture documentation.',
    skills: [
      { id: 'sk-8', name: 'Product Roadmapping & OKRs', level: 'Expert' },
      { id: 'sk-9', name: 'User Journey Mapping & Specs', level: 'Expert' },
      { id: 'sk-10', name: 'A/B Testing & Analytics', level: 'Advanced' },
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
    company: 'Dayflow Technologies India Pvt Ltd',
    dateOfJoining: '2020-01-05',
    dateOfBirth: '1985-09-03',
    residentialAddress: 'Penthouse 7, Horizon Tower, OMR Expressway, Thoraipakkam, Chennai, Tamil Nadu 600097',
    nationality: 'Indian',
    personalEmail: 'kavitha.balasubramanian.exec@gmail.com',
    gender: 'Female',
    maritalStatus: 'Married',
    about: 'Executive leader passionate about scaling high-velocity engineering organizations with balanced human-centered values.',
    whatILoveAboutMyJob: 'Empowering smart leaders to do the best work of their lives while maintaining balance.',
    interestsAndHobbies: 'Marathon training along ECR, classical Veena recital, angel investing, and mentorship.',
    skills: [
      { id: 'sk-11', name: 'Organizational Leadership', level: 'Expert' },
      { id: 'sk-12', name: 'System Architecture & Scale', level: 'Expert' },
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
    company: 'Dayflow Technologies India Pvt Ltd',
    dateOfJoining: '2022-10-01',
    dateOfBirth: '1993-04-20',
    residentialAddress: 'Door No. 24, Meenakshi Nagar, KK Nagar, Madurai, Tamil Nadu 625020',
    nationality: 'Indian',
    personalEmail: 'dinesh.rajendran.design@gmail.com',
    gender: 'Male',
    maritalStatus: 'Single',
    about: 'Design systems fanatic, obsessed with typography, micro-interactions, neo-pastel design language, and high-density enterprise software UX.',
    whatILoveAboutMyJob: 'Crafting clean, peaceful software interfaces that save people hours of tedious administrative toil.',
    interestsAndHobbies: 'Tamil typography & calligraphy, urban sketching, mechanical keyboards, and tea ceremonies.',
    skills: [
      { id: 'sk-14', name: 'Design Systems & Tokens', level: 'Expert' },
      { id: 'sk-15', name: 'Figma & Interactive Prototyping', level: 'Expert' },
      { id: 'sk-16', name: 'User Testing & Heuristic Evaluation', level: 'Advanced' },
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
  {
    id: 'emp-6',
    userId: 'user-emp-6',
    loginId: 'OITMELO0220006',
    name: 'Meenakshi Loganathan',
    email: 'meenakshi.loganathan@dayflow.internal',
    mobile: '+91 97100 44556',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces',
    department: 'Finance & Accounts',
    jobPosition: 'Senior Payroll & Tax Lead',
    manager: 'Kavitha Balasubramanian',
    location: 'Chennai Tech Park, Taramani',
    company: 'Dayflow Technologies India Pvt Ltd',
    dateOfJoining: '2022-01-15',
    dateOfBirth: '1991-08-14',
    residentialAddress: 'Door 15, Karpagam Gardens, Besant Nagar, Chennai 600090',
    nationality: 'Indian',
    personalEmail: 'meenakshi.fin@gmail.com',
    gender: 'Female',
    maritalStatus: 'Married',
    about: 'Certified Indian tax specialist overseeing statutory PF, ESI, gratuity compliance, and automated payroll balancing.',
    whatILoveAboutMyJob: 'Ensuring 100% on-time and accurate payroll distribution for every employee.',
    interestsAndHobbies: 'South Indian cuisine, classical singing, and financial literacy blogging.',
    skills: [
      { id: 'sk-17', name: 'Indian Corporate Taxation & TDS', level: 'Expert' },
      { id: 'sk-18', name: 'Payroll Auditing & Compliance', level: 'Expert' },
      { id: 'sk-19', name: 'Statutory Benefit Planning', level: 'Advanced' },
    ],
    certifications: [
      { id: 'cert-7', name: 'Chartered Financial Analyst (CFA)', issuer: 'CFA Institute', issueYear: '2021' },
    ],
    documents: [
      { id: 'doc-7', title: 'Finance Lead Contract', fileName: 'Meenakshi_Contract.pdf', fileSize: '1.4 MB', uploadDate: '2022-01-15', category: 'Contract' },
    ],
    bankDetails: {
      accountNumber: '55667788990011',
      bankName: 'Axis Bank Ltd',
      ifscCode: 'UTIB0001234',
      panNumber: 'MELOG1234P',
      uanNumber: '100456789012',
      employeeCode: 'DF-FIN-022',
    },
    salary: {
      wageType: 'Fixed Wage',
      monthlyWage: 95000,
      annualWage: 1140000,
      components: buildDefaultSalaryComponents(95000),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
    },
  },
  {
    id: 'emp-7',
    userId: 'user-emp-7',
    loginId: 'OITVINA0220007',
    name: 'Vignesh Natarajan',
    email: 'vignesh.natarajan@dayflow.internal',
    mobile: '+91 98840 33221',
    profilePicture: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop&crop=faces',
    department: 'Engineering',
    jobPosition: 'Senior DevOps & Cloud Architect',
    manager: 'Karthik Sundaram',
    location: 'Chennai Tech Park, Taramani',
    company: 'Dayflow Technologies India Pvt Ltd',
    dateOfJoining: '2022-05-20',
    dateOfBirth: '1990-12-05',
    residentialAddress: '#301, Emerald Apts, Velachery Main Road, Chennai 600042',
    nationality: 'Indian',
    personalEmail: 'vignesh.natarajan.devops@gmail.com',
    gender: 'Male',
    maritalStatus: 'Married',
    about: 'Kubernetes and cloud infrastructure specialist building automated zero-downtime CI/CD deployment pipelines.',
    whatILoveAboutMyJob: 'Designing bulletproof cloud reliability and lightning-fast developer toolchains.',
    interestsAndHobbies: 'Homelab networking, cricket analytics, and long-distance motorcycling.',
    skills: [
      { id: 'sk-20', name: 'Docker & Kubernetes (K8s)', level: 'Expert' },
      { id: 'sk-21', name: 'Terraform & Infrastructure as Code', level: 'Expert' },
      { id: 'sk-22', name: 'PostgreSQL HA & Performance Tuning', level: 'Advanced' },
    ],
    certifications: [
      { id: 'cert-8', name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Linux Foundation', issueYear: '2022' },
    ],
    documents: [
      { id: 'doc-8', title: 'DevOps Lead Agreement', fileName: 'Vignesh_Agreement.pdf', fileSize: '1.9 MB', uploadDate: '2022-05-20', category: 'Contract' },
    ],
    bankDetails: {
      accountNumber: '66778899001122',
      bankName: 'HDFC Bank Ltd',
      ifscCode: 'HDFC0000456',
      panNumber: 'VINAT5678Q',
      uanNumber: '100345678901',
      employeeCode: 'DF-OPS-031',
    },
    salary: {
      wageType: 'Fixed Wage',
      monthlyWage: 110000,
      annualWage: 1320000,
      components: buildDefaultSalaryComponents(110000),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
    },
  },
  {
    id: 'emp-8',
    userId: 'user-emp-8',
    loginId: 'OITPRAK0220008',
    name: 'Praveen Kumar',
    email: 'praveen.kumar@dayflow.internal',
    mobile: '+91 97890 88776',
    profilePicture: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=faces',
    department: 'Engineering',
    jobPosition: 'Senior Backend Engineer',
    manager: 'Karthik Sundaram',
    location: 'Tiruchirappalli Campus',
    company: 'Dayflow Technologies India Pvt Ltd',
    dateOfJoining: '2023-04-01',
    dateOfBirth: '1994-02-28',
    residentialAddress: 'Door 8, Cauvery Nagar, Thillai Nagar, Trichy 620018',
    nationality: 'Indian',
    personalEmail: 'praveen.kumar.backend@gmail.com',
    gender: 'Male',
    maritalStatus: 'Single',
    about: 'Node.js, PostgreSQL, and distributed messaging engineer focusing on real-time event architectures.',
    whatILoveAboutMyJob: 'Writing clean, test-driven REST APIs that handle millions of transactions securely.',
    interestsAndHobbies: 'Badminton, PC gaming, and reading tech architecture books.',
    skills: [
      { id: 'sk-23', name: 'Node.js, Express & TypeScript', level: 'Expert' },
      { id: 'sk-24', name: 'PostgreSQL Relational Design', level: 'Expert' },
      { id: 'sk-25', name: 'Redis Caching & Message Queues', level: 'Advanced' },
    ],
    certifications: [
      { id: 'cert-9', name: 'AWS Certified Developer Associate', issuer: 'AWS', issueYear: '2023' },
    ],
    documents: [
      { id: 'doc-9', title: 'Backend Engineer Appointment Deed', fileName: 'Praveen_Appointment.pdf', fileSize: '1.6 MB', uploadDate: '2023-04-01', category: 'Contract' },
    ],
    bankDetails: {
      accountNumber: '77889900112233',
      bankName: 'Kotak Mahindra Bank',
      ifscCode: 'KKBK0000789',
      panNumber: 'PRAVK9012R',
      uanNumber: '100234567890',
      employeeCode: 'DF-ENG-058',
    },
    salary: {
      wageType: 'Fixed Wage',
      monthlyWage: 80000,
      annualWage: 960000,
      components: buildDefaultSalaryComponents(80000),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
    },
  },
  {
    id: 'emp-9',
    userId: 'user-emp-9',
    loginId: 'OITSHRA0220009',
    name: 'Shruthi Radhakrishnan',
    email: 'shruthi.radhakrishnan@dayflow.internal',
    mobile: '+91 94450 66778',
    profilePicture: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&h=300&fit=crop&crop=faces',
    department: 'Marketing',
    jobPosition: 'Lead Growth & Brand Strategist',
    manager: 'Kavitha Balasubramanian',
    location: 'Chennai Tech Park, Taramani',
    company: 'Dayflow Technologies India Pvt Ltd',
    dateOfJoining: '2023-02-15',
    dateOfBirth: '1996-05-19',
    residentialAddress: 'Door 45, Sterling Road, Nungambakkam, Chennai 600034',
    nationality: 'Indian',
    personalEmail: 'shruthi.radha.mkt@gmail.com',
    gender: 'Female',
    maritalStatus: 'Single',
    about: 'B2B SaaS growth marketer passionate about product-led growth, organic search, and storytelling.',
    whatILoveAboutMyJob: 'Showcasing our products and connecting with HR leaders across the world.',
    interestsAndHobbies: 'Creative writing, classical Bharatanatyam, and podcasting.',
    skills: [
      { id: 'sk-26', name: 'Product Marketing & Positioning', level: 'Expert' },
      { id: 'sk-27', name: 'Content Strategy & SEO', level: 'Expert' },
      { id: 'sk-28', name: 'B2B Lead Generation Funnels', level: 'Advanced' },
    ],
    certifications: [
      { id: 'cert-10', name: 'HubSpot Inbound Marketing Certified', issuer: 'HubSpot Academy', issueYear: '2023' },
    ],
    documents: [
      { id: 'doc-10', title: 'Marketing Lead Deed', fileName: 'Shruthi_Contract.pdf', fileSize: '1.3 MB', uploadDate: '2023-02-15', category: 'Contract' },
    ],
    bankDetails: {
      accountNumber: '88990011223344',
      bankName: 'ICICI Bank Ltd',
      ifscCode: 'ICIC0001234',
      panNumber: 'SHRAD3456S',
      uanNumber: '100123456789',
      employeeCode: 'DF-MKT-011',
    },
    salary: {
      wageType: 'Fixed Wage',
      monthlyWage: 70000,
      annualWage: 840000,
      components: buildDefaultSalaryComponents(70000),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
    },
  },
  {
    id: 'emp-10',
    userId: 'user-emp-10',
    loginId: 'OITARVE0220010',
    name: 'Aravind Venkatesh',
    email: 'aravind.venkatesh@dayflow.internal',
    mobile: '+91 96000 55441',
    profilePicture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&crop=faces',
    department: 'Quality Assurance',
    jobPosition: 'Lead QA Automation Engineer',
    manager: 'Karthik Sundaram',
    location: 'Salem Tech Center',
    company: 'Dayflow Technologies India Pvt Ltd',
    dateOfJoining: '2023-06-01',
    dateOfBirth: '1995-10-10',
    residentialAddress: 'Door 19, Fairlands, Salem, Tamil Nadu 636016',
    nationality: 'Indian',
    personalEmail: 'aravind.qa.auto@gmail.com',
    gender: 'Male',
    maritalStatus: 'Single',
    about: 'Cypress, Playwright, and Jest automation architect ensuring 100% test coverage and zero regression.',
    whatILoveAboutMyJob: 'Catching tricky edge cases before they ever reach production.',
    interestsAndHobbies: 'Chess, solving LeetCode puzzles, and drone photography.',
    skills: [
      { id: 'sk-29', name: 'Playwright & Cypress E2E Testing', level: 'Expert' },
      { id: 'sk-30', name: 'Jest & Supertest API Automation', level: 'Expert' },
      { id: 'sk-31', name: 'Performance & Load Testing (k6)', level: 'Advanced' },
    ],
    certifications: [
      { id: 'cert-11', name: 'ISTQB Certified Tester Foundation', issuer: 'ISTQB', issueYear: '2022' },
    ],
    documents: [
      { id: 'doc-11', title: 'QA Lead Appointment Letter', fileName: 'Aravind_Appointment.pdf', fileSize: '1.5 MB', uploadDate: '2023-06-01', category: 'Contract' },
    ],
    bankDetails: {
      accountNumber: '99001122334455',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0002345',
      panNumber: 'ARVEN7890T',
      uanNumber: '100012345678',
      employeeCode: 'DF-QA-027',
    },
    salary: {
      wageType: 'Fixed Wage',
      monthlyWage: 72000,
      annualWage: 864000,
      components: buildDefaultSalaryComponents(72000),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
    },
  },
];

export const ALL_LEAVES = [
  {
    id: 'leave-1',
    employeeId: 'emp-3',
    leaveType: 'Paid Time Off',
    startDate: today,
    endDate: today,
    totalDays: 1,
    remarks: 'Attending annual family temple festival in Madurai.',
    attachmentFileName: 'temple_festival_invitation.pdf',
    status: 'Approved',
    appliedDate: '2026-08-18',
    reviewedDate: '2026-08-19',
    reviewedBy: 'Kavitha Balasubramanian (HR)',
    reviewRemarks: 'Approved. Enjoy the festival with your family!',
  },
  {
    id: 'leave-2',
    employeeId: 'emp-1',
    leaveType: 'Sick Leave',
    startDate: '2026-08-28',
    endDate: '2026-08-29',
    totalDays: 2,
    remarks: 'Scheduled minor outpatient dental surgery and recovery.',
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
    attachmentFileName: 'conference_registration.pdf',
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
    reviewRemarks: 'Approved as Unpaid Leave. 2 days deducted from payable days for July.',
  },
  {
    id: 'leave-5',
    employeeId: 'emp-1',
    leaveType: 'Paid Time Off',
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    totalDays: 3,
    remarks: 'Summer vacation holiday trip to Ooty & Coonoor.',
    status: 'Approved',
    appliedDate: '2026-06-01',
    reviewedDate: '2026-06-02',
    reviewedBy: 'Kavitha Balasubramanian (HR)',
    reviewRemarks: 'Approved. Have a wonderful break!',
  },
  {
    id: 'leave-6',
    employeeId: 'emp-7',
    leaveType: 'Casual Leave',
    startDate: '2026-08-14',
    endDate: '2026-08-14',
    totalDays: 1,
    remarks: 'Personal vehicle registration work at RTO.',
    status: 'Approved',
    appliedDate: '2026-08-10',
    reviewedDate: '2026-08-11',
    reviewedBy: 'Kavitha Balasubramanian (HR)',
    reviewRemarks: 'Approved.',
  },
  {
    id: 'leave-7',
    employeeId: 'emp-8',
    leaveType: 'Sick Leave',
    startDate: '2026-08-04',
    endDate: '2026-08-05',
    totalDays: 2,
    remarks: 'Viral fever and medical rest.',
    status: 'Approved',
    appliedDate: '2026-08-03',
    reviewedDate: '2026-08-04',
    reviewedBy: 'Kavitha Balasubramanian (HR)',
    reviewRemarks: 'Approved. Get well soon!',
  },
  {
    id: 'leave-8',
    employeeId: 'emp-9',
    leaveType: 'Paid Time Off',
    startDate: '2026-07-22',
    endDate: '2026-07-23',
    totalDays: 2,
    remarks: 'Attending cousin wedding in Thanjavur.',
    status: 'Approved',
    appliedDate: '2026-07-18',
    reviewedDate: '2026-07-19',
    reviewedBy: 'Kavitha Balasubramanian (HR)',
    reviewRemarks: 'Approved.',
  },
  {
    id: 'leave-9',
    employeeId: 'emp-10',
    leaveType: 'Casual Leave',
    startDate: '2026-08-11',
    endDate: '2026-08-11',
    totalDays: 1,
    remarks: 'Personal family matter.',
    status: 'Rejected',
    appliedDate: '2026-08-10',
    reviewedDate: '2026-08-10',
    reviewedBy: 'Kavitha Balasubramanian (HR)',
    reviewRemarks: 'Critical release testing scheduled on 11th Aug. Please reschedule.',
  },
];

export async function seed() {
  await initializeDatabase();
  const client = await pgPool.connect();

  try {
    logger.info('🌱 Seeding Dayflow HRMS PostgreSQL Database with 10 Indian Tamil employees & rich multi-month history...');
    await client.query('BEGIN');

    // Default password hashes
    const salt = await bcrypt.genSalt(12);
    const defaultPasswordHash = await bcrypt.hash('Dayflow@123', salt);

    // 1. Seed Company
    await client.query(
      `
      INSERT INTO "Company" ("id", "name", "prefix", "domain", "contactEmail", "address")
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name"
    `,
      [
        'comp-1',
        'Dayflow Technologies India Pvt Ltd',
        'OI',
        'dayflow.internal',
        'hr@dayflow.internal',
        'Module 4B, 3rd Floor, Ascendas IT Park, Taramani, Chennai, Tamil Nadu 600113',
      ]
    );

    // 2. Seed Users
    for (const u of ALL_USERS) {
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

    // 3. Seed Employees
    for (const emp of ALL_EMPLOYEES) {
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

    // 4. Seed Today's Attendance
    const todayCheckins = [
      { id: 'att-today-emp-1', employeeId: 'emp-1', date: today, in: '08:55 AM', out: null, hours: 7.2, extra: 0, status: 'Present', notes: 'Chennai Tech Park' },
      { id: 'att-today-emp-2', employeeId: 'emp-2', date: today, in: '09:15 AM', out: '06:30 PM', hours: 9.25, extra: 1.25, status: 'Present', notes: 'Payroll Sprint Review' },
      { id: 'att-today-emp-4', employeeId: 'emp-4', date: today, in: '08:30 AM', out: null, hours: 7.6, extra: 0, status: 'Present', notes: 'Executive Alignment' },
      { id: 'att-today-emp-6', employeeId: 'emp-6', date: today, in: '09:00 AM', out: '06:00 PM', hours: 9.0, extra: 1.0, status: 'Present', notes: 'Tax Compliance Audit' },
      { id: 'att-today-emp-7', employeeId: 'emp-7', date: today, in: '09:10 AM', out: null, hours: 6.8, extra: 0, status: 'Present', notes: 'K8s Cluster Upgrade' },
      { id: 'att-today-emp-8', employeeId: 'emp-8', date: today, in: '09:05 AM', out: '06:15 PM', hours: 9.15, extra: 1.15, status: 'Present', notes: 'Backend API release' },
      { id: 'att-today-emp-9', employeeId: 'emp-9', date: today, in: '09:30 AM', out: null, hours: 6.5, extra: 0, status: 'Present', notes: 'Campaign Planning' },
      { id: 'att-today-emp-10', employeeId: 'emp-10', date: today, in: '08:45 AM', out: '05:45 PM', hours: 9.0, extra: 1.0, status: 'Present', notes: 'E2E Testing Suite' },
    ];

    for (const a of todayCheckins) {
      await client.query(
        `
        INSERT INTO "Attendance" ("id", "employeeId", "date", "checkInTime", "checkOutTime", "workHours", "extraHours", "status", "notes")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT ("employeeId", "date") DO UPDATE SET
          "checkInTime" = EXCLUDED."checkInTime",
          "checkOutTime" = EXCLUDED."checkOutTime",
          "workHours" = EXCLUDED."workHours",
          "extraHours" = EXCLUDED."extraHours",
          "status" = EXCLUDED."status"
      `,
        [a.id, a.employeeId, a.date, a.in, a.out, a.hours, a.extra, a.status, a.notes]
      );
    }

    // 5. Seed Past 30 Days Attendance
    for (let i = 1; i <= 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (d.getDay() === 0 || d.getDay() === 6) continue; // skip weekends
      const dateStr = d.toISOString().split('T')[0];

      for (const emp of ALL_EMPLOYEES) {
        if (emp.id === 'emp-3' && i === 1) continue; // on leave today/yesterday
        if (emp.id === 'emp-5' && dateStr === '2026-07-15') continue; // unpaid leave
        if (emp.id === 'emp-5' && dateStr === '2026-07-16') continue;

        const attId = `att-past-${emp.id}-${dateStr}`;
        const randomMins = Math.floor(Math.random() * 20);
        const workHours = Number((8.2 + (randomMins % 5) * 0.2).toFixed(2));
        const extraHours = Math.max(0, Number((workHours - 8.0).toFixed(2)));

        await client.query(
          `
          INSERT INTO "Attendance" ("id", "employeeId", "date", "checkInTime", "checkOutTime", "workHours", "extraHours", "status", "notes")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT ("employeeId", "date") DO UPDATE SET
            "workHours" = EXCLUDED."workHours"
        `,
          [
            attId,
            emp.id,
            dateStr,
            `09:${String(randomMins).padStart(2, '0')} AM`,
            `06:${String(15 + randomMins).padStart(2, '0')} PM`,
            workHours,
            extraHours,
            'Present',
            'Regular on-schedule workday',
          ]
        );
      }
    }

    // 6. Seed Leaves
    for (const l of ALL_LEAVES) {
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

    // 7. Seed Multi-Month Payroll Runs (June & July 2026 for all 10 employees)
    const monthsToSeed = [
      { month: 'June 2026', year: 2026, monthIndex: 5, processedDate: '2026-06-30' },
      { month: 'July 2026', year: 2026, monthIndex: 6, processedDate: '2026-07-31' },
    ];

    for (const m of monthsToSeed) {
      for (const emp of ALL_EMPLOYEES) {
        const salary = emp.salary || {};
        const wage = salary.monthlyWage || 75000;
        const basicSalary = Math.round(wage * 0.5);
        const hra = Math.round(basicSalary * 0.5);
        const std = 4000;
        const bonus = 3000;
        const lta = 2000;
        const fixed = Math.max(0, wage - (basicSalary + hra + std + bonus + lta));

        const empPF = Math.round((basicSalary * 12) / 100);
        const employerPF = empPF;
        const profTax = 200;
        const totalDeductions = empPF + profTax;

        const isUnpaidEmp = emp.id === 'emp-5' && m.monthIndex === 6;
        const unpaidDays = isUnpaidEmp ? 2 : 0;
        const payableDays = 22 - unpaidDays;
        const grossEarned = Math.round((wage / 22) * payableDays);
        const netPayable = Math.max(0, grossEarned - totalDeductions);

        const payId = `pay-${m.year}-${String(m.monthIndex + 1).padStart(2, '0')}-${emp.id}`;

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
            payId,
            emp.id,
            m.month,
            m.year,
            m.monthIndex,
            22,
            payableDays,
            unpaidDays,
            payableDays,
            wage,
            basicSalary,
            hra,
            std,
            bonus,
            lta,
            fixed,
            empPF,
            employerPF,
            profTax,
            totalDeductions,
            netPayable,
            'Paid',
            m.processedDate,
          ]
        );
      }
    }

    // 8. Seed Notifications
    const notificationsToSeed = [
      { id: 'notif-1', employeeId: 'emp-1', title: 'On-Time Check-In Recorded', message: 'Your check-in at 08:55 AM was successfully recorded. Status: Present 🟢.', type: 'attendance', read: true },
      { id: 'notif-2', employeeId: 'emp-3', title: 'Leave Approved', message: "Your Paid Time Off for today has been approved by Kavitha Balasubramanian (HR).", type: 'leave', read: false },
      { id: 'notif-3', employeeId: 'emp-4', title: 'New Leave Request Pending Review', message: 'Karthik Sundaram applied for Sick Leave (28 Aug - 29 Aug, 2 days).', type: 'leave', read: false },
      { id: 'notif-4', employeeId: 'emp-5', title: 'July 2026 Payslip Available', message: 'Your salary payslip for July 2026 has been generated and is ready for download.', type: 'payroll', read: true },
      { id: 'notif-5', employeeId: 'emp-6', title: 'Tax & PF Statutory Filing Synced', message: 'EPF ECR and Professional Tax statements for July 2026 cycle generated.', type: 'payroll', read: true },
      { id: 'notif-6', employeeId: 'emp-7', title: 'Production Cloud Infra Deployed', message: 'Zero-downtime rolling update completed on production Kubernetes cluster.', type: 'system', read: false },
      { id: 'notif-7', employeeId: 'emp-10', title: 'Leave Request Status Update', message: 'Your Casual Leave request for 11 Aug was reviewed. Status: Rejected.', type: 'leave', read: true },
    ];

    for (const n of notificationsToSeed) {
      await client.query(
        `
        INSERT INTO "Notification" ("id", "employeeId", "title", "message", "type", "read")
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT ("id") DO UPDATE SET
          "title" = EXCLUDED."title",
          "message" = EXCLUDED."message"
      `,
        [n.id, n.employeeId, n.title, n.message, n.type, n.read]
      );
    }

    await client.query('COMMIT');
    logger.info('🎉 Successfully seeded comprehensive all-type database with 10 employees, 30 days attendance, 9 leaves, 20 payroll runs, and notifications!');
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
