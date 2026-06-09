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

 
// GET /api/notifications/top?limit=10&page=1&notification_type=Placement
router.get('/top', async (req, res) => {
	try {
		const limit = Math.min(100, Number(req.query.limit) || 10);
		const page = Math.max(1, Number(req.query.page) || 1);
		const notificationType = (req.query.notification_type || '').toString();

		// If a cache or DB is configured, query it here. For portability we
		// return a filtered sample set when services are not available.
		const now = Date.now();
		let sample = Array.from({ length: 200 }).map((_, i) => ({
			id: `sample-${i + 1}`,
			user_id: `user-${(i % 5) + 1}`,
			type: i % 3 === 0 ? 'Placement' : i % 3 === 1 ? 'Result' : 'Event',
			priority: 100 - (i % 50),
			payload: { text: `Sample notification ${i + 1}` },
			created_at: new Date(now - i * 1000).toISOString(),
			isRead: i % 4 === 0,
		}));

		if (notificationType) {
			sample = sample.filter((s) => s.type.toLowerCase() === notificationType.toLowerCase());
		}

		// simple priority sorting: priority desc, then newest
		sample.sort((a, b) => (b.priority - a.priority) || (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));

		const start = (page - 1) * limit;
		const items = sample.slice(start, start + limit);

		return res.json({ items, count: sample.length, page, limit });
	} catch (err) {
		return res.status(500).json({ error: 'failed to fetch top notifications' });
	}
});
