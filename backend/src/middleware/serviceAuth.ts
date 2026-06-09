import { Request, Response, NextFunction } from 'express';

/**
 * Simple service-to-service auth middleware.
 * Accepts Authorization: Bearer <SERVICE_TOKEN>
 * SERVICE_TOKEN is read from process.env.SERVICE_TOKEN or process.env.CLIENT_SECRET
 */
export function serviceAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.slice('Bearer '.length).trim();
  const allowed = (process.env.SERVICE_TOKEN || process.env.CLIENT_SECRET || '').trim();
  if (!allowed) {
    console.warn('serviceAuth: no SERVICE_TOKEN/CLIENT_SECRET configured, rejecting request');
    return res.status(403).json({ error: 'Service auth not configured' });
  }
  if (token !== allowed) return res.status(401).json({ error: 'Invalid service token' });
  return next();
}

export default serviceAuthMiddleware;
