---
name: nextbook-screen-data-subscription
description: Use when creating or changing a NextBook screen that subscribes to Firebase Realtime Database data.
---

# NextBook Screen Data Subscription

Pattern for realtime screens:

- Start with explicit `loading`, `error` and empty states.
- Subscribe with `onValue` inside `useEffect`.
- Always return the unsubscribe function from the effect.
- Convert list snapshots with `Object.entries(snapshot.val() || {}).map(([id, item]) => ({ id, ...item }))`.
- Sort timestamps defensively because Firebase values may be missing during writes.
- Keep effect dependencies complete and stable.
- Prefer moving repeated subscription mapping into a service helper when a second screen needs it.
- Add an eval when missing params or empty data previously caused a crash.
