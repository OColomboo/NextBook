---
name: nextbook-chat-safety-flow
description: Use when changing NextBook chat, blocking, reporting, unread, typing or attachment behavior.
---

# NextBook Chat Safety Flow

Checklist:

- Reopen an existing chat instead of creating duplicates for the same listing and participants.
- Restore `userChats/{uid}/{chatId}` if a user previously hid a conversation locally.
- Keep message writes and user chat summaries consistent.
- Clear or expire typing state so stale indicators do not persist.
- Enforce block checks before sending messages or attachments.
- Keep report writes append-only and timestamped.
- Use multi-path updates for unread counters and chat summaries when possible.
- Add or update chat evals for every behavior change.
