# Listing Create/Edit Eval

## Purpose

Catch regressions in the book listing create/edit flow.

## Setup

Run with a test Firebase project or emulator data seeded with one authenticated seller and one existing listing.

## Cases

- Anonymous user cannot submit a listing.
- Required fields block submission before image upload.
- Sale listings require a price; trade listings do not.
- ISBN lookup can populate title, author, publisher, pages, genre and cover.
- Editing a listing without picking a new image preserves the existing remote cover URL.

## Pass Criteria

Each case leaves exactly one expected listing record and no orphaned Storage URL in the database.
