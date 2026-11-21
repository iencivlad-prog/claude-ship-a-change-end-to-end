// Extra checks for PUT /users/:id input validation (non-strings, blank values).

const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");

const app = require("../server");

test("PUT /users/:id rejects a non-string name with 400", async () => {
  const res = await request(app)
    .put("/users/1")
    .send({ name: { first: "x" }, email: "ada@example.com" });

  assert.strictEqual(res.status, 400);
});

test("PUT /users/:id rejects a whitespace-only email with 400", async () => {
  const res = await request(app)
    .put("/users/1")
    .send({ name: "Ada Lovelace", email: "   " });

  assert.strictEqual(res.status, 400);
});

test("PUT /users/:id trims surrounding whitespace before saving", async () => {
  const res = await request(app)
    .put("/users/1")
    .send({ name: "  Ada L.  ", email: " ada.l@example.com " });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.name, "Ada L.");
  assert.strictEqual(res.body.email, "ada.l@example.com");
});
