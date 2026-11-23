"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { EffectComposer, RenderPass, EffectPass, BlendFunction } from "postprocessing";
import { AsciiEffect, InkBleedEffect, MemoryGrid } from "@niccolofanton/morphing-ascii-shader";
import { PRESET, SWAP_NEAR_WHITE, patchDarkMode, SOURCE_FRAG, SOURCE_VERT, type Grid, type Ascii } from "@/lib/glyph";
import type { FootageNote } from "@/lib/catalog";
import GlyphTile from "./GlyphTile";

let webgl: boolean | undefined;
const hasWebGL = () => (webgl ??= !!document.createElement("canvas").getContext("webgl2"));
const noop = () => () => {};

// The live glyph field: note footage -> keyed white ground -> per-cell memory -> glyph morph.
// Switching notes keeps the memory, so the cells morph from one note into the next.
export default function NoteStage({ note, playing, reduced }: { note: FootageNote; playing: boolean; reduced: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ setNote(n: FootageNote): void; setPlaying(p: boolean): void } | null>(null);
  const failed = !useSyncExternalStore(noop, hasWebGL, () => true);

  useEffect(() => {
    if (failed) return; // no WebGL: the 2D tile below takes over
    const el = host.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    let wantPlay = false;
    let still = 0;
    const small = matchMedia("(pointer: coarse), (max-width: 768px)").matches;
    const dark = matchMedia("(prefers-color-scheme: dark)");
    const dpr = () => Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr());
    renderer.domElement.setAttribute("aria-hidden", "true");
    el.appendChild(renderer.domElement);

    const video = Object.assign(document.createElement("video"), { muted: true, loop: true, playsInline: true, preload: "auto" });
    const videoTex = new THREE.VideoTexture(video);
    videoTex.colorSpace = THREE.SRGBColorSpace;
    const sourceRT = new THREE.WebGLRenderTarget(640, 360, { type: THREE.HalfFloatType, depthBuffer: false });
    const sourceMat = new THREE.ShaderMaterial({
      vertexShader: SOURCE_VERT,
      fragmentShader: SOURCE_FRAG,
      uniforms: { uVideo: { value: videoTex }, uKeyBlack: { value: 0 } },
    });
    const sourceScene = new THREE.Scene();
    sourceScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), sourceMat));
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const ascii = new AsciiEffect({ ...PRESET, useMemory: true, edges: false }) as Ascii;
    const uniforms = patchDarkMode(ascii);
    (uniforms.get("uSwap")!.value as THREE.Vector2).set(...SWAP_NEAR_WHITE);
    const bleed = new InkBleedEffect({ bleed: 2, radius: 29, blur: 1 });
    bleed.blendMode.blendFunction = BlendFunction.MULTIPLY;
    // Reduced motion: a tapped note still changes, but the cells settle almost at once.
    const memory = new MemoryGrid(renderer, sourceRT.texture, { rate: reduced ? 200 : PRESET.morphRate }) as Grid;
    const composer = new EffectComposer(renderer, { depthBuffer: false });
    const renderPass = new RenderPass(new THREE.Scene(), camera);
    renderPass.enabled = false;
    composer.addPass(renderPass);
    composer.addPass(new EffectPass(camera, ascii));
    composer.addPass(new EffectPass(camera, bleed));

    const setDark = () => {
      const d = dark.matches;
      uniforms.get("uDark")!.value = d ? 1 : 0;
      bleed.bleed = d ? 0 : 2; // ink bleed is a paper effect; on the dark ground it hazes
    };
    setDark();
    dark.addEventListener("change", setDark);

    let fitMode: FootageNote["fit"] = "cover";
    const fit = () => {
      if (!video.videoWidth) return;
      const r = video.videoWidth / video.videoHeight / (el.clientWidth / el.clientHeight);
      const wider = r >= 1;
      if (fitMode === "cover") memory.setVideoTransform(wider ? 1 / r : 1, wider ? 1 : r, 0, 0);
      else memory.setVideoTransform(wider ? 1 : 1 / r, wider ? r : 1, 0, 0);
    };
    const buf = new THREE.Vector2();
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setPixelRatio(dpr());
      renderer.setSize(w, h);
      composer.setSize(w, h);
      ascii.cellSize = Math.max(1, Math.round((small ? PRESET.gridCss / 2 : PRESET.gridCss * 0.75) * dpr()));
      renderer.getDrawingBufferSize(buf);
      memory.setSize(buf.x, buf.y, ascii.cellSize);
      ascii.setGridSize(memory.gridW, memory.gridH);
      fit();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    video.addEventListener("loadedmetadata", () => {
      sourceRT.setSize(video.videoWidth, video.videoHeight);
      fit();
      if (wantPlay) video.play().catch(() => {});
      else video.currentTime = still;
    });

    api.current = {
      setNote(n) {
        still = n.at;
        fitMode = n.fit;
        sourceMat.uniforms.uKeyBlack.value = n.keyBlack ? 1 : 0;
        video.src = n.video;
      },
      setPlaying(p) {
        wantPlay = p;
        if (!video.src) return;
        if (p) video.play().catch(() => {});
        else video.pause();
      },
    };

    // Render only while the stage is on screen.
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      if (!visible) return;
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
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
      io.disconnect();
      dark.removeEventListener("change", setDark);
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
  }, [reduced, failed]);

  // Play intent first, so the first note loads knowing whether to play.
  useEffect(() => api.current?.setPlaying(playing), [playing, reduced]);
  useEffect(() => api.current?.setNote(note), [note, reduced]);

  return (
    <div ref={host} className="stage-canvas">
      {failed && <GlyphTile note={note} x={0.5} y={0.5} z={1} />}
    </div>
  );
}
