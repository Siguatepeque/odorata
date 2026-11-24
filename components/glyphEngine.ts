// The glyph field's WebGL half. GlyphField loads it on demand, so three.js and the shader stack
// (~600 KB) stay out of the JavaScript a phone must parse before the page responds.
import gsap from "gsap";
import * as THREE from "three";
import { EffectComposer, RenderPass, EffectPass, BlendFunction } from "postprocessing";
import { AsciiEffect, InkBleedEffect, MemoryGrid } from "@niccolofanton/morphing-ascii-shader";
import { PRESET, SOURCE_FRAG, SOURCE_VERT, patchDarkMode, type Grid, type Ascii } from "@/lib/glyph";
import type { Focus } from "./GlyphField";

// Quality tier, shared by every field this visit: 0 full, 1 lite (1x pixels, 30fps, no glass blur),
// 2 the plain photograph. Phones that can't hold the frame rate step down and stay down.
let tier = 0;
const lowFx = () => {
  if (tier) document.documentElement.dataset.lowfx = "";
};

type Ref<T> = { current: T };
type Wiring = {
  playRef: Ref<boolean>;
  focusRef: Ref<Focus>;
  loadRef: Ref<(src: string) => void>;
  onAscii: (a: Ascii | null) => void;
};

// Starts the field inside `el` and returns its cleanup.
export function mountGlyphField(el: HTMLDivElement, { playRef, focusRef, loadRef, onAscii }: Wiring): (() => void) | undefined {
  // ≤2 GB RAM (Chromium reports it) is a potato phone: start lite instead of lagging first.
  if (((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 2) tier = Math.max(tier, 1);
  lowFx();
  if (tier > 1) {
    el.dataset.fallback = "true";
    return;
  }
  let renderer: THREE.WebGLRenderer;
  try {
    // The composer only draws flat full-screen passes, so the canvas needs no depth buffer.
    renderer = new THREE.WebGLRenderer({ antialias: false, depth: false });
  } catch {
    el.dataset.fallback = "true"; // CSS shows the plain photograph instead
    return;
  }
  const small = matchMedia("(max-width: 768px)").matches;
  const dpr = () => Math.min(devicePixelRatio || 1, tier ? 1 : 2);
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
  onAscii(ascii);
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
      // Drawn 1:1 into sourceRT, so mip levels are never sampled: skip building them on every still.
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
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
    // The bleed radius is in device pixels: keep it the same size on screen when lite drops to 1x.
    bleed.radius = (29 * dpr()) / Math.min(devicePixelRatio || 1, 2);
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

  // Step down one tier; at the last one the canvas goes and CSS shows the photograph.
  const degrade = () => {
    tier = Math.min(2, tier + 1);
    lowFx();
    if (tier < 2) return resize();
    el.dataset.fallback = "true";
    loadRef.current = () => {};
    renderer.domElement.remove();
  };

  let time = 0;
  let raf = 0;
  let acc = 0;
  // Watchdog, drei PerformanceMonitor's rule: rendered fps per 250ms window; step down when 8 of
  // the last 10 windows are under the floor, so one hitch (shader compile, GC, a tab switch) can't.
  // Floors: 45 at full; 20 at lite, whose cap is 30 (iOS Low Power also caps rAF at 30).
  let frames = 0;
  let since = performance.now();
  let windows: number[] = [];
  const clock = new THREE.Clock();
  const tick = () => {
    if (tier > 1) return;
    raf = requestAnimationFrame(tick);
    let dt = clock.getDelta();
    if (!visible || !ready) {
      frames = acc = 0;
      windows = [];
      since = performance.now();
      return;
    }
    acc += dt;
    if (tier && acc < 1 / 31) return; // lite renders every other frame
    dt = acc;
    acc = 0;
    frames++;
    const now = performance.now();
    if (now - since >= 250) {
      windows.push((frames * 1000) / (now - since));
      frames = 0;
      since = now;
      if (windows.length === 10) {
        if (windows.filter((fps) => fps < (tier ? 20 : 45)).length >= 8) degrade();
        windows = [];
        if (tier > 1) return;
      }
    }
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
    onAscii(null);
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
}
