import ScaledModelWrapper from '../canvas/components/ScaledModelWrapper';
import { SelectableObjectRef } from '../canvas/types';

export default function CustomObject({ color = 'purple', meshRef }: { color?: string, meshRef: SelectableObjectRef }) {
  return (
    <ScaledModelWrapper meshRef={meshRef}>
      <group>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.4]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </ScaledModelWrapper>
  )
}