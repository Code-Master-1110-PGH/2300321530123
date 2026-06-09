# Notification System — Stage 4: Performance Improvements

Summary:
- Introduce caching for unread counts and top-N queries using Redis.
- Add asynchronous batching for notification writes with a queue (Bull/Redis).
- Use proper DB indexes and partitioning for high-throughput reads/writes.
- Implement read-replica strategy for heavy read workloads.

Recommended changes to implement (code-level):

1) Caching unread counts (Redis, TTL 30s):

  - On read: check `GET unread:userid`; on miss, compute from DB, set cache.
  - On write (new notification/read): invalidate or update the cache atomically.

2) Top-N Priority Inbox caching:

  - Maintain a per-user sorted set (`ZADD`) of notification score (priority + recency).
  - Update set on write; read `ZREVRANGE` for top-N retrieval (O(log N) updates, O(N) reads).

3) Bulk write batching:

  - Use a worker queue (Bull) to group DB writes into batches (e.g., 500 rows) for insert performance.

4) DB-level improvements:

  - Partition notifications table by time (monthly) to prune/scale storage.
  - Add partial indexes for unread notifications and for columns used in priority calculation.

5) Observability and autoscaling:

  - Add Prometheus metrics (latency, queue depth, cache hit-rate) and autoscale consumers when queue depth grows.

Next steps to implement in repo:
- Add a small Redis-backed helper under `backend/src/utils/cache.ts`.
- Add queue worker scaffold `backend/src/workers/notificationWorker.ts` (Bull).
- Add integration tests for cache invalidation and top-N correctness.
