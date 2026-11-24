"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { EffectComposer, RenderPass, EffectPass, BlendFunction } from "postprocessing";
import { AsciiEffect, InkBleedEffect, MemoryGrid } from "@niccolofanton/morphing-ascii-shader";
import { PRESET, SOURCE_FRAG, SOURCE_VERT, patchDarkMode, type Grid, type Ascii } from "@/lib/glyph";

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
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false });
    } catch {
      el.dataset.fallback = "true"; // CSS shows the plain photograph instead
      return;
    }
    const small = matchMedia("(max-width: 768px)").matches;
    const dpr = () => Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr());
    renderer.domElement.setAttribute("aria-hidden", "true");
    el.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const sourceRT = new THREE.WebGLRenderTarget(2, 2, { depthBuffer: false });
    const sourceMat = new THREE.ShaderMaterial({
      vertexShader: SOURCE_VERT,
      fragmentShader: SOURCE_FRAG,
      uniforms: { uVideo: { value: null }, uKeyBlack: { value: 0 } },
    });
    const sourceScene = new THREE.Scene();
    sourceScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), sourceMat));

    const ascii = new AsciiEffect({ ...PRESET, useMemory: true, edges: false }) as Ascii;
    patchDarkMode(ascii); // keeps the shader identical to the lab's; this page stays light
    asciiRef.current = ascii;
    applyLook(lookRef.current, true);
    const bleed = new InkBleedEffect({ bleed: 2, radius: 29, blur: 1 });
    bleed.blendMode.blendFunction = BlendFunction.MULTIPLY;
    const memory = new MemoryGrid(renderer, sourceRT.texture, { rate: PRESET.morphRate }) as Grid;
    const composer = new EffectComposer(renderer, { depthBuffer: false });
    const pass = new RenderPass(new THREE.Scene(), camera);
    pass.enabled = false;
    composer.addPass(pass);
    composer.addPass(new EffectPass(camera, ascii));
    composer.addPass(new EffectPass(camera, bleed));

    let imgAspect = 1.5;
    let ready = false;
    let disposed = false;
    const loader = new THREE.TextureLoader();
    loadRef.current = (src) =>
      loader.load(src, (tex) => {
        if (disposed) return tex.dispose();
        tex.colorSpace = THREE.SRGBColorSpace;
        const img = tex.image as HTMLImageElement;
        imgAspect = img.width / img.height;
        sourceRT.setSize(img.width, img.height);
        (sourceMat.uniforms.uVideo.value as THREE.Texture | null)?.dispose();
        sourceMat.uniforms.uVideo.value = tex;
        renderer.setRenderTarget(sourceRT);
        renderer.render(sourceScene, camera);
        renderer.setRenderTarget(null);
        ready = true;
      });
    loadRef.current(el.dataset.src!);

    const buf = new THREE.Vector2();
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setPixelRatio(dpr());
      renderer.setSize(w, h);
      composer.setSize(w, h);
      ascii.cellSize = Math.max(1, Math.round((small ? PRESET.gridCss * 0.45 : PRESET.gridCss * 0.66) * dpr()));
      renderer.getDrawingBufferSize(buf);
      memory.setSize(buf.x, buf.y, ascii.cellSize);
      ascii.setGridSize(memory.gridW, memory.gridH);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    // Pointer lean, eased; touch leaves it centred.
    const lean = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      lean.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      lean.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    addEventListener("pointermove", onMove);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let time = 0;
    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      if (!visible || !ready) return;
      if (playRef.current) time += dt;
      lean.x += (lean.tx - lean.x) * Math.min(1, dt * 3);
      lean.y += (lean.ty - lean.y) * Math.min(1, dt * 3);
      // Cover-fit the still, then drift and breathe inside it.
      const r = imgAspect / (el.clientWidth / el.clientHeight);
      const f = focusRef.current;
      const zoom = f.zoom * (1 + 0.07 * Math.sin(time * 0.25));
      const sx = (r >= 1 ? 1 / r : 1) / zoom;
      const sy = (r >= 1 ? 1 : r) / zoom;
      const ox = f.x - 0.5 + 0.05 * Math.sin(time * 0.3) + lean.x * 0.012;
      const oy = 0.5 - f.y + 0.035 * Math.cos(time * 0.23) - lean.y * 0.012; // texture v runs bottom-up
      memory.setVideoTransform(sx, sy, ox, oy);
      const m = memory.update(dt);
      if (m) ascii.memoryTexture = m;
      composer.render(dt);
    };
    tick();

    return () => {
      disposed = true;
      asciiRef.current = null;
      gsap.killTweensOf(ascii);
      loadRef.current = () => {};
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("pointermove", onMove);
      memory.dispose();
      composer.dispose();
      sourceRT.dispose();
      sourceMat.dispose();
      (sourceMat.uniforms.uVideo.value as THREE.Texture | null)?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
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
