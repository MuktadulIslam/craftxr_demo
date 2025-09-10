'use client'
import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import ScaledModelWrapper from '../../canvas/components/ScaledModelWrapper'
import { SelectableObjectRef } from '../../canvas/types'

export default function Wheelchair({ meshRef }: { meshRef: SelectableObjectRef }) {
    const { scene } = useGLTF('/xr_3dmodels/wheelchair.glb')
    const clonedScene = useMemo(() => scene.clone(), [scene])

    return (
        <ScaledModelWrapper meshRef={meshRef}>
            <primitive object={clonedScene} />
        </ScaledModelWrapper>
    );
}