import { Router } from 'express';
import {
  getPayroll,
  getEmployeePayroll,
  processMonthlyPayroll,
  updatePayrollStatus,
} from '../controllers/payroll.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getPayroll);
router.get('/:employeeId', getPayroll);
router.post('/process', requireAdmin, processMonthlyPayroll);
router.put('/:id/status', requireAdmin, updatePayrollStatus);

export default router;
