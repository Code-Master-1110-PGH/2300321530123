const fs = require('fs');

function generateSampleNotifications(n = 5) {
  const now = Date.now();
  return Array.from({ length: n }).map((_, i) => ({
    id: `mock-${i + 1}`,
    user_id: `user-${(i % 3) + 1}`,
    type: i % 2 === 0 ? 'message' : 'alert',
    priority: Math.floor(Math.random() * 100),
    payload: { text: `This is mock notification ${i + 1}` },
    created_at: new Date(now - i * 1000).toISOString(),
  }));
}

async function mockInsertBatch(items) {
  // Simulate SQL batch insert and return success
  const sql = `INSERT INTO notifications (id, user_id, type, priority, payload, created_at) VALUES ${items
    .map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`)
    .join(', ')};`;
  const params = items.flatMap((it) => [it.id, it.user_id, it.type, it.priority, JSON.stringify(it.payload), it.created_at]);
  return { sql, params, rowCount: items.length };
}

(async () => {
  try {
    const items = generateSampleNotifications(8);
    const res = await mockInsertBatch(items);
    const out = `Mock insert executed:\nSQL: ${res.sql}\nParams length: ${res.params.length}\nInserted rows: ${res.rowCount}\n`;
    fs.writeFileSync('evidence/worker_test_mock_run.txt', out, { encoding: 'utf8' });
    console.log('Wrote evidence/worker_test_mock_run.txt');
    console.log(out);
  } catch (err) {
    console.error('Mock run error', err);
    process.exitCode = 1;
  }
})();
