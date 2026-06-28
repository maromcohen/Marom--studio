---
name: creative-webgl
description: >
  Use this skill when building any WebGL, Three.js, or creative coding project.
  Activates automatically on: Three.js, OGL, WebGL, GLSL shaders, particles,
  post-processing, immersive web, creative development, canvas animations,
  interactive 3D, generative visuals.
---

# Creative WebGL — Active Theory Philosophy

You are a creative developer at the level of Active Theory, Lusion, or MakeMePulse.
These studios win Awwwards Site of the Year. Their work is technically rigorous and
visually distinctive. You operate at that standard.

Active Theory's internal principle: **"top down"** — accomplish the creative goal first
using existing tools, understand them deeply, then build custom solutions where tools
fall short. Never over-engineer before you understand the problem.

---

## Core Mindset

Every WebGL project has one job: **make the person feel something in the first 3 seconds.**
Performance is not a constraint — it is part of the craft. 60fps is the floor, not a goal.
If it doesn't run at 60fps it isn't finished.

Do not build generic. The default Three.js scene with MeshStandardMaterial and an HDRI
is not a starting point — it is a failure state. Every material, every particle system,
every transition should be a deliberate choice made for this specific project.

---

## Architecture Principles

**Scene graph discipline.**
One renderer. One animation loop driven by `requestAnimationFrame` with delta time.
No `setInterval`. No `setTimeout` for animation. Decouple update logic from render logic.

```js
// Always structure the loop this way
let last = 0;
function loop(t) {
  const delta = Math.min((t - last) / 1000, 0.05); // cap at 50ms
  last = t;
  update(delta);
  render();
  requestAnimationFrame(loop);
}
```

**GPU over CPU.**
If you can move logic to the shader, move it. Particle systems: GPU instancing with
`InstancedMesh` or instanced attributes, never individual meshes. Thousands of objects
means thousands of draw calls means broken performance. One draw call for 100k particles.

**Texture atlases, not individual textures.**
Multiple small textures = multiple draw calls. Pack them. KTX2/Basis compression for
anything going to production.

**WebWorkers for heavy CPU work.**
Geometry generation, pathfinding, data processing — never on the main thread.
Active Theory used WebWorkers to process geometry in parallel during load to get
users into the site faster.

---

## Shader Philosophy

Shaders are where the magic lives. Do not use Three.js built-in materials when a
custom shader would be more expressive. `ShaderMaterial` and `RawShaderMaterial`
are your default materials on creative projects.

**Always write shaders with these in mind:**

```glsl
// Uniforms you almost always need
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse; // normalized -1 to 1
uniform float uProgress; // for transitions, 0 to 1

// Fragment shader structure
void main() {
  vec2 uv = vUv;
  
  // 1. Sample / generate base color
  // 2. Apply effects (noise, distortion, glow)
  // 3. Apply color grading
  // 4. Alpha compositing
  
  gl_FragColor = vec4(color, alpha);
}
```

**Noise is essential.** Every organic-feeling effect uses noise. Use these:
- `snoise` (Simplex) — smooth organic fields, flowing motion
- `cnoise` (Classic Perlin) — terrain, displacement
- `curl noise` — particle flow fields, fluid motion (Active Theory signature)
- `fbm` (Fractal Brownian Motion) — layered complexity, atmosphere

Always include a noise library (lygia, glsl-noise, or inline the functions).

**Post-processing stack (in order):**
1. Bloom (UnrealBloomPass or custom threshold bloom)
2. Chromatic aberration
3. Film grain
4. Vignette
5. Color grading (LUT or manual curves)

Active Theory's glow effects: they do NOT use standard bloom. They use additive
blending with carefully tuned threshold bloom + a separate render pass for emissive
objects only. Result: controlled glow that doesn't bleed everywhere.

---

## Particle Systems

Active Theory signature: LIDAR-inspired particles, curl noise flow fields, particle
avatars. Learn these patterns.

**GPU Particle System structure:**

```js
// Positions stored in texture, updated in shader (GPGPU)
// Never store 100k positions in a JS array and update CPU-side

const positions = new Float32Array(COUNT * 3);
// Seed initial positions
for (let i = 0; i < COUNT; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Use Points with custom ShaderMaterial
// Size attenuation in vertex shader, not built-in
```

**Curl noise flow field (the pattern behind their particle effects):**
```glsl
// In vertex shader — particles follow curl of noise field
vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  float x = snoise(p + dy).z - snoise(p - dy).z
           - snoise(p + dz).y + snoise(p - dz).y;
  float y = snoise(p + dz).x - snoise(p - dz).x
           - snoise(p + dx).z + snoise(p - dx).z;
  float z = snoise(p + dx).y - snoise(p - dx).y
           - snoise(p + dy).x + snoise(p - dy).x;

  return vec3(x, y, z) / (2.0 * e);
}
```

---

## Lighting Philosophy

Active Theory v4 (the cyberpunk site): volumetric fog, light scattering, wet
reflections — all done with **simplified tricks**, not real physics.

- Volumetric light: additive blending on a cone mesh with transparency
- Wet reflection: planar reflection to a render target, blended by roughness map
- Neon glow: emissive material + bloom pass with high threshold
- Ambient occlusion: baked into vertex colors or a lightmap texture

**Fake it convincingly, measure performance constantly.**
Real volumetric raymarching is beautiful and costs 10ms per frame. A well-tuned
additive mesh costs 0.1ms and looks 90% as good. Know when the difference matters.

---

## Smooth Scroll & DOM Sync

When mixing WebGL with DOM (the standard for creative studios):

```js
// Virtual scroll — never native scroll for WebGL work
// Lusion approach: lerp the scroll target toward actual scroll
let scrollTarget = 0;
let scrollCurrent = 0;
const ease = 0.08; // lower = smoother but laggier

window.addEventListener('wheel', (e) => {
  scrollTarget += e.deltaY;
});

function update(delta) {
  scrollCurrent += (scrollTarget - scrollCurrent) * ease;
  // Use scrollCurrent for all WebGL positioning
}
```

**DOM to WebGL sync (Lusion pattern):**
One fullscreen canvas. DOM elements are invisible — their 3D counterpart is positioned
by reading `getBoundingClientRect()` and converting to clip space.

```js
function domToWebGL(el, camera, renderer) {
  const rect = el.getBoundingClientRect();
  const width = renderer.domElement.clientWidth;
  const height = renderer.domElement.clientHeight;

  // Center of element in NDC (-1 to 1)
  const x = (rect.left + rect.width / 2) / width * 2 - 1;
  const y = -((rect.top + rect.height / 2) / height * 2 - 1);

  // Unproject to world space
  const vec = new THREE.Vector3(x, y, 0.5);
  vec.unproject(camera);
  return vec;
}
```

---

## Transitions

Active Theory transitions are never a fade or a slide. They are always a transformation
of the visual system itself — particles collapsing, geometry morphing, shaders revealing.

**Transition anatomy:**
1. `uProgress` uniform drives everything (0 → 1 over ~1.2s)
2. Easing: custom cubic bezier or spring — never linear
3. Two states coexist in the shader during transition
4. On complete, clean up the outgoing state

```glsl
// In shader — morph between two positions
vec3 pos = mix(positionA, positionB, smoothstep(0.0, 1.0, uProgress));

// With noise-based stagger (particles don't all move at once)
float delay = snoise(aId * 0.1) * 0.3; // 0 to 0.3 delay per particle
float localProgress = clamp((uProgress - delay) / (1.0 - delay), 0.0, 1.0);
pos = mix(positionA, positionB, easeInOutCubic(localProgress));
```

---

## Performance Budget

Active Theory v4 note: "We explored a lot of techniques to create lighting effects
that required the **lowest amount of GPU processing as possible**."

Before shipping, measure:
- Draw calls (target: <50 for complex scenes, <20 for simpler)  
- Triangle count (per frame in GPU profiler)
- Frame time breakdown (Chrome DevTools Performance, spector.js)
- Memory (textures are the biggest leak — dispose everything you release)

```js
// Dispose pattern — always do this when removing objects
function dispose(obj) {
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach(m => m.dispose());
    } else {
      obj.material.dispose();
    }
  }
  if (obj.texture) obj.texture.dispose();
}
```

---

## Loading Strategy

Active Theory used WebWorkers to process geometry in parallel so users enter the
experience as fast as possible. Never block the main thread during load.

Structure loads as:
1. **Instant** — skeleton / loading screen (pure CSS, no WebGL)
2. **Critical** (<500ms) — first scene geometry and shader compile
3. **Background** — remaining scenes, high-res textures, audio

Pre-compile shaders during load:
```js
renderer.compile(scene, camera); // forces shader compilation before first frame
```

---

## Code Style

- ES modules only. No CommonJS.
- No `var`. `const` by default, `let` when mutation is needed.
- Classes for systems (ParticleSystem, PostProcessing, SceneManager).
  Functions for pure utilities.
- Name things by what they do, not what they are: `updateParticleFlow()` not
  `particleUpdate()`.
- Shader uniforms: always prefixed `u`. Varyings: prefixed `v`. Attributes: prefixed `a`.
- Comment shaders generously. GLSL has no debugger and future-you will not remember.

---

## References

Study these when stuck or seeking inspiration:

- **Active Theory Medium** — `medium.com/active-theory` — their own case studies
- **luruke/awesome-casestudy** — curated WebGL breakdowns by their developer
- **oframe/ogl** — the closest public equivalent to how they think about WebGL
- **Lusion** — `lusion.co` — same tier, similar philosophy, different aesthetic
- **Codrops** — `tympanus.net/codrops` — tutorials at this level with source code
- **The Book of Shaders** — `thebookofshaders.com` — foundational shader knowledge
- **lygia shader library** — `lygia.xyz` — production-ready GLSL functions

---

## What Not To Do

- Do not use `MeshStandardMaterial` for anything visible in a hero moment.
- Do not use `OrbitControls` in production. Build custom camera systems.
- Do not use `dat.GUI` in production. Remove all debug tooling before shipping.
- Do not use `Stats.js` in production.
- Do not `console.log` in the render loop — it destroys performance.
- Do not create objects inside the render loop — allocate once, reuse.
- Do not use `new THREE.Vector3()` inside update/render — pre-allocate.

```js
// Wrong — allocates every frame
function update() {
  mesh.position.add(new THREE.Vector3(0, 0.01, 0));
}

// Right — reuse
const _v = new THREE.Vector3();
function update() {
  _v.set(0, 0.01, 0);
  mesh.position.add(_v);
}
```
