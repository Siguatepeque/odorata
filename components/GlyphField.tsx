"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Ascii } from "@/lib/glyph";

export type Focus = { x: number; y: number; zoom: number };
/** A scene's treatment: which glyphs print it, how they take colour, and the numeric feel (tweened between scenes). */
export type Look = { charset?: string; colorMode?: number; glyphScale?: number; noise?: number; magnet?: number; contrast?: number };

// Each top note prints in its own glyphs, on the landing and on every product page that opens with it.
// The flag is set in stars, like its own five; cinnamon in a dense grainy cross-hatch; bergamot in rings
// and dots over the fruit's own colour; apple in crisp facets.
export const LOOKS: Record<string, Look> = {
  flag: { charset: " ·✦★", colorMode: 1, glyphScale: 2.6, noise: 0.12, magnet: 1.5, contrast: 1 },
  cinnamon: { charset: " ·:+✚✖", colorMode: 1, glyphScale: 2.2, noise: 0.3, magnet: 2.4, contrast: 1.15 },
  bergamot: { charset: " ·∘○◯●", colorMode: 1, glyphScale: 2.9, noise: 0.08, magnet: 1.3, contrast: 1.25 },
  apple: { charset: " ·◇◈◆", colorMode: 1, glyphScale: 2.5, noise: 0.1, magnet: 1.6, contrast: 1.2 },
};
export const noteLook = (note: { en: string }) => LOOKS[note.en.toLowerCase()];

// A still run through the lab's glyph pipeline (still -> per-cell memory -> glyph morph -> ink bleed).
// A slow drift keeps the cells morphing and the pointer leans the field. Changing `image` keeps the
// renderer and loads the new still, so the cells morph from one picture into the next.
export default function GlyphField({ image, focus, playing, look }: { image: string; focus: Focus; playing: boolean; look?: Look }) {
  const host = useRef<HTMLDivElement>(null);
  const playRef = useRef(playing);
  const focusRef = useRef(focus);
  const loadRef = useRef<(src: string) => void>(() => {});
  const asciiRef = useRef<Ascii | null>(null);
  const lookRef = useRef(look);
  // Glyph set and colour mode switch outright; the numbers glide so the print changes character, not just content.
  const applyLook = (l: Look | undefined, instant = false) => {
    const a = asciiRef.current as unknown as (Ascii & Record<string, unknown>) | null;
    if (!a || !l) return;
    const { charset, colorMode, ...nums } = l;
    if (charset && charset !== a.charset) a.charset = charset;
    if (colorMode != null) a.colorMode = colorMode as Ascii["colorMode"];
    if (instant) Object.assign(a, nums);
    else gsap.to(a, { ...nums, duration: 0.9, ease: "power2.inOut", overwrite: true });
  };
  useEffect(() => {
    playRef.current = playing;
    focusRef.current = focus;
  }, [playing, focus]);

  useEffect(() => {
    const el = host.current!;
    let stop: (() => void) | undefined;
    let gone = false;
    // Until the engine arrives the stage shows its ground, as it already did while the still loaded.
    import("./glyphEngine")
      .then(({ mountGlyphField }) => {
        if (gone) return;
        stop = mountGlyphField(el, {
          playRef,
          focusRef,
          loadRef,
          onAscii: (a) => {
            asciiRef.current = a;
            if (a) applyLook(lookRef.current, true);
          },
        });
      })
      .catch(() => (el.dataset.fallback = "true")); // chunk failed on a bad connection: show the photograph
    return () => {
      gone = true;
      stop?.();
    };
  }, []);

  // A new still after mount: same renderer, the cells morph into it.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    loadRef.current(image);
  }, [image]);

  useEffect(() => {
    lookRef.current = look;
    applyLook(look);
  }, [look]);

  return <div ref={host} className="stage-field" data-src={image} style={{ "--still": `url(${image})` } as React.CSSProperties} />;
}
