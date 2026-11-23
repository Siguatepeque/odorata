"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { EffectComposer, RenderPass, EffectPass, BlendFunction } from "postprocessing";
import { AsciiEffect, InkBleedEffect, MemoryGrid } from "@niccolofanton/morphing-ascii-shader";
import styles from "./lab.module.css";
import { spawn, step, draw, type Ball, type Cursor } from "./balls";
import { PRESET, SWAP_NEAR_WHITE, SWAP_ALL, patchDarkMode, SOURCE_FRAG, SOURCE_VERT, type Grid, type Ascii } from "@/lib/glyph";

// Pipeline (the package demo's "Fragole" look):
//   video or live canvas -> source pass (keys the backdrop to a canonical white ground)
//         -> per-cell memory -> SDF glyph morph -> ink bleed.
// Switching clips does not reset the memory, so cells morph from one subject into the next.

type Clip = {
  id: string;
  label: string;
  src: string | null; // null = the interactive balls scene, drawn live on a canvas
  keyBlack: boolean; // backdrop is black: key it to white so every clip shares one ground
  poster: number; // reduced-motion still, in seconds
  fit: "cover" | "contain"; // contain for portrait footage, so the subject is never cropped away
};

const CLIPS: Clip[] = [
  { id: "strawberries", label: "Strawberries", src: "/lab/strawberries.mp4", keyBlack: false, poster: 4, fit: "cover" },
  { id: "peony", label: "Peony", src: "/lab/peony.mp4", keyBlack: true, poster: 6, fit: "cover" },
  { id: "crocus", label: "Crocus", src: "/lab/crocus.mp4", keyBlack: true, poster: 6, fit: "cover" },
  { id: "violet", label: "Violet", src: "/lab/violet.mp4", keyBlack: true, poster: 6, fit: "cover" },
  { id: "white-deer", label: "White deer", src: "/lab/white-deer.mp4", keyBlack: false, poster: 3, fit: "contain" },
  { id: "balls", label: "Balls", src: null, keyBlack: false, poster: 0, fit: "cover" },
];

// Glyph families, ordered light -> dense. glyphScale sizes each family to its cell: blocks
// must tile edge to edge, dots read best large, text glyphs sit in between.
type Style = { id: string; label: string; charset: string; glyphScale: number; variety: number };
const STYLES: Style[] = [
  { id: "stars", label: "Stars", charset: " ·•+✦★○◯●", glyphScale: 2.74, variety: 0.4 },
  { id: "ascii", label: "ASCII", charset: " .:-=+*#%@", glyphScale: 1.9, variety: 0.15 },
  { id: "halftone", label: "Halftone", charset: " .·•●", glyphScale: 3.2, variety: 0 },
  // block glyphs render tall and narrow in the system font, so they read as a print line screen
  { id: "linescreen", label: "Line screen", charset: " ░▒▓█", glyphScale: 1.75, variety: 0 },
  { id: "engraving", label: "Engraving", charset: " ‧∕╱╳▓", glyphScale: 2.2, variety: 0.2 },
  { id: "manuscript", label: "Manuscript", charset: " ·⁘※§¶", glyphScale: 2.3, variety: 0.5 },
  { id: "braille", label: "Braille", charset: " ⠂⠃⠇⠏⠟⠿⣿", glyphScale: 2.4, variety: 0.2 },
];


type Api = {
  setClip(c: Clip): void;
  setDark(d: boolean): void;
  setPlaying(p: boolean): void;
  setStyle(s: Style): void;
};

const motionQuery = () => matchMedia("(prefers-reduced-motion: reduce)");
const subscribeMotion = (cb: () => void) => {
  const mq = motionQuery();
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const darkQuery = () => matchMedia("(prefers-color-scheme: dark)");
const subscribeScheme = (cb: () => void) => {
  const mq = darkQuery();
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function AsciiStage() {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const [clip, setClip] = useState(CLIPS[0]);
  const [style, setStyle] = useState(STYLES[0]);
  // Follow the OS theme until the visitor picks one.
  const osDark = useSyncExternalStore(subscribeScheme, () => darkQuery().matches, () => false);
  const [picked, setDark] = useState<boolean | null>(null);
  const dark = picked ?? osDark;
  // Reduced motion starts paused on a still; the visitor can still opt in.
  const reduced = useSyncExternalStore(subscribeMotion, () => motionQuery().matches, () => false);
  const [playPicked, setPlaying] = useState<boolean | null>(null);
  const playing = playPicked ?? !reduced;

  useEffect(() => {
    const el = host.current!;
    let wantPlay = false;
    const small = matchMedia("(pointer: coarse), (max-width: 768px)").matches;
    const dpr = () => Math.min(devicePixelRatio || 1, 2);

    const video = Object.assign(document.createElement("video"), { muted: true, loop: true, playsInline: true });
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(dpr());
    el.appendChild(renderer.domElement);

    // Source pass: video -> keyed texture at the video's own resolution.
    const videoTex = new THREE.VideoTexture(video);
    videoTex.colorSpace = THREE.SRGBColorSpace;
    const sourceRT = new THREE.WebGLRenderTarget(1280, 720, { type: THREE.HalfFloatType, depthBuffer: false });
    const sourceMat = new THREE.ShaderMaterial({
      vertexShader: SOURCE_VERT,
      fragmentShader: SOURCE_FRAG,
      uniforms: { uVideo: { value: videoTex }, uKeyBlack: { value: 0 } },
    });
    // Live source for the balls scene: drawn at CSS-pixel size, the glyph grid is far coarser.
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const canvasTex = new THREE.CanvasTexture(canvas);
    canvasTex.colorSpace = THREE.SRGBColorSpace;
    let balls: Ball[] | null = null;
    const cursor: Cursor = { x: 0, y: 0, vx: 0, vy: 0, r: 0, active: false };
    let lastMove = 0;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const now = performance.now();
      const dt = Math.max((now - lastMove) / 1000, 1 / 240);
      if (cursor.active) { cursor.vx = (x - cursor.x) / dt; cursor.vy = (y - cursor.y) / dt; }
      Object.assign(cursor, { x, y, active: true });
      lastMove = now;
    };
    const onLeave = () => { cursor.active = false; cursor.vx = cursor.vy = 0; };
    addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    const onUp = (e: PointerEvent) => { if (e.pointerType === "touch") onLeave(); }; // finger lifted
    addEventListener("pointerup", onUp);

    const sourceScene = new THREE.Scene();
    sourceScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), sourceMat));
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const ascii = new AsciiEffect({ ...PRESET, useMemory: true, edges: false }) as Ascii;
    const darkUniforms = patchDarkMode(ascii);
    const bleed = new InkBleedEffect({ bleed: 2, radius: 29, blur: 1 });
    const memory = new MemoryGrid(renderer, sourceRT.texture, { rate: PRESET.morphRate }) as Grid;

    const composer = new EffectComposer(renderer, { depthBuffer: false });
    const renderPass = new RenderPass(new THREE.Scene(), camera);
    renderPass.enabled = false; // the glyph pass reads the memory grid, never the scene
    composer.addPass(renderPass);
    composer.addPass(new EffectPass(camera, ascii));
    composer.addPass(new EffectPass(camera, bleed));

    const buf = new THREE.Vector2();
    // The memory grid samples uv' = (uv - 0.5) * scale + 0.5; outside [0,1] it writes ground.
    // r = video aspect / screen aspect. cover crops the overflow, contain bands with ground.
    let fitMode: Clip["fit"] = "cover";
    const fit = () => {
      if (balls) return memory.setVideoTransform(1, 1, 0, 0); // canvas already matches the screen
      if (!video.videoWidth) return;
      const r = video.videoWidth / video.videoHeight / (el.clientWidth / el.clientHeight);
      const wider = r >= 1;
      if (fitMode === "cover") memory.setVideoTransform(wider ? 1 / r : 1, wider ? 1 : r, 0, 0);
      else memory.setVideoTransform(wider ? 1 : 1 / r, wider ? r : 1, 0, 0);
    };
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setPixelRatio(dpr());
      renderer.setSize(w, h);
      composer.setSize(w, h);
      ascii.cellSize = Math.max(1, Math.round((small ? PRESET.gridCss / 2 : PRESET.gridCss) * dpr()));
      renderer.getDrawingBufferSize(buf);
      memory.setSize(buf.x, buf.y, ascii.cellSize);
      ascii.setGridSize(memory.gridW, memory.gridH);
      canvas.width = w;
      canvas.height = h;
      cursor.r = Math.min(w, h) * 0.06;
      if (balls) sourceRT.setSize(w, h);
      fit();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let poster = 0;
    video.addEventListener("loadedmetadata", () => {
      sourceRT.setSize(video.videoWidth, video.videoHeight);
      fit();
      if (wantPlay) video.play().catch(() => addEventListener("pointerdown", () => video.play(), { once: true }));
      else video.currentTime = poster;
    });

    api.current = {
      setClip(c) {
        poster = c.poster;
        fitMode = c.fit;
        sourceMat.uniforms.uKeyBlack.value = c.keyBlack ? 1 : 0;
        const [lo, hi] = c.src ? SWAP_NEAR_WHITE : SWAP_ALL;
        (darkUniforms.get("uSwap")!.value as THREE.Vector2).set(lo, hi);
        if (c.src) {
          balls = null;
          sourceMat.uniforms.uVideo.value = videoTex;
          video.src = c.src;
        } else {
          video.pause();
          video.removeAttribute("src");
          // Reduced motion (not playing): the pile starts settled instead of raining in.
          balls = spawn(canvas.width, canvas.height, 16, !wantPlay);
          sourceMat.uniforms.uVideo.value = canvasTex;
          sourceRT.setSize(canvas.width, canvas.height);
          fit();
        }
      },
      setDark(d) {
        darkUniforms.get("uDark")!.value = d ? 1 : 0;
        // Ink bleed is ink soaking into paper: a light-ground phenomenon. On the dark ground any
        // additive version reads as a milky haze over full-frame footage, so it is off there.
        bleed.blendMode.blendFunction = BlendFunction.MULTIPLY;
        bleed.bleed = d ? 0 : 2;
      },
      setStyle(s) {
        ascii.charset = s.charset; // rebuilds the glyph and SDF atlases
        ascii.glyphScale = s.glyphScale;
        ascii.variety = s.variety;
      },
      setPlaying(p) {
        wantPlay = p;
        if (!video.src) return; // no video yet (or the balls scene, which is pointer-driven)
        if (p) video.play().catch(() => {});
        else video.pause();
      },
    };

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      if (balls) {
        // Physics always runs here: any motion after the settle is the visitor's own push.
        step(balls, cursor, canvas.width, canvas.height, dt);
        // White is the canonical ground in every theme: glyph density keys off luminance, so a
        // dark canvas would read as dark subject and fill with glyphs. The shader swaps it.
        draw(ctx, balls, canvas.width, canvas.height);
        canvasTex.needsUpdate = true;
        renderer.setRenderTarget(sourceRT);
        renderer.render(sourceScene, camera);
        renderer.setRenderTarget(null);
      } else if (video.readyState >= video.HAVE_CURRENT_DATA) {
        videoTex.needsUpdate = true;
        renderer.setRenderTarget(sourceRT);
        renderer.render(sourceScene, camera);
        renderer.setRenderTarget(null);
      }
      const m = memory.update(dt);
      if (m) ascii.memoryTexture = m;
      composer.render(dt);
    };
    tick();

    return () => {
      api.current = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      canvasTex.dispose();
      video.pause();
      video.removeAttribute("src");
      memory.dispose();
      composer.dispose();
      sourceRT.dispose();
      sourceMat.dispose();
      videoTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  // Order matters on mount: play intent must be known before the first clip loads.
  useEffect(() => api.current?.setPlaying(playing), [playing]);
  useEffect(() => api.current?.setClip(clip), [clip]);
  useEffect(() => api.current?.setDark(dark), [dark]);
  useEffect(() => api.current?.setStyle(style), [style]);

  return (
    <div className={styles.lab} data-theme={dark ? "dark" : "light"}>
      <div ref={host} className={styles.stage} aria-hidden />
      <nav className={styles.controls} aria-label="Lab controls">
        <div className={styles.rows}>
          <div className={styles.group} role="group" aria-label="Glyph style">
            {STYLES.map((s) => (
              <button key={s.id} type="button" aria-pressed={s.id === style.id} onClick={() => setStyle(s)}>
                {s.label}
              </button>
            ))}
          </div>
          <div className={styles.group} role="group" aria-label="Clip">
            {CLIPS.map((c) => (
              <button key={c.id} type="button" aria-pressed={c.id === clip.id} onClick={() => setClip(c)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.group}>
          <button type="button" aria-pressed={playing} onClick={() => setPlaying(!playing)}>
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" aria-pressed={dark} onClick={() => setDark(!dark)}>
            Dark mode
          </button>
        </div>
      </nav>
    </div>
  );
}
