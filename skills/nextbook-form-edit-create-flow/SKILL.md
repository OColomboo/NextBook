---
name: nextbook-form-edit-create-flow
description: Use when building or modifying NextBook create/edit forms such as book listings and reviews.
---

# NextBook Form Create/Edit Flow

Checklist:

- Derive edit mode from the route param id.
- Load the existing entity before allowing submit in edit mode.
- Keep controlled form state initialized for every field.
- Validate required fields before uploads or writes.
- Preserve existing image URLs unless a new local image was selected.
- Disable duplicate submits while saving.
- Navigate only after the write has completed.
- Update evals for required-field, edit-preserve and remote-lookup cases.
