import { Request, Response } from 'express';
import Logger from '../../../common/middleware/logger';
import AuthService from '../../../common/auth/authService';

const logger = new Logger();
const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, rollNumber, gitHubUsername, accessCode, track } = req.body;

    if (!email || !rollNumber || !gitHubUsername || !accessCode || !track) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const result = await authService.register({
      email,
      rollNumber,
      gitHubUsername,
      accessCode,
      track
    });

    await logger.info('handler', `User registered: ${email}`, 'backend');
    res.status(200).json(result);
  } catch (error: any) {
    await logger.error('handler', `Registration failed: ${error.message}`, 'backend');
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
};

export const authenticate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientID, clientSecret } = req.body;

    if (!clientID || !clientSecret) {
      res.status(400).json({ error: 'Missing clientID or clientSecret' });
      return;
    }

    const result = await authService.authenticate(clientID, clientSecret);

    await logger.info('handler', `Authentication successful for client: ${clientID}`, 'backend');
    res.status(200).json(result);
  } catch (error: any) {
    await logger.error('handler', `Authentication failed: ${error.message}`, 'backend');
    res.status(401).json({ error: error.message || 'Authentication failed' });
  }
};
