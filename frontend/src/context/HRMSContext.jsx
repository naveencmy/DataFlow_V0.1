import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
} from '../data/seedData.js';
import { generateLoginId, generateInitialPassword } from '../utils/idGenerator.js';
import { buildDefaultSalaryComponents } from '../utils/salaryEngine.js';
import { getTodayDateString } from '../utils/formatters.js';
import { useAuth } from './AuthContext.jsx';
import { useNotifications } from './NotificationContext.jsx';

const HRMSContext = createContext(undefined);

export const HRMSProvider = ({ children }) => {
  const { currentUser, role, registerNewUserAccount } = useAuth();
  const { addNotification, showToast } = useNotifications();

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('dayflow_employees');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse employees', e);
      }
    }
    return INITIAL_EMPLOYEES;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('dayflow_attendance');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse attendance', e);
      }
    }
    return INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('dayflow_leaves');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse leaves', e);
      }
    }
    return INITIAL_LEAVES;
  });

  const [payroll, setPayroll] = useState(() => {
    const saved = localStorage.getItem('dayflow_payroll');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse payroll', e);
      }
    }
    return INITIAL_PAYROLL;
  });

  useEffect(() => {
    localStorage.setItem('dayflow_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('dayflow_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('dayflow_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('dayflow_payroll', JSON.stringify(payroll));
  }, [payroll]);

  const getEmployeeById = (id) => {
    return employees.find((e) => e.id === id);
  };

  // Add Employee per Section 4 & 6 specs
  const addEmployee = (payload) => {
    const nextSerial = employees.length + 1;
    const joiningYear = payload.dateOfJoining ? parseInt(payload.dateOfJoining.slice(0, 4)) : new Date().getFullYear();
    const loginId = generateLoginId('OIT', payload.name, joiningYear, nextSerial);
    const initialPassword = generateInitialPassword();
    const newEmpId = `emp-${Date.now()}`;

    const defaultPic = payload.gender === 'Female'
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces';

    const wage = Number(payload.monthlyWage) || 60000;

    const newEmployee = {
      id: newEmpId,
      loginId,
      name: payload.name,
      email: payload.email,
      mobile: payload.mobile,
      profilePicture: payload.profilePicture || defaultPic,
      department: payload.department,
      jobPosition: payload.jobPosition,
      manager: payload.manager || 'Sarah Williams',
      location: payload.location || 'Bangalore Tech Hub',
      company: payload.company || 'Dayflow Technologies Pvt Ltd',
      dateOfJoining: payload.dateOfJoining || getTodayDateString(),
      dateOfBirth: payload.dateOfBirth || '1995-01-01',
      residentialAddress: payload.residentialAddress || 'Bangalore, Karnataka',
      nationality: payload.nationality || 'Indian',
      personalEmail: payload.personalEmail || payload.email,
      gender: payload.gender || 'Female',
      maritalStatus: payload.maritalStatus || 'Single',
      about: `Newly joined ${payload.jobPosition} in the ${payload.department} team.`,
      whatILoveAboutMyJob: 'Collaborating on innovative workplace solutions and growing with the team.',
      interestsAndHobbies: 'Reading, technology, fitness, and design.',
      skills: [
        { id: `sk-${Date.now()}-1`, name: 'Communication & Collaboration', level: 'Advanced' },
        { id: `sk-${Date.now()}-2`, name: `${payload.department} Operations`, level: 'Intermediate' },
      ],
      certifications: [],
      documents: [
        {
          id: `doc-${Date.now()}`,
          title: 'Employment Agreement',
          fileName: `${payload.name.replace(/\s+/g, '_')}_Agreement.pdf`,
          fileSize: '1.4 MB',
          uploadDate: getTodayDateString(),
          category: 'Contract',
        },
      ],
      bankDetails: {
        accountNumber: payload.bankDetails?.accountNumber || '12345678901234',
        bankName: payload.bankDetails?.bankName || 'HDFC Bank Ltd',
        ifscCode: payload.bankDetails?.ifscCode || 'HDFC0001234',
        panNumber: payload.bankDetails?.panNumber || 'ABCDE1234F',
        uanNumber: payload.bankDetails?.uanNumber || '100987654321',
        employeeCode: payload.bankDetails?.employeeCode || `DF-${payload.department.slice(0, 3).toUpperCase()}-${String(nextSerial).padStart(3, '0')}`,
      },
      salary: {
        wageType: 'Fixed Wage',
        monthlyWage: wage,
        annualWage: wage * 12,
        components: buildDefaultSalaryComponents(wage),
        employeePFPercentage: 12,
        employerPFPercentage: 12,
        professionalTax: 200,
        workingDaysPerWeek: 5,
        breakTimeMinutes: 60,
      },
    };

    // Register user account in Auth
    registerNewUserAccount({
      id: `user-${newEmpId}`,
      loginId,
      email: payload.email,
      role: 'EMPLOYEE',
      employeeId: newEmpId,
      isFirstLogin: true,
    });

    setEmployees((prev) => [newEmployee, ...prev]);

    addNotification({
      title: 'New Employee Account Created',
      message: `${payload.name} added with Login ID ${loginId}. Generated credentials ready.`,
      type: 'account',
    });

    return {
      loginId,
      initialPassword,
      name: payload.name,
      email: payload.email,
    };
  };

  // Update Employee with Section 8 editing permissions
  const updateEmployee = (id, updates) => {
    const existing = employees.find((e) => e.id === id);
    if (!existing) return false;

    // If current role is Employee editing own profile, only allow Address, Phone, Profile Picture, Personal Email, About, Interests
    if (role === 'EMPLOYEE') {
      const allowedUpdates = {
        residentialAddress: updates.residentialAddress ?? existing.residentialAddress,
        mobile: updates.mobile ?? existing.mobile,
        profilePicture: updates.profilePicture ?? existing.profilePicture,
        personalEmail: updates.personalEmail ?? existing.personalEmail,
        about: updates.about ?? existing.about,
        whatILoveAboutMyJob: updates.whatILoveAboutMyJob ?? existing.whatILoveAboutMyJob,
        interestsAndHobbies: updates.interestsAndHobbies ?? existing.interestsAndHobbies,
      };

      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...allowedUpdates } : e))
      );
    } else {
      // Admin has full edit rights
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
    }

    showToast('success', 'Profile Updated', 'Employee details have been saved successfully.');
    return true;
  };

  // Attendance Check-In / Check-Out
  const getTodayAttendance = (employeeId) => {
    const todayStr = getTodayDateString();
    return attendance.find((a) => a.employeeId === employeeId && a.date === todayStr);
  };

  const getAttendanceForDate = (date) => {
    return attendance.filter((a) => a.date === date);
  };

  const getEmployeeAttendanceHistory = (employeeId) => {
    return attendance.filter((a) => a.employeeId === employeeId).sort((a, b) => b.date.localeCompare(a.date));
  };

  const checkIn = (employeeId, notes) => {
    const todayStr = getTodayDateString();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const existing = attendance.find((a) => a.employeeId === employeeId && a.date === todayStr);

    if (existing) {
      if (existing.checkInTime) {
        showToast('warning', 'Already Checked In', `You checked in at ${existing.checkInTime}`);
        return;
      }
      setAttendance((prev) =>
        prev.map((a) =>
          a.id === existing.id
            ? { ...a, checkInTime: timeStr, status: 'Present', notes: notes || a.notes }
            : a
        )
      );
    } else {
      const newRecord = {
        id: `att-${Date.now()}`,
        employeeId,
        date: todayStr,
        checkInTime: timeStr,
        checkOutTime: null,
        workHours: 0,
        extraHours: 0,
        status: 'Present',
        notes: notes || 'Checked in via Dayflow Portal',
      };
      setAttendance((prev) => [newRecord, ...prev]);
    }

    showToast('success', 'Checked In Successfully 🟢', `Check-in recorded at ${timeStr}`);
    addNotification({
      title: 'Check-In Recorded',
      message: `Status updated to Present 🟢 at ${timeStr}.`,
      type: 'attendance',
      targetUserId: employeeId,
    });
  };

  const checkOut = (employeeId) => {
    const todayStr = getTodayDateString();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const existing = attendance.find((a) => a.employeeId === employeeId && a.date === todayStr);

    if (!existing || !existing.checkInTime) {
      showToast('error', 'Cannot Check Out', 'You must check in first before checking out.');
      return;
    }

    let hoursWorked = 8.5;
    try {
      const [inTime, inPeriod] = existing.checkInTime.split(' ');
      const [inH, inM] = inTime.split(':').map(Number);
      let adjustedInH = inH;
      if (inPeriod === 'PM' && inH !== 12) adjustedInH += 12;
      if (inPeriod === 'AM' && inH === 12) adjustedInH = 0;

      const inDate = new Date();
      inDate.setHours(adjustedInH, inM, 0, 0);

      const diffMs = now.getTime() - inDate.getTime();
      const diffHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
      if (diffHours > 0) {
        hoursWorked = diffHours;
      }
    } catch {
      hoursWorked = 8.25;
    }

    const extraHours = Math.max(0, Number((hoursWorked - 8).toFixed(2)));

    setAttendance((prev) =>
      prev.map((a) =>
        a.id === existing.id
          ? {
              ...a,
              checkOutTime: timeStr,
              workHours: hoursWorked,
              extraHours,
              status: hoursWorked < 4.5 ? 'Half-day' : 'Present',
            }
          : a
      )
    );

    showToast('success', 'Checked Out Successfully', `Logged ${hoursWorked} hrs today (Extra: ${extraHours} hrs).`);
    addNotification({
      title: 'Check-Out Completed',
      message: `Completed workday with ${hoursWorked} total work hours.`,
      type: 'attendance',
      targetUserId: employeeId,
    });
  };

  // Leave Management
  const getEmployeeLeaves = (employeeId) => {
    return leaves.filter((l) => l.employeeId === employeeId).sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));
  };

  const applyLeave = (
    employeeId,
    leaveType,
    startDate,
    endDate,
    remarks,
    attachmentFileName
  ) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newRequest = {
      id: `leave-${Date.now()}`,
      employeeId,
      employeeName: emp.name,
      employeeAvatar: emp.profilePicture,
      department: emp.department,
      leaveType,
      startDate,
      endDate,
      totalDays: Math.max(1, totalDays),
      remarks,
      attachmentFileName,
      status: 'Pending',
      appliedDate: getTodayDateString(),
    };

    setLeaves((prev) => [newRequest, ...prev]);

    addNotification({
      title: `New Leave Request: ${emp.name}`,
      message: `${emp.name} applied for ${leaveType} (${totalDays} day${totalDays > 1 ? 's' : ''}).`,
      type: 'leave',
    });

    showToast('success', 'Leave Request Submitted', 'Your request is currently Pending HR review.');
    return true;
  };

  const reviewLeave = (leaveId, status, reviewRemarks) => {
    const targetLeave = leaves.find((l) => l.id === leaveId);
    if (!targetLeave) return false;

    const reviewerName = currentUser?.email || 'HR Administrator';
    const reviewedDate = getTodayDateString();

    setLeaves((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status,
              reviewRemarks,
              reviewedBy: reviewerName,
              reviewedDate,
            }
          : l
      )
    );

    // Cross-Module connection per Section 10:
    // If Approved, update/insert attendance for those dates as 'Leave' (✈️)
    if (status === 'Approved') {
      const s = new Date(targetLeave.startDate);
      const e = new Date(targetLeave.endDate);
      const datesToMark = [];

      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 0 && d.getDay() !== 6) {
          datesToMark.push(d.toISOString().split('T')[0]);
        }
      }

      setAttendance((prev) => {
        let updated = [...prev];
        datesToMark.forEach((dateStr) => {
          const existingIdx = updated.findIndex(
            (a) => a.employeeId === targetLeave.employeeId && a.date === dateStr
          );
          if (existingIdx >= 0) {
            updated[existingIdx] = {
              ...updated[existingIdx],
              status: 'Leave',
              notes: `Approved ${targetLeave.leaveType}`,
            };
          } else {
            updated.push({
              id: `att-leave-${targetLeave.employeeId}-${dateStr}`,
              employeeId: targetLeave.employeeId,
              date: dateStr,
              checkInTime: null,
              checkOutTime: null,
              workHours: 0,
              extraHours: 0,
              status: 'Leave',
              notes: `Approved ${targetLeave.leaveType}`,
            });
          }
        });
        return updated;
      });
    }

    addNotification({
      title: `Leave Request ${status}`,
      message: `${targetLeave.employeeName}'s ${targetLeave.leaveType} has been marked as ${status}.`,
      type: 'leave',
      targetUserId: targetLeave.employeeId,
    });

    showToast(
      status === 'Approved' ? 'success' : 'error',
      `Leave Request ${status}`,
      `${targetLeave.employeeName}'s request was ${status.toLowerCase()}.`
    );

    return true;
  };

  // Salary & Payroll Updates
  const updateSalaryStructure = (employeeId, newSalary) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, salary: newSalary } : e))
    );
    showToast('success', 'Salary Structure Updated', 'Live compensation components recomputed.');
    addNotification({
      title: 'Salary Structure Updated',
      message: `Compensation structure reconfigured for employee ${employeeId}.`,
      type: 'payroll',
      targetUserId: employeeId,
    });
  };

  // Process Monthly Payroll with live connection: Attendance + Unpaid leaves -> Payable days -> Net Salary
  const processMonthlyPayroll = (monthStr, year, monthIndex) => {
    const totalWorkingDays = 22;

    const newRecords = employees.map((emp) => {
      const unpaidDaysCount = leaves
        .filter((l) => l.employeeId === emp.id && l.status === 'Approved' && l.leaveType === 'Unpaid Leave')
        .reduce((sum, l) => sum + (l.totalDays || 1), 0);

      const payableDays = Math.max(0, totalWorkingDays - unpaidDaysCount);
      const wage = emp.salary?.monthlyWage || 60000;
      
      const basicComp = emp.salary?.components?.find((c) => c.name === 'Basic Salary');
      const basic = basicComp ? basicComp.calculatedAmount : Math.round(wage * 0.5);
      
      const hraComp = emp.salary?.components?.find((c) => c.name === 'House Rent Allowance (HRA)');
      const hra = hraComp ? hraComp.calculatedAmount : Math.round(basic * 0.5);

      const stdComp = emp.salary?.components?.find((c) => c.name === 'Standard Allowance');
      const std = stdComp ? stdComp.calculatedAmount : 4000;

      const bonusComp = emp.salary?.components?.find((c) => c.name === 'Performance Bonus');
      const bonus = bonusComp ? bonusComp.calculatedAmount : 3000;

      const ltaComp = emp.salary?.components?.find((c) => c.name === 'Leave Travel Allowance (LTA)');
      const lta = ltaComp ? ltaComp.calculatedAmount : 2000;

      const fixedComp = emp.salary?.components?.find((c) => c.isBalancing);
      const fixed = fixedComp ? fixedComp.calculatedAmount : Math.max(0, wage - (basic + hra + std + bonus + lta));

      // Deductions
      const employeePF = Math.round((basic * (emp.salary?.employeePFPercentage || 12)) / 100);
      const employerPF = Math.round((basic * (emp.salary?.employerPFPercentage || 12)) / 100);
      const profTax = emp.salary?.professionalTax || 200;
      const totalDeductions = employeePF + profTax;

      // Earned Gross based on payable days
      const perDayRate = wage / totalWorkingDays;
      const earnedGross = Math.round(perDayRate * payableDays);
      const netPay = Math.max(0, earnedGross - totalDeductions);

      return {
        id: `pay-${year}-${String(monthIndex + 1).padStart(2, '0')}-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        month: monthStr,
        year,
        monthIndex,
        totalWorkingDays,
        paidDays: payableDays,
        unpaidDays: unpaidDaysCount,
        payableDays,
        grossMonthlyWage: wage,
        basicSalary: basic,
        hra,
        standardAllowance: std,
        performanceBonus: bonus,
        lta,
        fixedAllowance: fixed,
        employeePFDeduction: employeePF,
        employerPFContribution: employerPF,
        professionalTax: profTax,
        totalDeductions,
        netPayableAmount: netPay,
        status: 'Processed',
        processedDate: getTodayDateString(),
      };
    });

    setPayroll((prev) => {
      const filtered = prev.filter((p) => p.month !== monthStr || p.year !== year);
      return [...newRecords, ...filtered];
    });

    showToast('success', 'Payroll Cycle Processed', `Generated payslips for ${newRecords.length} employees for ${monthStr}.`);
    addNotification({
      title: 'Payroll Cycle Processed',
      message: `Monthly salary calculations updated for ${monthStr} (${newRecords.length} employees).`,
      type: 'payroll',
    });

    return newRecords;
  };

  // Skills & Certifications & Documents
  const addSkill = (employeeId, skill) => {
    const newSkill = { id: `sk-${Date.now()}`, ...skill };
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId ? { ...e, skills: [...(e.skills || []), newSkill] } : e
      )
    );
    showToast('success', 'Skill Added', `${skill.name} added to profile.`);
  };

  const removeSkill = (employeeId, skillId) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId ? { ...e, skills: (e.skills || []).filter((s) => s.id !== skillId) } : e
      )
    );
  };

  const addCertification = (employeeId, cert) => {
    const newCert = { id: `cert-${Date.now()}`, ...cert };
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId ? { ...e, certifications: [...(e.certifications || []), newCert] } : e
      )
    );
    showToast('success', 'Certification Added', `${cert.name} added to profile.`);
  };

  const removeCertification = (employeeId, certId) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId ? { ...e, certifications: (e.certifications || []).filter((c) => c.id !== certId) } : e
      )
    );
  };

  const addDocument = (employeeId, doc) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      ...doc,
      uploadDate: getTodayDateString(),
    };
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId ? { ...e, documents: [...(e.documents || []), newDoc] } : e
      )
    );
    showToast('success', 'Document Uploaded', `${doc.title} saved to repository.`);
  };

  const removeDocument = (employeeId, docId) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId ? { ...e, documents: (e.documents || []).filter((d) => d.id !== docId) } : e
      )
    );
  };

  const resetHRMSData = () => {
    localStorage.removeItem('dayflow_employees');
    localStorage.removeItem('dayflow_attendance');
    localStorage.removeItem('dayflow_leaves');
    localStorage.removeItem('dayflow_payroll');
    localStorage.removeItem('dayflow_notifications');
    localStorage.removeItem('dayflow_users');
    localStorage.removeItem('dayflow_passwords');
    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setPayroll(INITIAL_PAYROLL);
    showToast('info', 'System Reset', 'All HRMS data restored to seed defaults.');
  };

  return (
    <HRMSContext.Provider
      value={{
        employees,
        attendance,
        leaves,
        payroll,
        addEmployee,
        updateEmployee,
        getEmployeeById,
        checkIn,
        checkOut,
        getTodayAttendance,
        getAttendanceForDate,
        getEmployeeAttendanceHistory,
        applyLeave,
        reviewLeave,
        getEmployeeLeaves,
        updateSalaryStructure,
        processMonthlyPayroll,
        addSkill,
        removeSkill,
        addCertification,
        removeCertification,
        addDocument,
        removeDocument,
        resetHRMSData,
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return context;
};
