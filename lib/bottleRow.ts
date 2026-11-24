// The landing's bottle row: an original, then its alternatives in closeness groups, standing on one
// baseline. Given the strip they have, it finds the one height at which the whole row fits without
// any bottle overlapping another, using each photo's real proportions.

/** Alternatives stand a little shorter than the original, so the original reads first. */
export const ALT_SCALE = 0.72;
/** Gaps as fractions of the original's height. */
export const GAP = { afterOriginal: 0.22, betweenGroups: 0.2, inGroup: 0.06 };

export type Bottle = { aspect: number }; // width / height of the cut-out
export type Alt = Bottle & { group: number }; // alternatives arrive sorted by group
export type Placed = { left: number; width: number; height: number };

export type Row = {
  height: number; // the original's height; alternatives are ALT_SCALE of it
  original: Placed;
  alts: Placed[];
  /** For each alternative that opens a group: room from its left edge to the next group (for its label). */
  groupRoom: Map<number, number>;
};

/** Width of the whole row at original height 1. */
const unitWidth = (original: Bottle, alts: Alt[]) =>
  alts.reduce(
    (w, a, i) => w + a.aspect * ALT_SCALE + (i === 0 ? 0 : a.group === alts[i - 1].group ? GAP.inGroup : GAP.betweenGroups),
    original.aspect + (alts.length ? GAP.afterOriginal : 0),
  );

/** Lays the row out from x = 0 in a strip `width` wide whose bottles may be at most `maxHeight` tall. */
export function layoutRow(original: Bottle, alts: Alt[], width: number, maxHeight: number): Row {
  const height = Math.max(0, Math.min(maxHeight, width / unitWidth(original, alts)));
  const placed: Placed[] = [];
  let x = 0;
  const put = (aspect: number, h: number) => {
    const p = { left: x, width: aspect * h, height: h };
    x += p.width;
    return p;
  };
  const orig = put(original.aspect, height);
  if (alts.length) x += GAP.afterOriginal * height;
  alts.forEach((a, i) => {
    if (i > 0) x += (a.group === alts[i - 1].group ? GAP.inGroup : GAP.betweenGroups) * height;
    placed.push(put(a.aspect, height * ALT_SCALE));
  });

  const groupRoom = new Map<number, number>();
  alts.forEach((a, i) => {
    if (i > 0 && a.group === alts[i - 1].group) return;
    const next = alts.findIndex((b, j) => j > i && b.group !== a.group);
    groupRoom.set(i, (next === -1 ? width : placed[next].left) - placed[i].left);
  });
  return { height, original: orig, alts: placed, groupRoom };
}
