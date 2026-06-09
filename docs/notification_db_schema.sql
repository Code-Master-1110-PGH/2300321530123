-- Notifications DB schema (Stage 2)
-- Postgres schema with indexes and sample queries

-- Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT,
  priority SMALLINT NOT NULL DEFAULT 1, -- 1=low,5=medium,10=high,20=critical
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB,
  channel TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scheduled_at TIMESTAMPTZ,
  score DOUBLE PRECISION DEFAULT 0 -- optional stored score for fast top-N
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at ON notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications (user_id) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_user_score ON notifications (user_id, score DESC);

-- Partitioning (example monthly partition strategy)
-- CREATE TABLE notifications_2026_06 PARTITION OF notifications FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

-- Sample insert (service-side)
-- INSERT INTO notifications (user_id, title, body, type, priority, metadata, channel, scheduled_at, score)
-- VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, created_at;

-- Compute score (example) and update after insert
-- UPDATE notifications SET score = (priority * 1000000) + (EXTRACT(EPOCH FROM (now()-created_at)) * -1)
-- WHERE id = $1;

-- Query: unread count
-- SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false;

-- Query: top-N by stored score
-- SELECT id, title, body, type, priority, is_read, created_at FROM notifications
-- WHERE user_id = $1
-- ORDER BY score DESC
-- LIMIT $2;

-- Query: list (cursor-based) - use created_at as cursor
-- SELECT * FROM notifications
-- WHERE user_id = $1 AND (created_at < $cursor OR $cursor IS NULL)
-- ORDER BY created_at DESC
-- LIMIT $limit;

-- Best practices notes:
-- 1) Maintain a Redis ZSET per user for top-N with score as the score value: ZADD notifications:{userId} <score> <notificationId>.
-- 2) On new notification: INSERT row, compute score, ZADD to Redis, and set TTL for the ZSET if needed.
-- 3) For unread counts: maintain a separate Redis counter key `unread:{userId}` updated atomically on writes/reads.
