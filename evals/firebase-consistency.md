# Firebase Consistency Eval

## Purpose

Catch partial-write regressions in multi-path Firebase workflows.

## Setup

Use a seeded listing, saved listing records and negotiated listing records for two users.

## Cases

- Marking a listing as sold/traded creates the negotiated record and removes the public listing.
- A simulated failure does not leave duplicate public and negotiated states.
- Saving and unsaving a listing are idempotent.
- Removing a listing cleans up dependent user-visible references or leaves a documented tombstone.

## Pass Criteria

No listing is visible in contradictory states after any case.
