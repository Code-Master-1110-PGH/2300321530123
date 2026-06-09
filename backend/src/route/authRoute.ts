import express from 'express';
import { register, authenticate } from '../handler/authHandler';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', register);

/**
 * POST /api/auth/authenticate
 * Authenticate and get access token
 */
router.post('/authenticate', authenticate);

export default router;
