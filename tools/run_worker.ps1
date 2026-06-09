param()

# Run this from repository root. It starts the test worker harness against local Docker Postgres+Redis.
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error 'Docker not found in PATH. Please install Docker Desktop.'; exit 2
}

& docker compose up -d

# wait for Postgres to accept connections
Write-Output 'Waiting for Postgres to warm up (10s)...'
Start-Sleep -s 10

# set env for DB connection and run the TypeScript test harness
$env:DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/notifications'
$env:REDIS_URL = 'redis://localhost:6379'

Write-Output 'Running test worker harness (tools/test_worker_insert.ts)'
node -r ./backend/node_modules/ts-node/register tools/test_worker_insert.ts 2>&1 | Out-File -Encoding utf8 evidence\worker_test_run.txt
Write-Output 'Saved output to evidence\worker_test_run.txt'
