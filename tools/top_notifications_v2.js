const axios = require('axios');

function scoreNotification(n) {
  const weightMap = { Placement: 3, Result: 2, Event: 1 };
  const weight = weightMap[n.Type] || 1;
  const created = new Date(n.Timestamp).getTime();
  const now = Date.now();
  const ageSeconds = Math.max(1, (now - created) / 1000);
  const recencyScore = 1 / ageSeconds;
  return weight * 1000000 + recencyScore * 1000;
}

async function fetchAndTop(apiUrl, studentID, n) {
  const limitParam = Math.min(Math.max(n || 10, 1), 10);
  const url = `${apiUrl}?studentID=${studentID}&limit=${limitParam}&page=1`;
  const token = process.env.ACCESS_TOKEN || '';
  const opts = { timeout: 10000 };
  if (token) opts.headers = { Authorization: `Bearer ${token}` };
  const res = await axios.get(url, opts);
  const items = res.data && res.data.notifications ? res.data.notifications : (res.data && res.data.data ? res.data.data : []);
  items.forEach(x => x._score = scoreNotification(x));
  items.sort((a,b) => b._score - a._score);
  return items.slice(0,n);
}

(async ()=>{
  try {
    const args = process.argv.slice(2);
    const n = parseInt(args[0] || '10', 10);
    const studentID = args[1] || '1042';
    const API = process.env.EVALUATION_SERVICE_URL || 'http://4.224.186.213/evaluation-service/notifications';
    const top = await fetchAndTop(API, studentID, n);
    console.log('Top', n, 'notifications for', studentID);
    top.forEach((t, idx) => {
      console.log(`${idx+1}. [${t.Type}] ${t.Message} (id=${t.ID}) Timestamp=${t.Timestamp} score=${t._score.toFixed(2)}`);
    });
  } catch (err) {
    if (err.response) console.error('ERR_RESP', err.response.status, JSON.stringify(err.response.data).slice(0,1000));
    else console.error('ERR', err.message || err);
    process.exit(1);
  }
})();
