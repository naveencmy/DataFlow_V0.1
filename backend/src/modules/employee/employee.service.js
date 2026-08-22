import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { employeeRepository } from './employee.repository.js';
import { authRepository } from '../auth/auth.repository.js';
import { generateSystemLoginId, generateInitialPassword } from '../../shared/utils/idGenerator.js';
import { buildDefaultSalaryComponents } from '../../shared/utils/salaryEngine.js';
import { sendWelcomeEmail } from '../../shared/utils/emailService.js';
import {
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
} from '../../shared/errors/AppError.js';

export class EmployeeService {
  constructor(repo = employeeRepository) {
    this.repo = repo;
  }

  async getAllEmployees(params) {
    return this.repo.findAll(params);
  }

  async getEmployeeById(id, requestingUser) {
    const employee = await this.repo.findById(id);
    if (!employee) {
      throw new NotFoundError(`Employee with ID ${id} not found`);
    }

    // Role-based visibility: regular employees can view peers or their own full profile
    return employee;
  }

  async createEmployee(data) {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('An employee with this email address already exists');
    }

    const count = await this.repo.countAll();
    const loginId = generateSystemLoginId(data.name, data.company, new Date().getFullYear(), [
      { loginId: `OITEMP${new Date().getFullYear()}${String(count).padStart(4, '0')}` },
    ]);

    const initialPassword = generateInitialPassword();
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(initialPassword, salt);

    const userId = randomUUID();
    const employeeId = `emp-${count + 1}`;

    const wage = Number(data.salary?.monthlyWage) || 60000;
    const salaryStructure = {
      wageType: data.salary?.wageType || 'Fixed Wage',
      monthlyWage: wage,
      annualWage: wage * 12,
      components: data.salary?.components || buildDefaultSalaryComponents(wage),
      employeePFPercentage: data.salary?.employeePFPercentage ?? 12,
      employerPFPercentage: data.salary?.employerPFPercentage ?? 12,
      professionalTax: data.salary?.professionalTax ?? 200,
      workingDaysPerWeek: data.salary?.workingDaysPerWeek ?? 5,
      breakTimeMinutes: data.salary?.breakTimeMinutes ?? 60,
    };

    const created = await this.repo.create({
      user: {
        id: userId,
        email: data.email,
        loginId,
        passwordHash,
        role: 'EMPLOYEE',
        isEmailVerified: true,
      },
      employee: {
        id: employeeId,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        profilePicture: data.profilePicture,
        department: data.department,
        jobPosition: data.jobPosition,
        manager: data.manager,
        location: data.location,
        company: data.company,
        dateOfJoining: data.dateOfJoining,
        dateOfBirth: data.dateOfBirth,
        residentialAddress: data.residentialAddress,
        nationality: data.nationality,
        personalEmail: data.personalEmail,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        about: data.about,
        whatILoveAboutMyJob: data.whatILoveAboutMyJob,
        interestsAndHobbies: data.interestsAndHobbies,
        skills: data.skills || [],
        certifications: data.certifications || [],
        documents: data.documents || [],
        bankDetails: data.bankDetails || {},
        salary: salaryStructure,
      },
    });

    sendWelcomeEmail(data.email, data.name, loginId, initialPassword).catch(() => {});

    return created;
  }

  async updateEmployee(id, updates, requestingUser) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with ID ${id} not found`);
    }

    const isPrivileged = requestingUser.role === 'ADMIN' || requestingUser.role === 'HR';
    const isSelf = existing.id === requestingUser.employeeId || existing.userId === requestingUser.userId;

    if (!isPrivileged && !isSelf) {
      throw new ForbiddenError('You can only edit your own employee profile');
    }

    // FIELD-LEVEL PERMISSION ENFORCEMENT
    if (!isPrivileged && isSelf) {
      const restrictedFields = [
        'salary',
        'department',
        'jobPosition',
        'manager',
        'company',
        'dateOfJoining',
        'bankDetails',
        'email',
      ];

      for (const field of restrictedFields) {
        if (updates[field] !== undefined) {
          throw new ForbiddenError(
            `Field '${field}' is restricted. Only Admins or HR Officers can modify this information.`
          );
        }
      }
    }

    const updated = await this.repo.update(id, updates);
    return updated;
  }

  async deleteEmployee(id) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with ID ${id} not found`);
    }

    await this.repo.delete(id);
    return { success: true, message: `Employee ${id} deleted successfully` };
  }
}

export const employeeService = new EmployeeService();
export default employeeService;
