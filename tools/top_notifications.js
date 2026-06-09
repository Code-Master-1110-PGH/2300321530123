const axios = require('axios');

async function fetchNotifications(apiUrl, studentID) {
  const res = await axios.get(`${apiUrl}?studentID=${studentID}&limit=500&page=1`, { timeout: 10000 });
  return res.data && res.data.data ? res.data.data : [];
}

function scoreNotification(n) {
  const weightMap = { Placement: 3, Result: 2, Event: 1 };
  const weight = weightMap[n.type] || 1;
  const created = new Date(n.createdAt).getTime();
  const now = Date.now();
  const ageSeconds = Math.max(1, (now - created) / 1000);
  const recencyScore = 1 / ageSeconds; // newer -> larger
  return weight * 1000000 + recencyScore * 1000;
}

async function topN(apiUrl, studentID, n) {
  const items = await fetchNotifications(apiUrl, studentID);
  const unread = items.filter(x => !x.isRead);
  unread.forEach(x => x._score = scoreNotification(x));
  unread.sort((a,b) => b._score - a._score);
  return unread.slice(0,n);
}

// CLI runner
const args = process.argv.slice(2);
const n = parseInt(args[0] || '10', 10);
const studentID = args[1] || '1042';
const API = process.env.EVALUATION_SERVICE_URL || 'http://4.224.186.213/evaluation-service/notifications';

(async ()=>{
  try {
    const top = await topN(API, studentID, n);
    console.log('Top', n, 'notifications for', studentID);
    top.forEach((t, idx) => {
      console.log(`${idx+1}. [${t.type}] ${t.title} (isRead=${t.isRead}) createdAt=${t.createdAt}`);
    });
  } catch (err) {
    console.error('Failed:', err.message || err);
    process.exit(1);
  }
})();
