import Queue from 'bull';
import pool from '../db/client';

// Queue name: notification-writes
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const notificationQueue = new Queue('notification-writes', { redis: { url: redisUrl } } as any);

// Helper: batch-insert notifications into Postgres
async function getPool() {
  if (process.env.NODE_ENV === 'test') {
    // mock pool for test mode
    return {
      query: async (q: string, vals?: any[]) => {
        console.log('MOCK QUERY', q.substring(0, 200));
        return { rowCount: (vals ? Math.ceil(vals.length / 10) : 0) };
      }
    } as any;
  }
  return pool;
}

export async function insertNotificationsBatch(items: any[]) {
  if (!items || items.length === 0) return { ok: true, written: 0 };
  // columns: user_id, title, body, type, priority, metadata, channel, created_at, scheduled_at, score
  const cols = ['user_id','title','body','type','priority','metadata','channel','created_at','scheduled_at','score'];
  const values: any[] = [];
  const placeholders: string[] = [];
  items.forEach((it, i) => {
    const base = i * cols.length;
    const createdAt = it.created_at || it.createdAt || new Date().toISOString();
    const scheduledAt = it.scheduled_at || it.scheduledAt || null;
    const score = typeof it.score === 'number' ? it.score : null;
    // push values in order of cols
    values.push(
      it.user_id || it.userId || it.user || null,
      it.title || it.Title || '',
      it.body || it.Body || null,
      it.type || it.Type || null,
      it.priority || it.Priority || 1,
      JSON.stringify(it.metadata || it.Metadata || {}),
      it.channel || it.Channel || null,
      createdAt,
      scheduledAt,
      score
    );
    const ph = cols.map((_, j) => `$${base + j + 1}`);
    placeholders.push(`(${ph.join(',')})`);
  });

  const query = `INSERT INTO notifications (${cols.join(',')}) VALUES ${placeholders.join(',')} RETURNING id`;
  try {
    const p = await getPool();
    const res = await p.query(query, values);
    return { ok: true, written: res.rowCount };
  } catch (e) {
    console.error('DB insert failed', e);
    throw e;
  }
}

// Job data shape: { notifications: [ { user_id, title, body, type, priority, metadata } ] }
notificationQueue.process(5, async (job) => {
  const data = job.data;
  const items = data.notifications || [];
  console.log('Worker processing job id=', job.id, 'count=', items.length);
  try {
    const result = await insertNotificationsBatch(items);
    return result;
  } catch (e) {
    console.error('Worker failed', e);
    throw e;
  }
});

notificationQueue.on('completed', (job, result) => {
  console.log('Job completed', job.id, result);
});

notificationQueue.on('failed', (job, err) => {
  console.error('Job failed', job?.id, err.message || err);
});

export function enqueueNotifications(items: any[]) {
  // chunk and add
  const chunkSize = 200;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    notificationQueue.add({ notifications: chunk }, { attempts: 3, backoff: 5000 });
  }
}

export function closeWorker() {
  return notificationQueue.close();
}

export default { enqueueNotifications, closeWorker };
