Stage 6/7 quick runbook
=======================

This repository contains the notification system design and a small frontend demo for Stage 7.

Frontend (local dev)
- Change to the frontend folder and start the app:

```bash
cd frontend
npm install
npm start
```

Open the app in your browser. Use the "Load sample inbox" button to view the Priority Inbox UI.

Worker verification (local)
- If you have Docker installed, bring up Postgres + Redis:

```powershell
docker compose up -d
# then run the worker test harness (Windows PowerShell)
node -r ./backend/node_modules/ts-node/register tools/test_worker_insert.ts
```

- If Docker is not available, a mock worker run is provided and its output is at `evidence/worker_test_mock_run.txt`.

Screenshots
- A PNG of the top notifications list was generated to `evidence/top_notifications.png` using `tools/generate_screenshots.js` (Puppeteer).
