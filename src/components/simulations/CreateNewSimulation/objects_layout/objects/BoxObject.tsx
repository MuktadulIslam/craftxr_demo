import ScaledModelWrapper from '../canvas/components/ScaledModelWrapper';
import { SelectableObjectRef } from '../canvas/types';

export default function BoxObject({ color = 'green', meshRef}: { color?: string, meshRef: SelectableObjectRef }) {
    return (
        <ScaledModelWrapper meshRef={meshRef}>
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </ScaledModelWrapper>
    )
}