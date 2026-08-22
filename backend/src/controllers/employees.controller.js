import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { buildDefaultSalaryComponents } from '../utils/salaryEngine.js';
import { generateLoginId, generateInitialPassword, generateEmployeeCode } from '../utils/idGenerator.js';
import { getTodayDateString } from '../utils/formatters.js';

// GET /api/employees — Admin: all, Employee: own profile only
export const getEmployees = async (req, res, next) => {
  try {
    const { search, department, status, page = 1, limit = 50 } = req.query;

    let query = {};

    // Employee can only see themselves
    if (req.user.role === 'EMPLOYEE') {
      query._id = req.user.employeeId;
    } else {
      // Admin filters
      if (department) query.department = department;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
          { jobPosition: { $regex: search, $options: 'i' } },
          { loginId: { $regex: search, $options: 'i' } },
        ];
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [employees, total] = await Promise.all([
      Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Employee.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      employees,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/employees/:id
export const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    res.status(200).json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};

// POST /api/employees — Admin only
export const createEmployee = async (req, res, next) => {
  try {
    const payload = req.body;
    const employeeCount = await Employee.countDocuments();
    const nextSerial = employeeCount + 1;
    const joiningYear = payload.dateOfJoining
      ? parseInt(payload.dateOfJoining.slice(0, 4))
      : new Date().getFullYear();

    const loginId = generateLoginId('OIT', payload.name, joiningYear, nextSerial);
    const initialPassword = generateInitialPassword();
    const wage = Number(payload.monthlyWage) || 60000;

    const employeeDoc = {
      loginId,
      name: payload.name,
      email: payload.email,
      mobile: payload.mobile || '',
      department: payload.department,
      jobPosition: payload.jobPosition,
      manager: payload.manager || 'Sarah Williams',
      location: payload.location || 'Bangalore Tech Hub',
      company: payload.company || 'Dayflow Technologies Pvt Ltd',
      dateOfJoining: payload.dateOfJoining || getTodayDateString(),
      dateOfBirth: payload.dateOfBirth || '',
      gender: payload.gender || 'Prefer not to say',
      maritalStatus: payload.maritalStatus || 'Single',
      nationality: payload.nationality || 'Indian',
      residentialAddress: payload.residentialAddress || '',
      personalEmail: payload.personalEmail || payload.email,
      about: `Newly joined ${payload.jobPosition} in the ${payload.department} team.`,
      whatILoveAboutMyJob: 'Collaborating on innovative solutions and growing with the team.',
      interestsAndHobbies: 'Reading, technology, and continuous learning.',
      skills: [
        { name: 'Communication & Collaboration', level: 'Advanced' },
        { name: `${payload.department} Operations`, level: 'Intermediate' },
      ],
      certifications: [],
      documents: [
        {
          title: 'Employment Agreement',
          fileName: `${payload.name.replace(/\s+/g, '_')}_Agreement.pdf`,
          fileSize: '1.4 MB',
          uploadDate: getTodayDateString(),
          category: 'Contract',
        },
      ],
      bankDetails: {
        accountNumber: payload.bankDetails?.accountNumber || '',
        bankName: payload.bankDetails?.bankName || 'HDFC Bank Ltd',
        ifscCode: payload.bankDetails?.ifscCode || '',
        panNumber: payload.bankDetails?.panNumber || '',
        uanNumber: payload.bankDetails?.uanNumber || '',
        employeeCode: generateEmployeeCode(payload.department, nextSerial),
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
      status: 'Active',
    };

    const employee = await Employee.create(employeeDoc);

    // Create linked User account
    await User.create({
      loginId,
      email: payload.email,
      passwordHash: initialPassword, // will be hashed by pre-save hook
      role: 'EMPLOYEE',
      employeeId: employee._id,
      isFirstLogin: true,
    });

    // Notify admins
    await Notification.create({
      title: 'New Employee Account Created',
      message: `${payload.name} added with Login ID ${loginId}. Initial credentials generated.`,
      type: 'account',
    });

    res.status(201).json({
      success: true,
      employee,
      credentials: { loginId, initialPassword },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/employees/:id — Admin: full update, Employee: limited fields
export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    let updates = req.body;

    // Employees can only update their own limited fields
    if (req.user.role === 'EMPLOYEE') {
      const { residentialAddress, mobile, personalEmail, about, whatILoveAboutMyJob, interestsAndHobbies } = req.body;
      updates = { residentialAddress, mobile, personalEmail, about, whatILoveAboutMyJob, interestsAndHobbies };
      // Remove undefined keys
      Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);
    }

    const updated = await Employee.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });

    res.status(200).json({ success: true, employee: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/employees/:id — Deactivate (Admin only)
export const deactivateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status: 'Inactive' },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    // Also deactivate user account
    await User.findOneAndUpdate({ employeeId: req.params.id }, { isActive: false });

    res.status(200).json({ success: true, message: 'Employee deactivated.', employee });
  } catch (error) {
    next(error);
  }
};

// PUT /api/employees/:id/salary — Admin only
export const updateSalary = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: { salary: req.body } },
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found.' });

    await Notification.create({
      title: 'Salary Structure Updated',
      message: `Compensation structure updated for ${employee.name}.`,
      type: 'payroll',
      targetUserId: req.user._id,
    });

    res.status(200).json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};

// ─── Skills ────────────────────────────────────────────────────────────────────
export const addSkill = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $push: { skills: req.body } },
      { new: true }
    );
    res.status(200).json({ success: true, skills: employee.skills });
  } catch (error) {
    next(error);
  }
};

export const removeSkill = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $pull: { skills: { _id: req.params.skillId } } },
      { new: true }
    );
    res.status(200).json({ success: true, skills: employee.skills });
  } catch (error) {
    next(error);
  }
};

// ─── Certifications ────────────────────────────────────────────────────────────
export const addCertification = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $push: { certifications: req.body } },
      { new: true }
    );
    res.status(200).json({ success: true, certifications: employee.certifications });
  } catch (error) {
    next(error);
  }
};

export const removeCertification = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $pull: { certifications: { _id: req.params.certId } } },
      { new: true }
    );
    res.status(200).json({ success: true, certifications: employee.certifications });
  } catch (error) {
    next(error);
  }
};

// ─── Documents ─────────────────────────────────────────────────────────────────
export const addDocument = async (req, res, next) => {
  try {
    const doc = { ...req.body, uploadDate: getTodayDateString() };
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $push: { documents: doc } },
      { new: true }
    );
    res.status(200).json({ success: true, documents: employee.documents });
  } catch (error) {
    next(error);
  }
};

export const removeDocument = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $pull: { documents: { _id: req.params.docId } } },
      { new: true }
    );
    res.status(200).json({ success: true, documents: employee.documents });
  } catch (error) {
    next(error);
  }
};
