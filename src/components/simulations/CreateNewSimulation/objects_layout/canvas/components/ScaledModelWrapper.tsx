import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useRoomContext } from '../context/RoomDimensionsContext';
import { SelectableObjectRef } from '../types';

interface ScaledModelWrapperProps {
    children: React.ReactNode;
    meshRef: SelectableObjectRef
}

export default function ScaledModelWrapper({
    children,
    meshRef
}: ScaledModelWrapperProps) {
    const previousScale = useRef<THREE.Vector3>(null);
    const { dimensions: roomDimensions } = useRoomContext();

    const processScaling = useCallback(() => {
        if (!meshRef.current || !roomDimensions) return 1;
        try {
            // Calculate the bounding box
            const box = new THREE.Box3().setFromObject(meshRef.current);
            if (box.isEmpty()) return 1;

            const size = new THREE.Vector3();
            box.getSize(size);

            const maxScaleDownFactor = Math.max(size.x / roomDimensions.length, size.z / roomDimensions.width, size.y / roomDimensions.height);
            return 1 / maxScaleDownFactor;
        } catch (error) {
            console.warn('❌ Error in scaling:', error);
            return 1;
        }
    }, [roomDimensions, meshRef]);

    // Reset when children change
    useEffect(() => {
        if (meshRef.current && meshRef.current.scale != previousScale.current) {
            const scaleDownFactor = processScaling() * 0.4;   // Adjust the scale down factor as needed
            meshRef.current.scale.set(scaleDownFactor, scaleDownFactor, scaleDownFactor);
            previousScale.current = meshRef.current.scale;
        }
    }, [meshRef, roomDimensions, processScaling]);

    return (
        <>
            <group ref={meshRef}>
                {children}
            </group>
        </>
    );
}