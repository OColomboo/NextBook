# Chat Safety Eval

## Purpose

Catch regressions in chat creation, message delivery, blocking, reports and attachments.

## Setup

Seed a buyer, seller, listing and an existing hidden chat entry for one participant.

## Cases

- Starting negotiation reopens the existing chat instead of creating a duplicate.
- Hidden `userChats` entries are restored when the chat is reopened.
- Text and image messages update the chat summary for both participants.
- Unread count increments for the receiver and clears on open.
- Blocking prevents new messages and attachments.
- Reporting creates an append-only report record.

## Pass Criteria

There is one chat id for the participant/listing pair and both user chat summaries stay consistent.
