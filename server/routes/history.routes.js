import express from 'express';
import { getHistory, getResourceHistory } from '../controllers/history.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Admin', 'RA', 'Manager'), getHistory);
router.get('/resource/:id', getResourceHistory);

export default router;
