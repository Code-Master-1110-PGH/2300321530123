import { Request, Response, NextFunction } from 'express';
import Logger from '../../common/middleware/logger';

const logger = new Logger();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization token' });
      return;
    }

    const token = authHeader.substring(7);
    logger.setAccessToken(token);

    // In production, validate token here
    next();
  } catch (error: any) {
    await logger.error('middleware', `Auth middleware error: ${error.message}`, 'backend');
    res.status(401).json({ error: 'Unauthorized' });
  }
};
