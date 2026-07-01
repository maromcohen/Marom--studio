import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 2.5D parallax plane: a ShaderMaterial that displaces the video by a
// luminance-derived pseudo-depth, driven by mouse movement.
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uMouse;
  uniform float uStrength;
  uniform float uOpacity;
  varying vec2 vUv;
  void main(){
    vec3 base = texture2D(uMap, vUv).rgb;
    float depth = dot(base, vec3(0.299, 0.587, 0.114));   // luminance as pseudo depth map
    vec2 offset = uMouse * (depth - 0.5) * uStrength;
    vec3 col = texture2D(uMap, vUv + offset).rgb;
    gl_FragColor = vec4(col, uOpacity);
  }
`

export default function ParallaxVideo({ src, width = 8, height = 4.6, strength = 0.07, opacity = 1, ...props }) {
  const matRef = useRef()
  const { texture, video } = useMemo(() => {
    const video = document.createElement('video')
    video.src = src
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    const texture = new THREE.VideoTexture(video)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    return { texture, video }
  }, [src])

  useEffect(() => {
    video.play().catch(() => {})
    return () => video.pause()
  }, [video])

  const uniforms = useMemo(() => ({
    uMap: { value: texture },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uStrength: { value: strength },
    uOpacity: { value: opacity }
  }), [texture, strength, opacity])

  useFrame((s) => {
    if (matRef.current) {
      matRef.current.uniforms.uMouse.value.lerp(s.pointer, 0.06)
    }
  })

  return (
    <mesh {...props}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        toneMapped={false}
      />
    </mesh>
  )
}
