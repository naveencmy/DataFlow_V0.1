import PDFDocument from 'pdfkit';

/**
 * Generates a clean, professional PDF payslip stream using PDFKit
 */
export function generatePayslipPdf(payroll, employee) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Header banner
  doc
    .fillColor('#4338CA')
    .rect(50, 50, 495, 45)
    .fill();

  doc
    .fillColor('#FFFFFF')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('DAYFLOW HRMS — SALARY PAYSLIP', 65, 65);

  doc
    .fontSize(10)
    .font('Helvetica')
    .text(`${payroll.month || 'Month Cycle'} | Status: ${payroll.status || 'Paid'}`, 380, 68);

  // Employee & Company Details
  doc.moveDown(2);
  const startY = 120;

  doc.fillColor('#1F2937').fontSize(11).font('Helvetica-Bold');
  doc.text('Employee Information', 50, startY);
  doc.text('Company Information', 320, startY);

  doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(50, startY + 15).lineTo(545, startY + 15).stroke();

  doc.font('Helvetica').fontSize(9).fillColor('#4B5563');

  const empDetails = [
    `Name: ${employee?.name || payroll.employeeName || 'N/A'}`,
    `Employee ID: ${employee?.id || payroll.employeeId || 'N/A'}`,
    `Department: ${employee?.department || payroll.department || 'N/A'}`,
    `Designation: ${employee?.jobPosition || 'N/A'}`,
    `Bank A/C: ${employee?.bankDetails?.accountNumber || '••••••••••••'}`,
  ];

  const compDetails = [
    `Company: ${employee?.company || 'Dayflow Technologies Pvt Ltd'}`,
    `Pay Period: ${payroll.month || 'N/A'}`,
    `Total Working Days: ${payroll.totalWorkingDays || 22}`,
    `Payable Days: ${payroll.payableDays || 22}`,
    `Processed Date: ${payroll.processedDate || new Date().toISOString().split('T')[0]}`,
  ];

  let curY = startY + 25;
  for (let i = 0; i < empDetails.length; i++) {
    doc.text(empDetails[i], 50, curY);
    doc.text(compDetails[i], 320, curY);
    curY += 14;
  }

  // Salary Breakdown Table
  const tableY = curY + 20;
  doc.fillColor('#1F2937').fontSize(11).font('Helvetica-Bold');
  doc.text('Earnings Breakdown', 50, tableY);
  doc.text('Deductions', 320, tableY);

  doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(50, tableY + 15).lineTo(545, tableY + 15).stroke();

  doc.font('Helvetica').fontSize(9).fillColor('#374151');

  const earnings = [
    { label: 'Basic Salary', amount: payroll.basicSalary || 0 },
    { label: 'House Rent Allowance (HRA)', amount: payroll.hra || 0 },
    { label: 'Standard Allowance', amount: payroll.standardAllowance || 0 },
    { label: 'Performance Bonus', amount: payroll.performanceBonus || 0 },
    { label: 'Leave Travel Allowance (LTA)', amount: payroll.lta || 0 },
    { label: 'Fixed Allowance (Balancing)', amount: payroll.fixedAllowance || 0 },
  ];

  const deductions = [
    { label: 'Employee PF Contribution', amount: payroll.employeePFDeduction || 0 },
    { label: 'Employer PF (for info)', amount: payroll.employerPFContribution || 0 },
    { label: 'Professional Tax', amount: payroll.professionalTax || 0 },
  ];

  let rowY = tableY + 25;
  const maxRows = Math.max(earnings.length, deductions.length);

  for (let i = 0; i < maxRows; i++) {
    if (earnings[i]) {
      doc.text(earnings[i].label, 50, rowY);
      doc.text(`INR ${Number(earnings[i].amount).toLocaleString('en-IN')}`, 230, rowY, { align: 'right', width: 60 });
    }
    if (deductions[i]) {
      doc.text(deductions[i].label, 320, rowY);
      doc.text(`INR ${Number(deductions[i].amount).toLocaleString('en-IN')}`, 480, rowY, { align: 'right', width: 65 });
    }
    rowY += 16;
  }

  // Totals Section
  doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(50, rowY + 5).lineTo(545, rowY + 5).stroke();
  rowY += 15;

  doc.font('Helvetica-Bold').fontSize(10).fillColor('#1F2937');
  doc.text('Gross Monthly Wage:', 50, rowY);
  doc.text(`INR ${Number(payroll.grossMonthlyWage || 0).toLocaleString('en-IN')}`, 200, rowY, { align: 'right', width: 90 });

  doc.text('Total Deductions:', 320, rowY);
  doc.text(`INR ${Number(payroll.totalDeductions || 0).toLocaleString('en-IN')}`, 455, rowY, { align: 'right', width: 90 });

  // Net Pay Callout
  rowY += 35;
  doc
    .fillColor('#ECFDF5')
    .rect(50, rowY, 495, 45)
    .fill();

  doc
    .strokeColor('#10B981')
    .lineWidth(1)
    .rect(50, rowY, 495, 45)
    .stroke();

  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor('#065F46')
    .text('NET SALARY PAYABLE:', 70, rowY + 16);

  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor('#047857')
    .text(`INR ${Number(payroll.netPayableAmount || 0).toLocaleString('en-IN')}`, 350, rowY + 15, { align: 'right', width: 175 });

  // Footer
  doc.font('Helvetica').fontSize(8).fillColor('#9CA3AF');
  doc.text('This is a system-generated document and does not require a physical signature.', 50, 740, {
    align: 'center',
    width: 495,
  });

  return doc;
}

export default { generatePayslipPdf };
