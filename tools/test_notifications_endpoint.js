const fs = require('fs');
const path = require('path');
const axios = require('axios');

(async ()=>{
  try {
    const repo = path.resolve(__dirname, '..');
    const env = fs.readFileSync(path.join(repo, '.env'), 'utf8');
    const m = env.match(/CLIENT_SECRET=(.+?)\r?\n/);
    const clientSecret = m ? m[1].trim() : '';
    if (!clientSecret) throw new Error('CLIENT_SECRET not found in .env');

    const payload = [
      { user_id: 'u_test_1', title: 'Test notification 1', body: 'hello', type: 'test', priority: 1 },
      { user_id: 'u_test_1', title: 'Test notification 2', body: 'hello2', type: 'test', priority: 2 }
    ];

    const url = 'http://localhost:5000/api/notifications';
    const res = await axios.post(url, payload, { headers: { Authorization: `Bearer ${clientSecret}` }, validateStatus: () => true, timeout: 10000 });
    console.log('STATUS', res.status);
    console.log(res.data);
  } catch (e) {
    console.error('Error', e.message || e);
    process.exit(1);
  }
})();
