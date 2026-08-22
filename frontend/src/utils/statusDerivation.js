/**
 * Derives the Section 7 fixed 3-state employee status for a given target date
 * 🟢 PRESENT: Employee has checked in today
 * ✈️ ON_LEAVE: Absent today BUT has an approved leave covering today
 * 🟡 ABSENT: Absent today with NO approved leave applied/approved
 */
export function deriveEmployeeWorkStatus(employeeId, targetDate, attendances = [], leaves = []) {
  // 1. Check if employee has checked in on target date
  const todayAttendance = attendances.find(
    (a) => a.employeeId === employeeId && a.date === targetDate
  );

  if (todayAttendance && todayAttendance.checkInTime) {
    return {
      status: 'PRESENT',
      label: 'Present',
      icon: '🟢',
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badgeClass: 'bg-emerald-500',
      detailText: `Checked in at ${todayAttendance.checkInTime}`,
    };
  }

  // 2. Check if employee is on approved leave for target date
  const approvedLeave = leaves.find((leave) => {
    if (leave.employeeId !== employeeId || leave.status !== 'Approved') return false;
    return targetDate >= leave.startDate && targetDate <= leave.endDate;
  });

  if (approvedLeave) {
    return {
      status: 'ON_LEAVE',
      label: 'On Leave',
      icon: '✈️',
      colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
      badgeClass: 'bg-sky-500',
      detailText: `${approvedLeave.leaveType} (${approvedLeave.startDate} to ${approvedLeave.endDate})`,
    };
  }

  // 3. Absent without approved leave
  return {
    status: 'ABSENT',
    label: 'Absent',
    icon: '🟡',
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    badgeClass: 'bg-amber-500',
    detailText: 'No check-in or approved leave recorded',
  };
}
