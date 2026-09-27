import assert from "node:assert";
import { pickTwo } from "../segment.js";
import { runMerge } from "../merge.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("pickTwo returns two indexes", () => {
  assert.strictEqual(pickTwo([3, 1, 2]).length, 2);
});

check("runMerge returns segments", () => {
  assert.ok(Array.isArray(runMerge({ max_segments: 1, merges: 0, arrivals: [] }).segments));
});

check("runMerge returns merges", () => {
  assert.ok(Array.isArray(runMerge({ max_segments: 1, merges: 0, arrivals: [] }).merges));
});

check("render counts arrivals", () => {
  assert.strictEqual(typeof render({ max_segments: 1, merges: 0, arrivals: [] }).count, "number");
});

check("render exposes conserved flag", () => {
  assert.strictEqual(typeof render({ max_segments: 1, merges: 0, arrivals: [] }).conserved, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
