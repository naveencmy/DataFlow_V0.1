# Human Resource Management System (Dayflow HRMS)

A Human Resource Management System (HRMS) built with React 19, Vite, Tailwind CSS, Lucide Icons, and Recharts.

---

## 🚀 Features

- **Split-Screen Aurora Authentication & Sign Up**:
  - Sign in with role-gated access (Admin / HR vs Employee).
  - Wireframe-compliant Sign Up flow with automatic Login ID generation (`[CompanyPrefix][First2First][First2Last][Year][Serial]`).
- **Sidebar-Driven Dashboard**:
  - Neo-pastel KPI metric cards for Total Headcount, Present, On Leave, and Absent with live derived attendance.
  - 3-column interactive employee directory with quick actions.
- **Employee Profile Management**:
  - View-only protected mode with editing toggle.
  - Tabbed architecture: Resume, Private Info, Salary Info (50/50 CTC engine), and Security.
- **Attendance Master & Digital Timecard**:
  - Real-time check-in/check-out terminal with digital clock and overtime derivation.
  - Role-gated admin date navigator and employee log view.
- **Time Off & Leave Approval Flow**:
  - Quota balance tracking for Paid Time Off, Sick Leave, and Unpaid Leave.
  - Expandable approval timeline stepper.
- **Payroll & Digital Payslips**:
  - Batch payroll processing connected with attendance and unpaid leave multipliers.
  - Itemized printable digital payslips.
- **Analytics & System Configuration**:
  - Recharts headcount and attendance analytics.
  - Section 13 specification toggle flags.

---

## 🛠️ Project Structure

```
HRMS/
├── frontend/             # Frontend React + Vite application
│   ├── public/           # Static assets
│   ├── src/              # React source code
│   │   ├── components/   # Modular UI components (auth, employees, attendance, leave, payroll, common)
│   │   ├── context/      # Context providers (Auth, HRMS, Notification, Config)
│   │   ├── data/         # Seed data
│   │   ├── utils/        # Business logic, derivations, and ID generators
│   │   ├── App.jsx       # Root shell
│   │   └── main.jsx      # Entry point
│   ├── index.html        # HTML template
│   ├── package.json      # Dependencies and scripts
│   └── vite.config.ts    # Vite configuration
├── .gitignore
└── README.md
```

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm / yarn / pnpm

### Installation & Run

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
