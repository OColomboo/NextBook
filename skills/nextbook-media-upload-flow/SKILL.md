---
name: nextbook-media-upload-flow
description: Use when implementing image picker, camera or Firebase Storage upload behavior in NextBook.
---

# NextBook Media Upload Flow

Use one consistent upload path per domain:

- Listing covers: `listing-covers/{userId}/{timestamp}.jpg`
- Review covers: `review-covers/{userId}/{timestamp}.jpg`
- Chat attachments: `chat-attachments/{chatId}/{userId}/{timestamp}.jpg`

Checklist:

- Request the exact permission needed: media library or camera.
- Handle cancellation without surfacing an error.
- Preserve an existing remote image URL when editing and the user does not pick a new image.
- Normalize remote `http:` book cover URLs to `https:`.
- Fetch local URI as a blob, upload with `uploadBytes`, then store only the download URL in database records.
- Surface upload failures distinctly from validation failures.
- Update listing/review/chat evals for new media edge cases.
