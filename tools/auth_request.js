const fs = require('fs');
const path = require('path');
const axios = require('axios');

(async () => {
  try {
    const repoRoot = path.resolve(__dirname, '..');
    const envPath = path.join(repoRoot, '.env');
    const raw = fs.readFileSync(envPath, 'utf8');

    const getVar = (name) => {
      const m = raw.match(new RegExp(`${name}=(.+?)\\r?\\n[A-Z_]+=`, 's')) || raw.match(new RegExp(`${name}=(.+)$`, 'm'));
      if (!m) return '';
      return m[1].replace(/\s+/g, '');
    };

    const CLIENT_ID = getVar('CLIENT_ID');
    const CLIENT_SECRET = getVar('CLIENT_SECRET');
    const EVAL_URL = (getVar('EVALUATION_SERVICE_URL') || 'http://4.224.186.213/evaluation-service').replace(/\r|\n/g, '');

    // Try to get required auth fields from .env, otherwise fallback to known defaults
    const NAME = getVar('NAME') || getVar('USER_NAME') || 'mridul mishra';
    const EMAIL = getVar('EMAIL') || 'mridul.23b1531172@abes.ac.in';
    const ROLLNO = getVar('ROLLNO') || getVar('ROLL_NO') || '2300321530123';
    const ACCESS_CODE = getVar('ACCESS_CODE') || getVar('ACCESSCODE') || 'cXuqht';

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('Missing CLIENT_ID or CLIENT_SECRET in .env');
      process.exit(1);
    }

    const payload = { name: NAME, email: EMAIL, rollNo: ROLLNO, accessCode: ACCESS_CODE, clientID: CLIENT_ID, clientSecret: CLIENT_SECRET };

    const outDir = path.join(repoRoot, 'evidence');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    const res = await axios.post(`${EVAL_URL}/auth`, payload, { headers: { 'Content-Type': 'application/json' }, validateStatus: () => true, timeout: 10000 });

    const out = `Status: ${res.status} ${res.statusText}\n${JSON.stringify(res.data, null, 2)}`;
    fs.writeFileSync(path.join(outDir, 'auth_response.txt'), out, 'utf8');
    console.log('Saved to evidence/auth_response.txt');
    console.log(out);
  } catch (err) {
    console.error('Request failed:', err.message || err);
    process.exit(1);
  }
})();
