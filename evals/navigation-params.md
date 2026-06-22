# Navigation Params Eval

## Purpose

Catch crashes caused by missing or invalid route params.

## Setup

Open each screen directly in a dev harness or by forcing `currentScreen` and `screenParams` in `src/AppRoot.js`.

## Cases

- `bookDetail` handles missing `book`.
- `chatConversation` handles missing or unknown `chatId`.
- `add` handles missing, valid and unknown `listingId`.
- `review` handles missing, valid and unknown `reviewId`.
- Main drawer/tab destinations match registered screen keys.

## Pass Criteria

Invalid params show a safe fallback or navigate back without throwing.
