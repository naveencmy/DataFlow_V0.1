import { employeeService } from './employee.service.js';
import { randomUUID } from 'crypto';

export class EmployeeController {
  constructor(service = employeeService) {
    this.service = service;
  }

  getEmployees = async (req, res, next) => {
    try {
      const result = await this.service.getAllEmployees({
        page: req.query.page ? parseInt(req.query.page, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit, 10) : 100,
        search: req.query.search,
        department: req.query.department,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        employees: result.data,
        pagination: result.pagination,
        count: result.pagination.total,
      });
    } catch (error) {
      next(error);
    }
  };

  getEmployeeById = async (req, res, next) => {
    try {
      const employee = await this.service.getEmployeeById(req.params.id, req.user);
      res.status(200).json({
        success: true,
        data: employee,
        employee,
      });
    } catch (error) {
      next(error);
    }
  };

  createEmployee = async (req, res, next) => {
    try {
      const created = await this.service.createEmployee(req.body);
      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: created,
        employee: created,
      });
    } catch (error) {
      next(error);
    }
  };

  updateEmployee = async (req, res, next) => {
    try {
      const updated = await this.service.updateEmployee(req.params.id, req.body, req.user);
      res.status(200).json({
        success: true,
        message: 'Employee profile updated successfully',
        data: updated,
        employee: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  updateSalary = async (req, res, next) => {
    try {
      const updated = await this.service.updateEmployee(
        req.params.id,
        { salary: req.body },
        req.user
      );
      res.status(200).json({
        success: true,
        message: 'Salary structure updated successfully',
        data: updated,
        employee: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  addDocument = async (req, res, next) => {
    try {
      const emp = await this.service.getEmployeeById(req.params.id, req.user);
      const docs = Array.isArray(emp.documents) ? [...emp.documents] : [];
      const newDoc = {
        id: randomUUID(),
        title: req.body.title || 'Document',
        fileName: req.body.fileName || 'file.pdf',
        fileSize: req.body.fileSize || '1.0 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        category: req.body.category || 'General',
        url: req.body.url || null,
      };
      docs.push(newDoc);

      const updated = await this.service.updateEmployee(req.params.id, { documents: docs }, req.user);
      res.status(201).json({
        success: true,
        data: newDoc,
        documents: updated.documents,
      });
    } catch (error) {
      next(error);
    }
  };

  removeDocument = async (req, res, next) => {
    try {
      const emp = await this.service.getEmployeeById(req.params.id, req.user);
      const docs = (emp.documents || []).filter(d => d.id !== req.params.docId);

      const updated = await this.service.updateEmployee(req.params.id, { documents: docs }, req.user);
      res.status(200).json({
        success: true,
        message: 'Document removed',
        documents: updated.documents,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteEmployee = async (req, res, next) => {
    try {
      const result = await this.service.deleteEmployee(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export const employeeController = new EmployeeController();
export default employeeController;
