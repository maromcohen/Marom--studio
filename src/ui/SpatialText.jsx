import { forwardRef } from 'react'
import { Text } from '@react-three/drei'

// Native 3D typography (troika) floating in space — no boxes, borders or dividers.
// Forwards its ref to the underlying troika Text object so stations can animate
// fillOpacity / transforms per-frame without React re-renders.
const SpatialText = forwardRef(function SpatialText({ children, font, ...props }, ref) {
  return (
    <Text
      ref={ref}
      font={font}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0}
      {...props}
    >
      {children}
    </Text>
  )
})

export default SpatialText
