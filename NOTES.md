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

Ran `/code-review` (medium, up to 5 findings) on the branch diff. It reported two findings:

1. **Fixed (important).** PUT accepted non-string values and whitespace-only strings. For example, `{"name": {"first": "x"}, "email": "   "}` returned 200 and stored the object and the blank email. The README asks for rejection of "missing or invalid fields". Fix: PUT now requires non-empty strings, returns 400 otherwise, and saves trimmed values. Covered by `tests/update-user-validation.test.js`.
2. **Recorded, not rewritten (nit).** This file's model section disagrees with the `Co-Authored-By` trailers on the first three commits, which say Sonnet 5.5. Those commits are local and unpushed. Rewriting them was not done without asking. Commits from the fix onward use the Haiku 5.5 trailer that the current attribution reminder specifies.

Not changed: POST `/users` has the same weak check. The review noted it, but changing POST is outside this task, so it is left as a follow-up.

The review also confirmed that an unparseable id becomes `NaN`, which falls through to the 404 path, and that the in-place update keeps the id stable.
