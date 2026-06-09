const axios = require('axios');
(async ()=>{
  try {
    const token = process.env.ACCESS_TOKEN || '';
    const url = process.env.EVALUATION_SERVICE_URL || 'http://4.224.186.213/evaluation-service/notifications';
    const full = `${url}?studentID=1042&limit=10&page=1`;
    console.log('REQUEST URL ->', full);
    console.log('TOKEN LEN ->', token.length);
    const res = await axios.get(full, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
    console.log('STATUS', res.status);
    console.log('HEADERS', res.headers);
    console.log('DATA PREVIEW', JSON.stringify(res.data).slice(0,1000));
  } catch (err) {
    if (err.response) {
      console.error('ERR_RESP', err.response.status, JSON.stringify(err.response.data).slice(0,1000));
    } else {
      console.error('ERR', err.message);
    }
    process.exit(1);
  }
})();
