import ScaledModelWrapper from '../canvas/components/ScaledModelWrapper';
import { SelectableObjectRef } from '../canvas/types';

export default function Chair({ color = 'blue', meshRef}: { color?: string, meshRef: SelectableObjectRef }) {
    return (
        <ScaledModelWrapper meshRef={meshRef}>
            <group>
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[0.8, 0.1, 0.8]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[0, 0.9, -0.35]}>
                    <boxGeometry args={[0.8, 0.8, 0.1]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[-0.3, 0.25, -0.3]}>
                    <boxGeometry args={[0.05, 0.5, 0.05]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[0.3, 0.25, -0.3]}>
                    <boxGeometry args={[0.05, 0.5, 0.05]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[-0.3, 0.25, 0.3]}>
                    <boxGeometry args={[0.05, 0.5, 0.05]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[0.3, 0.25, 0.3]}>
                    <boxGeometry args={[0.05, 0.5, 0.05]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            </group>
        </ScaledModelWrapper>
    )
}