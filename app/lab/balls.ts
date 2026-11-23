// Tiny 2D circle physics for the lab: gravity, floor and walls, ball-ball contacts, and the
// cursor as a kinematic circle that shoves balls with its own velocity.
// ponytail: O(n²) contacts, fine for a few dozen balls; add a spatial grid past ~200.

export type Ball = { x: number; y: number; vx: number; vy: number; r: number; color: string };
export type Cursor = { x: number; y: number; vx: number; vy: number; r: number; active: boolean };

const GRAVITY = 2200; // px/s²
const RESTITUTION = 0.35;
const FLOOR_FRICTION = 0.985; // per substep, while touching the floor
const SUBSTEPS = 4;

const COLORS = ["#c8102e", "#7b2fbe", "#e0a21b", "#2f7d4f", "#2457c5", "#e0442b", "#b03a8c"];

export function spawn(w: number, h: number, count: number, settled: boolean): Ball[] {
  const unit = Math.min(w, h);
  const balls: Ball[] = [];
  for (let i = 0; i < count; i++) {
    const r = unit * (0.06 + Math.random() * 0.07);
    balls.push({
      x: r + Math.random() * (w - 2 * r),
      // staggered above the viewport so they rain in one after another
      y: settled ? h - r - Math.random() * h * 0.5 : -r - i * unit * 0.12 - Math.random() * unit * 0.1,
      vx: (Math.random() - 0.5) * 200,
      vy: 0,
      r,
      color: COLORS[i % COLORS.length],
    });
  }
  // Reduced motion: resolve the pile before the first frame instead of animating the fall.
  if (settled) for (let i = 0; i < 400; i++) step(balls, null, w, h, 1 / 60);
  return balls;
}

export function step(balls: Ball[], cursor: Cursor | null, w: number, h: number, dt: number) {
  const s = Math.min(dt, 1 / 30) / SUBSTEPS; // clamp: a stalled tab must not tunnel balls
  for (let k = 0; k < SUBSTEPS; k++) {
    for (const b of balls) {
      b.vy += GRAVITY * s;
      b.x += b.vx * s;
      b.y += b.vy * s;
      if (b.y > h - b.r) { b.y = h - b.r; b.vy = -b.vy * RESTITUTION; b.vx *= FLOOR_FRICTION; }
      if (b.x < b.r) { b.x = b.r; b.vx = -b.vx * RESTITUTION; }
      if (b.x > w - b.r) { b.x = w - b.r; b.vx = -b.vx * RESTITUTION; }
    }
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) collide(balls[i], balls[j]);
      if (cursor?.active) push(balls[i], cursor);
    }
  }
}

function collide(a: Ball, b: Ball) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const min = a.r + b.r;
  const d2 = dx * dx + dy * dy;
  if (d2 >= min * min || d2 === 0) return;
  const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
  // positional correction weighted by area, so small balls yield to big ones
  const ma = a.r * a.r, mb = b.r * b.r, overlap = min - d;
  a.x -= nx * overlap * (mb / (ma + mb)); a.y -= ny * overlap * (mb / (ma + mb));
  b.x += nx * overlap * (ma / (ma + mb)); b.y += ny * overlap * (ma / (ma + mb));
  const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (rel > 0) return; // already separating
  const j = (-(1 + RESTITUTION) * rel) / (1 / ma + 1 / mb);
  a.vx -= (j / ma) * nx; a.vy -= (j / ma) * ny;
  b.vx += (j / mb) * nx; b.vy += (j / mb) * ny;
}

function push(b: Ball, c: Cursor) {
  const dx = b.x - c.x, dy = b.y - c.y;
  const min = b.r + c.r;
  const d2 = dx * dx + dy * dy;
  if (d2 >= min * min || d2 === 0) return;
  const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
  b.x = c.x + nx * min;
  b.y = c.y + ny * min;
  // the cursor is infinitely heavy: the ball takes on its velocity along the contact normal
  const rel = (b.vx - c.vx) * nx + (b.vy - c.vy) * ny;
  if (rel < 0) { b.vx -= (1 + RESTITUTION) * rel * nx; b.vy -= (1 + RESTITUTION) * rel * ny; }
}

// f > 0 mixes toward white, f < 0 toward black.
function tint(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (c: number) => Math.round(f > 0 ? c + (255 - c) * f : c * (1 + f));
  return `rgb(${ch(n >> 16)}, ${ch((n >> 8) & 255)}, ${ch(n & 255)})`;
}

// Lit spheres, not flat discs: the light-to-shadow ramp is what feeds the glyph density scale.
export function draw(ctx: CanvasRenderingContext2D, balls: Ball[], w: number, h: number) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  for (const b of balls) {
    // Shade within the ball's own hue: a pure-white highlight or near-black rim would read as
    // neutral paper/ink and turn grey in dark mode.
    const g = ctx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.1, b.x, b.y, b.r);
    g.addColorStop(0, tint(b.color, 0.45));
    g.addColorStop(0.35, b.color);
    g.addColorStop(1, tint(b.color, -0.55));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }
}
