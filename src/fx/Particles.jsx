import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLDS } from '../data/worlds'
import { motion, REDUCED } from '../state/motion'

// Cosmic dust drifting in front of and behind the floating text — grounds it in
// the world. Custom point shader: at rest each particle is a soft round mote; at
// scroll speed the sprite stretches along its radial screen direction → warp streaks.
const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  varying vec3 vColor;
  varying vec2 vNdc;
  uniform float uWarp;
  void main(){
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec4 proj = projectionMatrix * mv;
    vNdc = proj.xy / max(proj.w, 0.0001);
    float size = 130.0 / max(-mv.z, 1.0);
    gl_PointSize = clamp(size * (1.0 + uWarp * 5.0), 1.0, 72.0);
    gl_Position = proj;
  }
`
const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying vec2 vNdc;
  uniform float uWarp;
  uniform float uOpacity;
  void main(){
    vec2 p = gl_PointCoord - 0.5;
    p.y = -p.y;                                   // gl_PointCoord y is top-down
    float l = length(vNdc);
    vec2 dir = l > 0.001 ? vNdc / l : vec2(0.0, 1.0); // radial screen direction
    float along  = dot(p, dir);
    float across = dot(p, vec2(-dir.y, dir.x));
    // compress across-axis with warp → ellipse stretched along the radial dir
    float d = length(vec2(along, across * (1.0 + uWarp * 6.0))) * 2.0;
    float a = smoothstep(1.0, 0.15, d);
    gl_FragColor = vec4(vColor, a * uOpacity);
  }
`

export default function Particles({ count = 1400 }) {
  const ref = useRef()
  const matRef = useRef()
  const zMin = WORLDS[WORLDS.length - 1].z - 8
  const zMax = WORLDS[0].z + 12

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = zMin + Math.random() * (zMax - zMin)
      c.setHSL(0.6 + Math.random() * 0.25, 0.6, 0.7)
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [count, zMin, zMax])

  const uniforms = useMemo(() => ({
    uWarp: { value: 0 },
    uOpacity: { value: 0.85 }
  }), [])

  useFrame((s) => {
    if (ref.current && !motion.frozen) {
      ref.current.rotation.y = s.clock.elapsedTime * 0.012
      ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.15) * 0.4
    }
    if (matRef.current && !REDUCED) {
      matRef.current.uniforms.uWarp.value = motion.frozen ? 0 : motion.velocity
    }
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
