'use client'
import { useGLTF, useFBX } from '@react-three/drei'
import { useMemo } from 'react'
import ScaledModelWrapper from '../components/ScaledModelWrapper'
import MeshyModel from '../meshy/components/MeshyModel'
import { SelectableObjectRef } from '../types'

interface Dynamic3DModelProps {
    url: string;
    meshRef: SelectableObjectRef;
    fileType: 'glb' | 'fbx';
    isMeshyUrl?: boolean;
}

// Separate component for GLB files
function GLBModel({ url, meshRef }: { url: string; meshRef: SelectableObjectRef }) {
    const gltf = useGLTF(url);

    const clonedScene = useMemo(() => {
        return gltf.scene.clone();
    }, [gltf]);

    return (
        <ScaledModelWrapper meshRef={meshRef}>
            <primitive object={clonedScene} />
        </ScaledModelWrapper>
    );
}

// Separate component for FBX files
function FBXModel({ url, meshRef }: { url: string; meshRef: SelectableObjectRef }) {
    const fbx = useFBX(url);

    const clonedScene = useMemo(() => {
        return fbx.clone();
    }, [fbx]);

    return (
        <ScaledModelWrapper meshRef={meshRef}>
            <primitive object={clonedScene} />
        </ScaledModelWrapper>
    );
}

// Main component that conditionally renders the appropriate model component
export default function Dynamic3DModel({ url, meshRef, fileType, isMeshyUrl = false }: Dynamic3DModelProps) {
    // Check if this is a Meshy URL (either by prop or URL pattern)
    const isMeshyModelUrl = isMeshyUrl || url.includes('assets.meshy.ai');
    
    if (isMeshyModelUrl && fileType === 'glb') {
        // Use MeshyModel for Meshy URLs - it handles the proxy and blob conversion
        return <MeshyModel url={url} meshRef={meshRef}/>;
    } else if (fileType === 'glb') {
        return <GLBModel url={url} meshRef={meshRef} />;
    } else if (fileType === 'fbx') {
        return <FBXModel url={url} meshRef={meshRef} />;
    }

    return null;
}