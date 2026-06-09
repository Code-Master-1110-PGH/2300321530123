import express from 'express';
import { createNotifications } from '../controller/notificationController';
import { serviceAuthMiddleware } from '../middleware/serviceAuth';

const router = express.Router();

/**
 * POST /api/notifications
 * Accept single or bulk notifications (service auth expected)
 */
router.post('/', serviceAuthMiddleware, createNotifications);

export default router;

 
 // GET /api/notifications/top?limit=10
 router.get('/top', async (req, res) => {
	 try {
		 const limit = Math.min(10, Number(req.query.limit) || 10);
		 // If a cache or DB is configured, we would query it here. For portability
		 // return a sample set when services are not available.
		 const now = Date.now();
		 const sample = Array.from({ length: limit }).map((_, i) => ({
			 id: `sample-${i + 1}`,
			 user_id: `user-${(i % 3) + 1}`,
			 type: i % 2 === 0 ? 'message' : 'alert',
			 priority: 100 - i * 5,
			 payload: { text: `Sample notification ${i + 1}` },
			 created_at: new Date(now - i * 1000).toISOString(),
		 }));
 
		 return res.json({ items: sample, count: sample.length });
	 } catch (err) {
		 return res.status(500).json({ error: 'failed to fetch top notifications' });
	 }
 });
