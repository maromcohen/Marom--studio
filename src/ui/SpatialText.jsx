import { Text } from '@react-three/drei'

// Native 3D typography (troika) floating in space — no boxes, borders or dividers.
export default function SpatialText({ children, font, ...props }) {
  return (
    <Text
      font={font}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0}
      {...props}
    >
      {children}
    </Text>
  )
}
