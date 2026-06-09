import { Request, Response } from 'express';
import Logger from '../../../common/middleware/logger';

const logger = new Logger();

export const createLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stack, level, package: pkg, message } = req.body;

    // Validate required fields
    if (!stack || !level || !pkg || !message) {
      res.status(400).json({ error: 'Missing required fields: stack, level, package, message' });
      return;
    }

    // Log the incoming request
    await logger.info('controller', `Received log request: ${message}`, 'backend');

    // Mock response - in production, this would be saved to database
    const logID = generateUUID();

    res.status(200).json({
      logID,
      message: 'log created successfully'
    });
  } catch (error: any) {
    await logger.error('controller', `Error creating log: ${error.message}`, 'backend');
    res.status(500).json({ error: error.message || 'Failed to create log' });
  }
};

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
