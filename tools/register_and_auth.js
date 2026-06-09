const fs = require('fs');
const path = require('path');
const axios = require('axios');

(async () => {
  try {
    const repoRoot = path.resolve(__dirname, '..');
    const envPath = path.join(repoRoot, '.env');
    const raw = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const getVar = (name) => {
      if (!raw) return '';
      const m = raw.match(new RegExp(`${name}=(.+?)\\r?\\n[A-Z_]+=`, 's')) || raw.match(new RegExp(`${name}=(.+)$`, 'm'));
      if (!m) return '';
      return m[1].replace(/\r|\n/g, '').trim();
    };

    const EVAL_URL = (getVar('EVALUATION_SERVICE_URL') || 'http://4.224.186.213/evaluation-service').replace(/\r|\n/g, '');

    const payload = {
      name: getVar('NAME') || 'mridul mishra',
      email: getVar('EMAIL') || 'mridul.23b1531172@abes.ac.in',
      rollNo: getVar('ROLLNO') || getVar('ROLL_NO') || '2300321530123',
      mobileNo: getVar('MOBILE') || getVar('MOBILE_NO') || '9999999999',
      gitHubUsername: getVar('GITHUB_USERNAME') || getVar('GITHub') || 'mridulmishra',
      accessCode: getVar('ACCESS_CODE') || getVar('ACCESSCODE') || 'cXuqht',
      track: getVar('TRACK') || 'fullstack'
    };

    const outDir = path.join(repoRoot, 'evidence');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    console.log('Registering with payload:', payload);
    const regRes = await axios.post(`${EVAL_URL}/register`, payload, { headers: { 'Content-Type': 'application/json' }, validateStatus: () => true, timeout: 10000 });
    const regOut = `Status: ${regRes.status} ${regRes.statusText}\n${JSON.stringify(regRes.data, null, 2)}`;
    fs.writeFileSync(path.join(outDir, 'register_response.txt'), regOut, 'utf8');
    console.log('Saved to evidence/register_response.txt');
    console.log(regOut);

    // determine clientID/secret
    let clientID = '';
    let clientSecret = '';
    if (regRes.data && regRes.data.clientID) clientID = regRes.data.clientID;
    if (regRes.data && regRes.data.clientSecret) clientSecret = regRes.data.clientSecret;
    if (!clientID) clientID = getVar('CLIENT_ID');
    if (!clientSecret) clientSecret = getVar('CLIENT_SECRET');

    const authPayload = {
      name: payload.name,
      email: payload.email,
      rollNo: payload.rollNo,
      accessCode: payload.accessCode,
      clientID,
      clientSecret
    };

    console.log('Authenticating with payload:', { ...authPayload, clientSecret: clientSecret ? '***' : '' });
    const authRes = await axios.post(`${EVAL_URL}/auth`, authPayload, { headers: { 'Content-Type': 'application/json' }, validateStatus: () => true, timeout: 10000 });
    const authOut = `Status: ${authRes.status} ${authRes.statusText}\n${JSON.stringify(authRes.data, null, 2)}`;
    fs.writeFileSync(path.join(outDir, 'auth_response.txt'), authOut, 'utf8');
    console.log('Saved to evidence/auth_response.txt');
    console.log(authOut);
  } catch (err) {
    console.error('Script failed:', err.message || err);
    process.exit(1);
  }
})();
