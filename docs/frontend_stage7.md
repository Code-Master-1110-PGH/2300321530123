Stage 7: Frontend UI (Priority Inbox)
====================================

Files added:
- `frontend/src/components/NotificationsList.tsx`
- `frontend/src/components/PriorityInbox.tsx`

How to wire into the existing frontend:

1. Import `PriorityInbox` into `frontend/src/App.tsx` (or your main page) and provide a sample `items` prop (or fetch from `/api/notifications`):

```tsx
import PriorityInbox from './components/PriorityInbox';

function App() {
  const sample = [
    { id: '1', type: 'message', priority: 50, payload: { text: 'Hello' }, created_at: new Date().toISOString() },
  ];
  return <PriorityInbox items={sample} />;
}
```

2. Start the frontend:

```bash
cd frontend
npm start
```

Demo video instructions
- Start backend and frontend.
- Use `tools/top_notifications_v2.js` to fetch top notifications and show the list.
- Record the browser window showing `PriorityInbox` using any screen recorder for ~30s while you interact (mark read, open items).
