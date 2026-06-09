const fs = require('fs');
const path = require('path');
const axios = require('axios');

(async () => {
  try {
    const repoRoot = path.resolve(__dirname, '..');
    const envPath = path.join(repoRoot, '.env');
    const raw = fs.readFileSync(envPath, 'utf8');
    const lines = raw.split(/\r?\n/);
    let tokenParts = [];
    let collecting = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!collecting && line.startsWith('ACCESS_TOKEN=')) {
        collecting = true;
        tokenParts.push(line.replace('ACCESS_TOKEN=', ''));
        continue;
      }
      if (collecting) {
        if (/^[A-Z_]+=/.test(line)) break;
        tokenParts.push(line);
      }
    }
    let token = tokenParts.join('');
    token = token.replace(/\s+/g, '');

    const evidenceDir = path.join(repoRoot, 'evidence');
    if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir);

    const url = 'http://localhost:5000/api/logs';
    const body = { stack: 'backend', level: 'info', package: 'handler', message: 'test message from automation' };

    try {
      console.log('Token length:', token.length);
      // health check
      try {
        const h = await axios.get('http://localhost:5000/health', { timeout: 3000 });
        console.log('Health:', h.status);
      } catch (he) {
        console.warn('Health check failed:', he.message || he);
      }

      const res = await axios.post(url, body, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, validateStatus: () => true, timeout: 5000 });
      const out = `Status: ${res.status} ${res.statusText}\n${JSON.stringify(res.data, null, 2)}`;
      fs.writeFileSync(path.join(evidenceDir, 'log_response.txt'), out, 'utf8');
      console.log('Saved to evidence/log_response.txt');
      console.log(out);
    } catch (err) {
      let details = '';
      try { details += `name=${err.name} message=${err.message}\n`; } catch(e){}
      try { details += `stack=${err.stack}\n`; } catch(e){}
      try { if (err.response) details += `responseStatus=${err.response.status} responseData=${JSON.stringify(err.response.data)}\n`; } catch(e){}
      const out = `Error: ${details}`;
      fs.writeFileSync(path.join(evidenceDir, 'log_response.txt'), out, 'utf8');
      console.log(out);
    }
  } catch (err) {
    console.error('Script failed:', err);
    process.exit(1);
  }
})();
