// Run: npx tsx lib/bottleRow.check.ts
import assert from "node:assert";
import { layoutRow, type Alt } from "./bottleRow";

const original = { aspect: 0.48 };
const alts: Alt[] = [0.36, 0.45, 0.5, 0.42, 0.55].map((aspect, i) => ({ aspect, group: [0, 0, 1, 1, 2][i] }));
const right = (p: { left: number; width: number }) => p.left + p.width;

for (const width of [240, 360, 640, 1200]) {
  const r = layoutRow(original, alts, width, 600);
  const row = [r.original, ...r.alts];
  row.slice(1).forEach((p, i) => assert.ok(p.left >= right(row[i]) - 1e-9, `no overlap at ${width}px (bottle ${i + 1})`));
  assert.ok(right(row.at(-1)!) <= width + 1e-9, `row fits ${width}px`);
}

// A wide strip is capped by the height available, not stretched to fill it.
const tall = layoutRow(original, alts, 5000, 400);
assert.equal(tall.height, 400);

// Width-bound: the row fills the strip exactly.
const tight = layoutRow(original, alts, 500, 1000);
assert.ok(Math.abs(right(tight.alts.at(-1)!) - 500) < 1e-9);

// One label per group, each given the room up to the next group.
assert.deepEqual([...tight.groupRoom.keys()], [0, 2, 4]);
assert.ok(Math.abs(tight.groupRoom.get(0)! - (tight.alts[2].left - tight.alts[0].left)) < 1e-9);

// No alternatives: just the original.
assert.equal(layoutRow(original, [], 100, 1000).height, 100 / 0.48);
console.log("bottleRow ok");
