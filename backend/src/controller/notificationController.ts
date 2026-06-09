import { Request, Response } from 'express';
import worker from '../workers/notificationWorker';

export async function createNotifications(req: Request, res: Response) {
  try {
    const body = req.body;
    const items = Array.isArray(body) ? body : [body];
    // basic validation
    const valid = items.every(it => it && (it.user_id || it.userId || it.user));
    if (!valid) return res.status(400).json({ error: 'Each notification must have a user_id' });

    worker.enqueueNotifications(items);
    return res.status(202).json({ enqueued: items.length });
  } catch (e: any) {
    console.error('createNotifications error', e);
    return res.status(500).json({ error: 'internal' });
  }
}

export default { createNotifications };
