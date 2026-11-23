// Run: npx tsx lib/products.check.ts
import assert from "node:assert";
import { PRODUCTS, familiesOf } from "./products";

const got = Object.fromEntries(PRODUCTS.map((p) => [p.handle, familiesOf(p).sort().join(",")]));
console.log(got);
assert.equal(got["liquid-brun"], "spicy,sweet"); // from its leading notes
assert.equal(got["monarque"], "sweet"); // no leading notes published: most-represented family
assert.ok(PRODUCTS.every((p) => familiesOf(p).length), "every perfume has a family");
