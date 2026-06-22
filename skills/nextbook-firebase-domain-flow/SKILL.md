---
name: nextbook-firebase-domain-flow
description: Use when adding or changing NextBook Firebase domain writes for listings, reviews, saves, chats, reports or negotiated listings.
---

# NextBook Firebase Domain Flow

Use service helpers for new multi-step Firebase behavior instead of adding more database logic directly in screens.

Checklist:

- Keep paths consistent with `docs/03-firebase-banco-integracoes.md`.
- Use `serverTimestamp()` for created/updated activity fields.
- Prefer multi-path `update(ref(db), updates)` when one user action touches multiple paths.
- Preserve ownership checks in UI and data writes.
- Return plain domain objects to screens; keep Firebase snapshots and refs inside helpers.
- Add or update an eval in `evals/` when the workflow could duplicate, orphan or lose data.

Important paths:

- `bookListings/{listingId}`
- `savedListings/{uid}/{listingId}`
- `negotiatedListings/{uid}/{listingId}`
- `reviews/{reviewId}`
- `savedReviews/{uid}/{reviewId}`
- `chats/{chatId}`
- `userChats/{uid}/{chatId}`
- `blockedUsers/{uid}/{otherUid}`
- `reports/{reportId}`
