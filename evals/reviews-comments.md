# Reviews And Comments Eval

## Purpose

Catch regressions in review, save, like and comment workflows.

## Setup

Seed two users, one review and at least one comment owned by each user.

## Cases

- Owner can create, edit and delete a review.
- Non-owner cannot edit or delete another user's review.
- User can save and unsave a review idempotently.
- User can add, edit and delete their own comment.
- Non-owner comment actions are hidden or rejected.

## Pass Criteria

Review counters, saved records and comments match the visible UI after every action.
