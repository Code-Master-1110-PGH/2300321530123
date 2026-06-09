Worker verification instructions
=============================

This document explains how to run a local Postgres+Redis stack and execute the worker test harness that inserts notification rows into Postgres. The repository already includes `tools/test_worker_insert.ts` which calls the exported `insertNotificationsBatch` helper.

Prerequisites
- Docker Desktop (or docker + docker-compose)
- Node.js (>=16) installed

Quick steps

1. From the repository root run:

```powershell
docker compose up -d
```

2. Wait ~10s for Postgres to warm up, then run the test harness which will use `DATABASE_URL` and `REDIS_URL`:

```powershell
#$env:DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/notifications'
#$env:REDIS_URL = 'redis://localhost:6379'

# run the test harness (Windows PowerShell)
# requires ts-node available under backend/node_modules (devDeps installed)
node -r ./backend/node_modules/ts-node/register tools/test_worker_insert.ts
```

3. Output will be saved to `evidence/worker_test_run.txt`. If the harness inserts rows successfully, you should see SQL success logs.

Notes
- If your backend `db/client.ts` expects a different env var (e.g., `DATABASE_URL` vs `PGHOST`), set both variants before running.
- Adminer is available at http://localhost:8080 to inspect the `notifications` database (username: `postgres`, password: `postgres`).
