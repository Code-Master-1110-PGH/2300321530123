Stage 4 scaffolding notes

- Redis helper: `backend/src/utils/cache.ts` (uses `ioredis`).
- Queue worker: `backend/src/workers/notificationWorker.ts` (uses `bull`).

How to run locally (dev):

1) Start a local Redis server (or set `REDIS_URL` env var).

2) Install optional deps in `backend`:

```powershell
cd backend
npm install --no-audit --no-fund ioredis bull --save-optional
```

3) Start worker (node):

```powershell
node -r ts-node/register backend/src/workers/notificationWorker.ts
```

Notes:
- The worker currently simulates DB writes; replace the simulated block with actual DB batch insert logic.
- Use `enqueueNotifications(items)` to add jobs from service endpoints.
