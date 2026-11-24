// The ink bleed computed at half resolution, then multiplied over the glyphs exactly like the full
// pass. Its output is a 64-tap soft blur (blur: 1 replaces everything else), so a quarter of the
// pixels carry the same information; the crisp glyphs come from the pass below, untouched.
// Runs the package's own bleed shader, sharing its uniforms (radius, baked kernel).
import * as THREE from "three";
import { Effect, BlendFunction } from "postprocessing";
import type { InkBleedEffect } from "@niccolofanton/morphing-ascii-shader";

export class HalfBleedEffect extends Effect {
  private rt: THREE.WebGLRenderTarget;
  private mat: THREE.ShaderMaterial;
  private scene = new THREE.Scene();
  private cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private src: InkBleedEffect;

  constructor(src: InkBleedEffect) {
    const rt = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false });
    super(
      "HalfBleedEffect",
      /* glsl */ `uniform sampler2D tBleed;
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  outputColor = vec4(texture2D(tBleed, uv).rgb, inputColor.a);
}`,
      { blendFunction: BlendFunction.MULTIPLY, uniforms: new Map([["tBleed", new THREE.Uniform(rt.texture)]]) }
    );
    this.rt = rt;
    this.src = src;
    const u = (src as unknown as { uniforms: Map<string, THREE.IUniform> }).uniforms;
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        inputBuffer: { value: null },
        resolution: { value: new THREE.Vector2(1, 1) },
        uBleed: u.get("uBleed")!,
        uRadius: u.get("uRadius")!,
        uBlur: u.get("uBlur")!,
        uKernel: u.get("uKernel")!,
      },
      vertexShader: /* glsl */ `varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: /* glsl */ `uniform sampler2D inputBuffer;
uniform vec2 resolution;
varying vec2 vUv;
${(src as unknown as { getFragmentShader(): string }).getFragmentShader()}
void main() { vec4 o; mainImage(texture2D(inputBuffer, vUv), vUv, o); gl_FragColor = o; }`,
      depthTest: false,
      depthWrite: false,
    });
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mat));
  }

  // The source effect is never added to a pass, so let it bake its kernel here, as a pass would.
  initialize(renderer: THREE.WebGLRenderer, alpha: boolean, frameBufferType: number) {
    super.initialize(renderer, alpha, frameBufferType);
    this.src.initialize(renderer, alpha, frameBufferType);
  }

  update(renderer: THREE.WebGLRenderer, inputBuffer: THREE.WebGLRenderTarget) {
    this.mat.uniforms.inputBuffer.value = inputBuffer.texture;
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(this.rt);
    renderer.render(this.scene, this.cam);
    renderer.setRenderTarget(prev);
  }

  // `resolution` stays the full size: the shader turns its pixel radius into uv with it.
  setSize(w: number, h: number) {
    this.rt.setSize(Math.max(1, w >> 1), Math.max(1, h >> 1));
    this.mat.uniforms.resolution.value.set(w, h);
  }

  dispose() {
    super.dispose();
    this.src.dispose();
    this.rt.dispose();
    this.mat.dispose();
  }
}
