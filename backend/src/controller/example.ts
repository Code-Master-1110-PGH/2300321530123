/**
 * Example controller for reference
 * Demonstrates how to structure controllers in the backend
 */

import { Request, Response } from 'express';
import Logger from '../../common/middleware/logger';

const logger = new Logger();

export const exampleController = async (req: Request, res: Response): Promise<void> => {
  try {
    await logger.debug('controller', 'Processing request', 'backend');

    // Business logic here

    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    await logger.error('controller', `Error: ${error.message}`, 'backend');
    res.status(500).json({ error: error.message });
  }
};
