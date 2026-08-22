import { employeeService } from './employee.service.js';

export class EmployeeController {
  constructor(service = employeeService) {
    this.service = service;
  }

  getEmployees = async (req, res, next) => {
    try {
      const result = await this.service.getAllEmployees({
        page: req.query.page ? parseInt(req.query.page, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit, 10) : 20,
        search: req.query.search,
        department: req.query.department,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
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
