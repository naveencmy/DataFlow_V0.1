import { Router } from 'express';
import { payrollController } from './payroll.controller.js';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware.js';
import { requireRole } from '../../shared/middlewares/role.middleware.js';

const router = Router();

router.use(authenticateJWT);

router.post('/process', requireRole(['ADMIN', 'HR']), payrollController.processMonthlyBatch);
router.get('/my', payrollController.getMyPayroll);
router.get('/:id/slip', payrollController.downloadPayslipPdf);
router.get('/:employeeId', (req, res, next) => {
  if (req.params.employeeId === 'my') return next();
  return payrollController.getMyPayroll({ ...req, user: { ...req.user, employeeId: req.params.employeeId } }, res, next);
});
router.get('/', payrollController.getAllPayroll);

export default router;
