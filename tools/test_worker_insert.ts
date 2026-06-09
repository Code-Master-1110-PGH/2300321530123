import { insertNotificationsBatch } from '../backend/src/workers/notificationWorker.ts';

(async ()=>{
  try {
    // run in test mode: the worker uses real pool but tests should set NODE_ENV=test for a mock if implemented
    process.env.NODE_ENV = 'test';
    const items = [
      { user_id: 'u_test_1', title: 'T1', body: 'b1', type: 'test', priority: 1 },
      { user_id: 'u_test_2', title: 'T2', body: 'b2', type: 'test', priority: 2 }
    ];
    const res = await insertNotificationsBatch(items as any);
    console.log('insertNotificationsBatch result ->', res);
  } catch (e) {
    console.error('test failed', e);
    process.exit(1);
  }
})();
