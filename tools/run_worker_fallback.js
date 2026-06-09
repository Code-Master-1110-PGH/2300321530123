const { execSync } = require('child_process');
const fs = require('fs');

function dockerAvailable() {
  try {
    execSync('docker --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  if (dockerAvailable()) {
    console.log('Docker found — starting docker-compose and worker test.');
    try {
      execSync('docker compose up -d', { stdio: 'inherit' });
      // wait a bit
      await new Promise((r) => setTimeout(r, 10000));
      console.log('Running worker test harness...');
      execSync('node -r ./backend/node_modules/ts-node/register tools/test_worker_insert.ts', { stdio: 'inherit' });
      console.log('Worker harness finished; check evidence/test_worker_insert_final_run.txt');
    } catch (err) {
      console.error('Error running docker worker path', err);
    }
  } else {
    console.log('Docker not available — running mock worker and saving evidence.');
    try {
      execSync('node tools/test_worker_insert_mock.js', { stdio: 'inherit' });
      const out = fs.readFileSync('evidence/worker_test_mock_run.txt', 'utf8');
      console.log('\nMock run output:\n', out);
    } catch (err) {
      console.error('Mock worker failed', err);
    }
  }
}

main();
