// Glyph shader pieces shared by the lab and the storefront stage.
import * as THREE from "three";
import type { AsciiEffect, MemoryGrid } from "@niccolofanton/morphing-ascii-shader";

export const PRESET = {
  gridCss: 18, // halved on touch / narrow screens, as the demo does
  charset: " ·•+✦★○◯●",
  colorMode: 1 as const, // glyphs printed over the cell colour
  whiteCutoff: 1,
  brightness: 0.08,
  variety: 0.4,
  glyphScale: 2.74,
  glyphBlend: true,
  magnet: 1.5,
  sdfMorph: true,
  sdfThreshold: 0.5,
  sdfAA: 0.105,
  noise: 0.155,
  noiseScale: 5,
  noiseMode: 3,
  morphRate: 17.4,
};

// Dark mode lives inside the glyph shader, because only there do we know glyph vs cell.
// Neutral light cells (the ground and its soft shadows) mirror their lightness onto a dark
// ground; coloured cells keep their colour; glyph ink flips to paper. Dark subject areas get the
// densest glyphs, so in dark mode they fill with light marks instead of sinking into the ground.
// Dark mode swaps a cell's white for the dark ground between these white-content edges.
// Footage: near-white only, so pale subjects (the white deer) keep their own tone.
// Generated scenes: every colour is ours, so all white goes, including mid-morph pastels.
export const SWAP_NEAR_WHITE = [0.55, 0.85] as const;
export const SWAP_ALL = [0.0, 0.2] as const;

export const ANCHOR_UNIFORM ="uniform float uWhiteCutoff;";
export const ANCHOR_OUTPUT = "outputColor = vec4(mix(ink, vec3(0.05), mask), 1.0);";
// In both themes the glyph ink opposes its own cell (light marks on dark cells, dark marks on
// bright ones), so footage that goes dark never collapses into dark-on-dark mush.
export const DARK_OUTPUT = /* glsl */ `
    vec3 cellC = ink;
    float l = dot(ink, vec3(0.2126, 0.7152, 0.0722));
    if (uDark > 0.5) {
      // Read each cell as pigment on white paper: w = how much white is mixed in. Swap that
      // white for the dark ground and keep the pigment, so pale tints and morph trails become
      // dim colour instead of grey. Only light cells get swapped; dark subjects stay as shot.
      float w = min(ink.r, min(ink.g, ink.b));
      vec3 pigment = (ink - w) / max(1.0 - w, 1e-3);
      vec3 onDark = w * uGround + (1.0 - w) * pigment;
      cellC = mix(ink, onDark, smoothstep(uSwap.x, uSwap.y, w));
      l = dot(cellC, vec3(0.2126, 0.7152, 0.0722));
    }
    // linear luma. Only genuinely dark cells take paper ink; mid-tones keep dark ink so
    // full-frame footage isn't washed out by light marks everywhere.
    float inkDark = uDark > 0.5 ? smoothstep(0.06, 0.16, l) : smoothstep(0.02, 0.07, l);
    vec3 glyphC = mix(uGlyphInk, vec3(0.05), inkDark);
    outputColor = vec4(mix(cellC, glyphC, mask), 1.0);`;

export function patchDarkMode(ascii: AsciiEffect) {
  const e = ascii as unknown as {
    getFragmentShader(): string;
    setFragmentShader(s: string): void;
    uniforms: Map<string, THREE.Uniform>;
  };
  const src = e.getFragmentShader();
  if (!src.includes(ANCHOR_UNIFORM) || !src.includes(ANCHOR_OUTPUT)) {
    // Package changed its shader: fail loudly instead of silently shipping a broken dark mode.
    throw new Error("morphing-ascii-shader: dark-mode patch anchors not found");
  }
  e.setFragmentShader(
    src
      .replace(ANCHOR_UNIFORM, `${ANCHOR_UNIFORM}\nuniform float uDark;\nuniform vec2 uSwap;\nuniform vec3 uGround;\nuniform vec3 uGlyphInk;`)
      .replace(ANCHOR_OUTPUT, DARK_OUTPUT)
  );
  e.uniforms.set("uDark", new THREE.Uniform(0));
  e.uniforms.set("uSwap", new THREE.Uniform(new THREE.Vector2(...SWAP_NEAR_WHITE)));
  e.uniforms.set("uGround", new THREE.Uniform(new THREE.Color("#121110"))); // linear via ColorManagement
  e.uniforms.set("uGlyphInk", new THREE.Uniform(new THREE.Color("#ece6da")));
  return e.uniforms;
}

export const SOURCE_FRAG = /* glsl */ `
  uniform sampler2D uVideo;
  uniform float uKeyBlack;
  varying vec2 vUv;
  void main() {
    vec3 c = texture2D(uVideo, vUv).rgb;
    float m = max(c.r, max(c.g, c.b));
    // compressed "black" sits around 0.01-0.03 linear; key generously below the subject.
    c = mix(c, mix(vec3(1.0), c, smoothstep(0.03, 0.09, m)), uKeyBlack);
    gl_FragColor = vec4(c, 1.0);
  }`;
export const SOURCE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

// Published types omit these runtime methods; declare what we call.
export type Grid = MemoryGrid & { gridW: number; gridH: number; setVideoTransform(sx: number, sy: number, ox: number, oy: number): void };
export type Ascii = AsciiEffect & { setGridSize(w: number, h: number): void };
