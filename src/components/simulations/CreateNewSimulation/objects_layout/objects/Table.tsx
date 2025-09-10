import ScaledModelWrapper from '../canvas/components/ScaledModelWrapper';
import { SelectableObjectRef } from '../canvas/types';

export default function Table({ color = 'brown', meshRef }: { color?: string, meshRef: SelectableObjectRef }) {

  return (
    <ScaledModelWrapper meshRef={meshRef} >
      <group>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[2, 0.1, 1.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[-0.8, 0.4, -0.6]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.8, 0.4, -0.6]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[-0.8, 0.4, 0.6]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.8, 0.4, 0.6]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </ScaledModelWrapper>
  );
}