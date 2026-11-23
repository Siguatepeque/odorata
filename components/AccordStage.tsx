"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { EffectComposer, RenderPass, EffectPass, BlendFunction } from "postprocessing";
import { AsciiEffect, InkBleedEffect, MemoryGrid } from "@niccolofanton/morphing-ascii-shader";
import { PRESET, SOURCE_FRAG, SOURCE_VERT, patchDarkMode, type Grid, type Ascii } from "@/lib/glyph";
import { dict } from "@/lib/i18n";
import type { Lang, Product } from "@/lib/products";

const motionQuery = () => matchMedia("(prefers-reduced-motion: reduce)");
const subscribeMotion = (cb: () => void) => {
  const mq = motionQuery();
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

// The product standing in front of its top note. The note is a photograph run through the
// lab's glyph pipeline (still -> per-cell memory -> glyph morph -> ink bleed); a slow drift
// over the still keeps the cells morphing, and the pointer leans the field for depth.
export default function AccordStage({ product: p, lang, priority = false, top }: { product: Product; lang: Lang; priority?: boolean; top?: React.ReactNode }) {
  const t = dict(lang);
  const host = useRef<HTMLDivElement>(null);
  const playRef = useRef(true);
  const reduced = useSyncExternalStore(subscribeMotion, () => motionQuery().matches, () => false);
  const [picked, setPicked] = useState<boolean | null>(null);
  const playing = picked ?? !reduced;
  useEffect(() => {
    playRef.current = playing;
  }, [playing]);

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
    new THREE.TextureLoader().load(p.accord.image, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const img = tex.image as HTMLImageElement;
      imgAspect = img.width / img.height;
      sourceRT.setSize(img.width, img.height);
      sourceMat.uniforms.uVideo.value = tex;
      renderer.setRenderTarget(sourceRT);
      renderer.render(sourceScene, camera);
      renderer.setRenderTarget(null);
      ready = true;
    });

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
      const f = p.accord.focus;
      const zoom = f.zoom * (1 + 0.035 * Math.sin(time * 0.09));
      const sx = (r >= 1 ? 1 / r : 1) / zoom;
      const sy = (r >= 1 ? 1 : r) / zoom;
      const ox = f.x - 0.5 + 0.015 * Math.sin(time * 0.11) + lean.x * 0.012;
      const oy = 0.5 - f.y + 0.012 * Math.cos(time * 0.13) - lean.y * 0.012; // texture v runs bottom-up
      memory.setVideoTransform(sx, sy, ox, oy);
      const m = memory.update(dt);
      if (m) ascii.memoryTexture = m;
      composer.render(dt);
    };
    tick();

    return () => {
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
  }, [p.accord]);

  return (
    <figure className="stage">
      <div ref={host} className="stage-field" style={{ "--still": `url(${p.accord.image})` } as React.CSSProperties} />
      {/* eslint-disable-next-line @next/next/no-img-element -- transparent cut-out at its natural size */}
      <img
        className="stage-bottle"
        src={p.photo.src}
        width={p.photo.w}
        height={p.photo.h}
        alt={`${p.name}, ${p.house}, ${p.type[lang]} ${p.ml} ml`}
        fetchPriority={priority ? "high" : undefined}
      />
      <a className="stage-notes" href="#notas">
        <span>
          <span className="stage-tier">{t.stage.top}</span>
          <strong>{p.accord.note[lang]}</strong>
          <span>
            {lang === "es" ? "Ver las" : "See all"} {Object.values(p.pyramid).flat().length} {lang === "es" ? "notas" : "notes"}
          </span>
        </span>
        <span className="notes-arrow" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M7 2v9M3 7.5 7 11.5l4-4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
      </a>
      {top}
      <button type="button" className="stage-toggle" aria-label={playing ? t.stage.pause : t.stage.play} title={playing ? t.stage.pause : t.stage.play} onClick={() => setPicked(!playing)}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          {playing ? <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" /> : <path d="M4.5 2.2 13.5 8l-9 5.8z" />}
        </svg>
      </button>
    </figure>
  );
}
