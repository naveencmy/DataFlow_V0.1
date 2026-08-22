import { Router } from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  updateSalary,
  addSkill,
  removeSkill,
  addCertification,
  removeCertification,
  addDocument,
  removeDocument,
} from '../controllers/employees.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireAdmin, requireSelfOrAdmin } from '../middleware/role.middleware.js';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/', getEmployees);
router.post('/', requireAdmin, createEmployee);
router.get('/:id', requireSelfOrAdmin, getEmployee);
router.put('/:id', requireSelfOrAdmin, updateEmployee);
router.delete('/:id', requireAdmin, deactivateEmployee);
router.put('/:id/salary', requireAdmin, updateSalary);

// Skills
router.post('/:id/skills', requireSelfOrAdmin, addSkill);
router.delete('/:id/skills/:skillId', requireSelfOrAdmin, removeSkill);

// Certifications
router.post('/:id/certifications', requireSelfOrAdmin, addCertification);
router.delete('/:id/certifications/:certId', requireSelfOrAdmin, removeCertification);

// Documents
router.post('/:id/documents', requireSelfOrAdmin, addDocument);
router.delete('/:id/documents/:docId', requireSelfOrAdmin, removeDocument);

export default router;
