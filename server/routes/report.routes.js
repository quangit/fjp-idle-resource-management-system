import express from 'express';
import { 
  getOverviewStats, 
  getDepartmentStats, 
  getSkillsStats,
  getTrendData,
  exportReport
} from '../controllers/report.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/overview', getOverviewStats);
router.get('/department', getDepartmentStats);
router.get('/skills', getSkillsStats);
router.get('/trends', getTrendData);
router.post('/export', authorize('Admin', 'RA', 'Manager'), exportReport);

export default router;
