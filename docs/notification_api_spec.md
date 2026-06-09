# Notification Service API Spec — Stage 1

Overview
- Purpose: deliver, list, update and stream user notifications with support for priority scoring and efficient top-N queries.
- Auth: service-to-service endpoints require a service Bearer token; user-facing endpoints require user Bearer token.

Common headers
- `Authorization: Bearer <token>`
- `X-Request-ID: <uuid>` (recommended)
- `Idempotency-Key: <key>` (for create/bulk endpoints)

Allowed values
- `priority`: `low` | `medium` | `high` | `critical`
- `type`: free-form string (recommended enum: `message`, `alert`, `reminder`, `transaction`)
- `level`: `info` | `warn` | `error`

Score calculation (for Priority Inbox)
- score = priorityWeight(priority) * 1_000_000 + recencyScore
- priorityWeight: low=1, medium=5, high=10, critical=20
- recencyScore: floor((now - createdAt) in seconds * decayFactor) (tunable)

Endpoints

1) Create single notification
- POST /api/notifications
- Auth: Service token
- Body JSON:
  {
    "notificationId"?: "string", // optional client idempotency
    "userId": "string",
    "title": "string",
    "body"?: "string",
    "type"?: "string",
    "priority": "low|medium|high|critical",
    "metadata"?: { ... },
    "channel"?: "inapp|email|push",
    "scheduledAt"?: "ISO timestamp"
  }
- Response: 201 Created
  { "notificationId":"<uuid>", "createdAt":"ISO" }
- Errors: 400, 401, 403, 409 (duplicate with same Idempotency-Key)

2) Bulk create
- POST /api/notifications/bulk
- Auth: Service token
- Body: array of the above objects (supports up to N items per request)
- Response: 207 Multi-Status or 201 with summary
- Support idempotency via `Idempotency-Key`

3) List notifications (cursor / cursor-based paging)
- GET /api/users/{userId}/notifications
- Auth: User token (must match userId or admin scope)
- Query params:
  - `limit` (default 20, max 200)
  - `cursor` (opaque cursor for next page)
  - `unreadOnly` (true|false)
  - `types` (comma-separated)
  - `minPriority` (low|medium|high|critical)
  - `sort` (`time_desc`|`score_desc`) — `score_desc` returns top-priority items first
- Response 200:
  {
    "notifications": [ { /* notification object */ } ],
    "nextCursor": "...",
    "limit": 20
  }

4) Get notification
- GET /api/users/{userId}/notifications/{notificationId}
- Auth: User token
- Response: 200 with notification object or 404

5) Mark read / unread
- POST /api/users/{userId}/notifications/{notificationId}/read
- Body: { "read": true }
- Response: 200 updated object
- Also: POST /api/users/{userId}/notifications/read (body: { ids: [...] }) for batch

6) Unread counts
- GET /api/users/{userId}/notifications/unread-count
- Response: { "total": 12, "byType": {"alert":3}, "byPriority": {"high":2} }

7) Real-time stream (SSE)
- GET /api/users/{userId}/notifications/stream
- Auth: User token
- Content-Type: `text/event-stream`
- Events:
  - `notification` (data: notification object)
  - `update` (data: { id, fields })
  - `delete` (data: { id })
  - `heartbeat`
- Alternatives: WebSocket at `/ws/notifications` (supports subscription messages)

8) Admin / moderation
- GET /api/notifications/search?query=... (admin)
- DELETE /api/notifications/{notificationId} (admin)

Rate limiting & quotas
- Service endpoints: enforce burst limits (e.g., 500 reqs/min) and per-user limits for create spam protection.

Idempotency & deduplication
- Support `Idempotency-Key` and optional `notificationId` supplied by clients to avoid duplicates.

Authentication & security
- Use OAuth2 Bearer tokens with scopes: `notifications:write`, `notifications:read`, `notifications:admin`.
- Validate `userId` matches token subject for user endpoints.
- Sanitize `metadata` and limit size to avoid abuse.

Observability
- Emit metrics: create_rate, delivery_latency, stream_connections, cache_hit_rate.
- Correlate requests via `X-Request-ID`.

Example curl (create)

curl -X POST https://api.example.com/api/notifications \
  -H "Authorization: Bearer <SERVICE_TOKEN>" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: abc-123" \
  -d '{"userId":"u123","title":"Payment received","body":"$10 credited","priority":"high","type":"transaction"}'

Example curl (stream SSE)

curl -N -H "Authorization: Bearer <USER_TOKEN>" https://api.example.com/api/users/u123/notifications/stream

Errors
- 400 Bad Request — validation failed
- 401 Unauthorized — missing/invalid token
- 403 Forbidden — insufficient scope / wrong user
- 404 Not Found — resource not found
- 409 Conflict — idempotency conflict
- 429 Too Many Requests — rate limited
- 500 Internal Server Error — unexpected

Notes
- Design favors eventual consistency for delivered state; unread counts are cached for low-latency reads (see Stage 4 doc).
- For top-N queries we maintain a Redis sorted-set per user updated on writes to provide O(log N) updates and fast top-N retrievals.
