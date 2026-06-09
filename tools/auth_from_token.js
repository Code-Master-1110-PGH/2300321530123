const fs = require('fs');
const path = require('path');
const axios = require('axios');

function base64urlDecode(input) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) input += '=';
  return Buffer.from(input, 'base64').toString('utf8');
}

(async () => {
  try {
    const repoRoot = path.resolve(__dirname, '..');
    const envPath = path.join(repoRoot, '.env');
    if (!fs.existsSync(envPath)) throw new Error('.env not found');
    const raw = fs.readFileSync(envPath, 'utf8');

    // extract ACCESS_TOKEN (multiline)
    const m = raw.match(/ACCESS_TOKEN=(.+?)(?:\r?\n[A-Z_]+=|$)/s);
    if (!m) throw new Error('ACCESS_TOKEN not found in .env');
    const tokenRaw = m[1].replace(/\s+/g, '');
    const parts = tokenRaw.split('.');
    if (parts.length < 2) throw new Error('ACCESS_TOKEN appears invalid');
    const payload = JSON.parse(base64urlDecode(parts[1]));

    const name = payload.name || payload.Name || payload.name || '';
    const email = payload.email || payload.Email || '';
    const rollNo = payload.rollNo || payload.rollno || payload.rollNumber || payload.sub || '';
    const accessCode = payload.accessCode || payload.access_code || '';
    const clientID = payload.clientID || payload.clientId || process.env.CLIENT_ID || '';

    // also read CLIENT_SECRET from .env if not in token
    const csMatch = raw.match(/CLIENT_SECRET=(.+?)\r?\n/);
    const clientSecretFromEnv = csMatch ? csMatch[1].trim() : '';
    const clientSecret = payload.clientSecret || payload.client_secret || clientSecretFromEnv || '';

    const EVAL_URL = ( (raw.match(/EVALUATION_SERVICE_URL=(.+?)\r?\n/) || [])[1] || 'http://4.224.186.213/evaluation-service' ).replace(/\r|\n/g, '');

    const authPayload = { name, email, rollNo, accessCode, clientID, clientSecret };

    const outDir = path.join(repoRoot, 'evidence');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    fs.writeFileSync(path.join(outDir, 'auth_payload_used.txt'), JSON.stringify(authPayload, null, 2), 'utf8');

    const res = await axios.post(`${EVAL_URL}/auth`, authPayload, { headers: { 'Content-Type': 'application/json' }, validateStatus: () => true, timeout: 10000 });
    const out = `Status: ${res.status} ${res.statusText}\n${JSON.stringify(res.data, null, 2)}`;
    fs.writeFileSync(path.join(outDir, 'auth_response_from_token.txt'), out, 'utf8');
    console.log('Saved to evidence/auth_response_from_token.txt');
    console.log(out);
  } catch (err) {
    console.error('Script failed:', err.message || err);
    process.exit(1);
  }
})();
