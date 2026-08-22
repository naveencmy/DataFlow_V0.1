/**
 * @typedef {'ADMIN' | 'EMPLOYEE'} UserRole
 * 
 * @typedef {Object} User
 * @property {string} id
 * @property {string} loginId
 * @property {string} email
 * @property {UserRole} role
 * @property {string} [employeeId]
 * @property {string} [createdAt]
 * 
 * @typedef {Object} SalaryComponent
 * @property {string} name
 * @property {number} calculatedAmount
 * @property {string} [type]
 * 
 * @typedef {Object} SalaryStructure
 * @property {string} wageType
 * @property {number} monthlyWage
 * @property {number} annualWage
 * @property {SalaryComponent[]} components
 * @property {number} employeePFPercentage
 * @property {number} employerPFPercentage
 * @property {number} professionalTax
 * @property {number} workingDaysPerWeek
 * @property {number} breakTimeMinutes
 * 
 * @typedef {Object} Employee
 * @property {string} id
 * @property {string} loginId
 * @property {string} name
 * @property {string} email
 * @property {string} [phone]
 * @property {string} department
 * @property {string} jobPosition
 * @property {string} joiningDate
 * @property {string} [profilePicture]
 * @property {string} [location]
 * @property {string} [about]
 * @property {boolean} isDeactivated
 * @property {SalaryStructure} [salary]
 * @property {Object} [bankDetails]
 * @property {Object} [emergencyContact]
 * @property {Array} [documents]
 * 
 * @typedef {Object} AttendanceRecord
 * @property {string} id
 * @property {string} employeeId
 * @property {string} date
 * @property {string|null} checkInTime
 * @property {string|null} checkOutTime
 * @property {'PRESENT' | 'ABSENT' | 'ON_LEAVE' | 'Half-day'} status
 * @property {number} workHours
 * @property {number} overtimeHours
 * @property {string} [notes]
 * 
 * @typedef {Object} LeaveRequest
 * @property {string} id
 * @property {string} employeeId
 * @property {string} employeeName
 * @property {string} department
 * @property {string} [employeeAvatar]
 * @property {'Paid Time Off' | 'Sick Leave' | 'Unpaid Leave'} leaveType
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} totalDays
 * @property {string} remarks
 * @property {'Pending' | 'Approved' | 'Rejected' | 'Cancelled'} status
 * @property {string} appliedDate
 * @property {string} [reviewedBy]
 * @property {string} [reviewedDate]
 * @property {string} [reviewRemarks]
 * 
 * @typedef {Object} PayrollRecord
 * @property {string} id
 * @property {string} employeeId
 * @property {string} employeeName
 * @property {string} department
 * @property {string} month
 * @property {number} year
 * @property {number} baseSalary
 * @property {number} standardAllowances
 * @property {number} customAllowances
 * @property {number} grossSalary
 * @property {number} deductions
 * @property {number} pfDeduction
 * @property {number} taxDeduction
 * @property {number} netPayableAmount
 * @property {number} payableDays
 * @property {number} totalWorkingDays
 * @property {'PROCESSED' | 'PAID' | 'ON_HOLD'} status
 * @property {string} [disbursedAt]
 * @property {string} [paymentReference]
 */

export const Role = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
};
