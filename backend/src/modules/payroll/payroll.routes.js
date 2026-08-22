import { Router } from 'express';
import { payrollController } from './payroll.controller.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware.js';
import { requireRole } from '../../shared/middlewares/role.middleware.js';
import { processPayrollSchema, queryPayrollSchema } from './payroll.validation.js';

const router = Router();

router.use(authenticateJWT);

router.post('/process', requireRole(['ADMIN', 'HR']), validate(processPayrollSchema), payrollController.processMonthlyBatch);
router.get('/my', payrollController.getMyPayroll);
router.get('/', requireRole(['ADMIN', 'HR']), validate(queryPayrollSchema, 'query'), payrollController.getAllPayroll);
router.get('/:id/slip', payrollController.downloadPayslipPdf);

export default router;
