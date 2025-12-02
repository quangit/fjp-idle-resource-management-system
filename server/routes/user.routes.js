import express from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(authorize('Admin', 'RA', 'Manager'), getUsers)
  .post(authorize('Admin'), [
    body('username').notEmpty().isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['Admin', 'RA', 'Manager', 'Viewer'])
  ], createUser);

router.route('/:id')
  .get(authorize('Admin', 'RA', 'Manager'), getUser)
  .put(authorize('Admin'), updateUser)
  .delete(authorize('Admin'), deleteUser);

router.put('/:id/toggle-status', authorize('Admin'), toggleUserStatus);

export default router;
