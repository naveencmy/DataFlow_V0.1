import { Router } from 'express';
import { employeeController } from './employee.controller.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware.js';
import { requireRole } from '../../shared/middlewares/role.middleware.js';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  queryEmployeeSchema,
} from './employee.validation.js';

const router = Router();

router.use(authenticateJWT);

router.get('/', validate(queryEmployeeSchema, 'query'), employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', requireRole(['ADMIN', 'HR']), validate(createEmployeeSchema), employeeController.createEmployee);
router.patch('/:id', validate(updateEmployeeSchema), employeeController.updateEmployee);
router.delete('/:id', requireRole(['ADMIN']), employeeController.deleteEmployee);

export default router;
