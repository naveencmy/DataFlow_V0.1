import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    employeeName: { type: String },
    employeeAvatar: { type: String },
    department: { type: String },
    leaveType: {
      type: String,
      enum: ['Paid Time Off', 'Sick Leave', 'Unpaid Leave', 'Casual Leave', 'Maternity Leave', 'Paternity Leave'],
      required: true,
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalDays: { type: Number, required: true, min: 1 },
    remarks: { type: String },
    attachmentFileName: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    appliedDate: { type: String },

    // Review details (set when Admin approves/rejects)
    reviewedBy: { type: String },
    reviewedDate: { type: String },
    reviewRemarks: { type: String },
  },
  { timestamps: true }
);

leaveSchema.index({ employeeId: 1, status: 1 });
leaveSchema.index({ startDate: 1 });

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
