import React from 'react';

export default function NotificationsList({ items = [] }: { items?: any[] }) {
  return (
    <div style={{ padding: 12 }}>
      <h3>Notifications</h3>
      <ul>
        {items.map((it: any) => (
          <li key={it.id}>
            <strong>{it.type}</strong> — {it.payload?.text || JSON.stringify(it.payload)} <em>({it.priority})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
