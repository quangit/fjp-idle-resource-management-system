import express from 'express';
import { body } from 'express-validator';
import {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  uploadCV
} from '../controllers/resource.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getResources)
  .post(authorize('Admin', 'RA'), [
    body('employeeCode').notEmpty(),
    body('name').notEmpty(),
    body('email').isEmail(),
    body('department').isIn(['IT', 'QA', 'BA', 'HR', 'Design', 'DevOps']),
    body('jobTitle').notEmpty(),
    body('skills').isArray({ min: 1 }),
    body('rate').isNumeric(),
    body('idleFrom').isISO8601()
  ], createResource);

router.route('/:id')
  .get(getResource)
  .put(authorize('Admin', 'RA'), updateResource)
  .delete(authorize('Admin'), deleteResource);

router.post('/:id/cv', authorize('Admin', 'RA'), upload.single('cv'), uploadCV);

export default router;
