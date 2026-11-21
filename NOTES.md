# NOTES

## Plan

Add `PUT /users/:id` to the in-memory Express API. The target behaviour is defined by `tests/update-user.test.js`:

- 200 with the updated user when the id exists and both `name` and `email` are sent.
- 400 when `name` or `email` is missing.
- 404 when no user has that id.

Implementation follows the existing patterns:

- `db/store.js`: `updateUser(id, { name, email })` reuses `getUserById`, changes the fields in place, keeps the id, and returns `undefined` when the user is missing.
- `routes/users.js`: the PUT handler validates the body with the same check as POST (`!name || !email`), then maps a missing user to 404 with `{ error: "User not found" }`.

## Model

Model reported by the session at the time of writing: **Haiku 5.5** (`claude-haiku-5-5`), as shown in the current environment. Earlier in the same conversation the environment said Sonnet 5.5 (`claude-sonnet-5-5`). This was not verified with `/model`, so the model should be confirmed before this file is relied on.

## Commit split

1. `feat(store): add updateUser helper`: `db/store.js` only.
2. `feat(users): add PUT /users/:id with validation and 404`: `routes/users.js`. The three PUT tests pass here.
3. `docs: add NOTES.md`: this file.
4. Review fixes, if the review finds anything real, followed by a commit that fills in the review section below.

Each commit carries a `Co-Authored-By` trailer.

## What the review caught

_Pending. This section is filled in only after `/code-review` has run on the branch diff, with what it actually reported._
