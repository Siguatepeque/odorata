"use client";

import { useEffect, useRef } from "react";
import type { FootageNote } from "@/lib/catalog";

// A still glyph field drawn once on a 2D canvas from a note's poster frame:
// the same grammar as the live stage, cheap enough for every card.
const CHARSET = " ·•+✦★○◯●";
const GROUND_DARK: [number, number, number] = [18, 17, 16];
const INK = "#141312";
const PAPER = "#ece6da";

export default function GlyphTile({ note, x, y, z, cell = 7 }: { note: FootageNote; x: number; y: number; z: number; cell?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const img = new Image();
    img.src = note.poster;
    const dark = matchMedia("(prefers-color-scheme: dark)");
    let drawn = false;

    const draw = () => {
      if (!img.complete || !img.naturalWidth) return;
      const W = cv.clientWidth, H = cv.clientHeight;
      if (!W || !H) return;
      const d = Math.min(devicePixelRatio || 1, 2);
      cv.width = W * d;
      cv.height = H * d;
      const g = cv.getContext("2d")!;
      g.scale(d, d);
      const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);

      // Sample the poster at grid resolution: cover (or contain), zoomed around the focus.
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.fillStyle = "#fff";
      o.fillRect(0, 0, cols, rows);
      const base = note.fit === "contain" ? Math.min(cols / img.naturalWidth, rows / img.naturalHeight) : Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
      const s = base * z;
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      o.drawImage(img, cols / 2 - x * dw, rows / 2 - y * dh, dw, dh);
      const px = o.getImageData(0, 0, cols, rows).data;

      const isDark = dark.matches;
      g.font = `${cell * 1.05}px ui-sans-serif, system-ui, sans-serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 4;
          let r = px[k] / 255, gg = px[k + 1] / 255, b = px[k + 2] / 255;
          if (note.keyBlack) {
            // Key the black backdrop to the white ground, as the live stage does.
            const m = Math.max(r, gg, b);
            const t = Math.min(1, Math.max(0, (m - 0.12) / 0.16));
            r = 1 + (r - 1) * t; gg = 1 + (gg - 1) * t; b = 1 + (b - 1) * t;
          }
          const lum = 0.2126 * r + 0.7152 * gg + 0.0722 * b;
          if (isDark) {
            // Pigment on paper: swap the white for the dark ground, keep the pigment.
            const w = Math.min(r, gg, b);
            const mix = Math.min(1, Math.max(0, (w - 0.55) / 0.3));
            const pr = (r - w) / Math.max(1 - w, 1e-3), pg = (gg - w) / Math.max(1 - w, 1e-3), pb = (b - w) / Math.max(1 - w, 1e-3);
            const cr = (w * GROUND_DARK[0]) / 255 + (1 - w) * pr, cg = (w * GROUND_DARK[1]) / 255 + (1 - w) * pg, cb = (w * GROUND_DARK[2]) / 255 + (1 - w) * pb;
            r += (cr - r) * mix; gg += (cg - gg) * mix; b += (cb - b) * mix;
          }
          g.fillStyle = `rgb(${(r * 255) | 0},${(gg * 255) | 0},${(b * 255) | 0})`;
          g.fillRect(i * cell, j * cell, cell + 0.5, cell + 0.5);
          const idx = Math.min(CHARSET.length - 1, Math.floor((1 - lum) * CHARSET.length * 1.1));
          if (idx > 0) {
            const l2 = 0.2126 * r + 0.7152 * gg + 0.0722 * b;
            g.fillStyle = l2 < 0.3 ? PAPER : isDark ? PAPER : INK;
            g.fillText(CHARSET[idx], i * cell + cell / 2, j * cell + cell / 2);
          }
        }
      drawn = true;
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !drawn) img.decode().then(draw, draw);
    }, { rootMargin: "200px" });
    io.observe(cv);
    const ro = new ResizeObserver(() => drawn && draw());
    ro.observe(cv);
    const redraw = () => drawn && draw();
    dark.addEventListener("change", redraw);
    return () => {
      io.disconnect();
      ro.disconnect();
      dark.removeEventListener("change", redraw);
    };
  }, [note, x, y, z, cell]);

  return <canvas ref={ref} className="glyph-tile" aria-hidden="true" />;
}
