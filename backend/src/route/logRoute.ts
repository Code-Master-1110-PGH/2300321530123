import express from 'express';
import { createLog } from '../controller/logController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/logs
 * Create a new log entry (protected route)
 */
router.post('/', authMiddleware, createLog);

export default router;
