import React from 'react';
import NotificationsList from './NotificationsList';

export default function PriorityInbox({ items = [] }: { items?: any[] }) {
  // simple prioritization: sort by priority desc
  const sorted = [...items].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  const top = sorted.slice(0, 10);
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h2>Priority Inbox</h2>
      <NotificationsList items={top} />
    </div>
  );
}
