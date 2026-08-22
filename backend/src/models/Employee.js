import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String },
  issueYear: { type: String },
});

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileName: { type: String },
  fileSize: { type: String },
  uploadDate: { type: String },
  category: { type: String, default: 'General' },
});

const bankDetailsSchema = new mongoose.Schema({
  accountNumber: { type: String },
  bankName: { type: String },
  ifscCode: { type: String },
  panNumber: { type: String },
  uanNumber: { type: String },
  employeeCode: { type: String },
});

const salaryComponentSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  calculationType: { type: String, enum: ['fixed', 'percentage'] },
  value: { type: Number },
  percentageBase: { type: String },
  calculatedAmount: { type: Number },
  isBalancing: { type: Boolean, default: false },
});

const salarySchema = new mongoose.Schema({
  wageType: { type: String, default: 'Fixed Wage' },
  monthlyWage: { type: Number, required: true, min: 0 },
  annualWage: { type: Number },
  components: [salaryComponentSchema],
  employeePFPercentage: { type: Number, default: 12 },
  employerPFPercentage: { type: Number, default: 12 },
  professionalTax: { type: Number, default: 200 },
  workingDaysPerWeek: { type: Number, default: 5 },
  breakTimeMinutes: { type: Number, default: 60 },
});

const employeeSchema = new mongoose.Schema(
  {
    // Identity
    loginId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String },
    profilePicture: { type: String },
    status: { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' },

    // Job Info
    department: { type: String, required: true },
    jobPosition: { type: String, required: true },
    manager: { type: String },
    location: { type: String, default: 'Bangalore Tech Hub' },
    company: { type: String, default: 'Dayflow Technologies Pvt Ltd' },
    dateOfJoining: { type: String },

    // Personal
    dateOfBirth: { type: String },
    residentialAddress: { type: String },
    nationality: { type: String, default: 'Indian' },
    personalEmail: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Non-Binary', 'Prefer not to say'] },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },

    // Bio
    about: { type: String },
    whatILoveAboutMyJob: { type: String },
    interestsAndHobbies: { type: String },

    // Sub-documents
    skills: [skillSchema],
    certifications: [certificationSchema],
    documents: [documentSchema],
    bankDetails: { type: bankDetailsSchema, default: () => ({}) },
    salary: { type: salarySchema, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Full-text search index
employeeSchema.index({ name: 'text', email: 'text', department: 'text', jobPosition: 'text' });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
