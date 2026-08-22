import { Router } from 'express';
import { employeeController } from './employee.controller.js';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware.js';
import { requireRole } from '../../shared/middlewares/role.middleware.js';

const router = Router();

router.use(authenticateJWT);

router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', requireRole(['ADMIN', 'HR']), employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.patch('/:id', employeeController.updateEmployee);
router.put('/:id/salary', requireRole(['ADMIN', 'HR']), employeeController.updateSalary);
router.post('/:id/documents', employeeController.addDocument);
router.delete('/:id/documents/:docId', employeeController.removeDocument);
router.delete('/:id', requireRole(['ADMIN']), employeeController.deleteEmployee);

export default router;
