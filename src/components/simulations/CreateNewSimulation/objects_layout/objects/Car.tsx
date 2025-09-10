import ScaledModelWrapper from '../canvas/components/ScaledModelWrapper';
import { SelectableObjectRef } from '../canvas/types';

export default function Car({ color = 'red', meshRef }: { color?: string, meshRef: SelectableObjectRef }) {

    return (
        <ScaledModelWrapper meshRef={meshRef}>
            <group>
                <mesh position={[0, 0.3, 0]}>
                    <boxGeometry args={[2, 0.6, 1]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[0, 0.8, 0]}>
                    <boxGeometry args={[1.2, 0.4, 0.8]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[-0.7, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[0.7, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[-0.7, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[0.7, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </group>
        </ScaledModelWrapper>
    )
}