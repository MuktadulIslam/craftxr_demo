'use client'
import { useFBX } from '@react-three/drei'
import { useMemo } from 'react'
import ScaledModelWrapper from '../../canvas/components/ScaledModelWrapper'
import { SelectableObjectRef } from '../../canvas/types'

export default function WaitingBench({ meshRef }: { meshRef: SelectableObjectRef }) {
    const fbx = useFBX('/xr_3dmodels/waiting_bench.fbx')
    const clonedScene = useMemo(() => fbx.clone(), [fbx])

    return (
        <ScaledModelWrapper meshRef={meshRef}>
            <primitive object={clonedScene} />
        </ScaledModelWrapper>
    );
}