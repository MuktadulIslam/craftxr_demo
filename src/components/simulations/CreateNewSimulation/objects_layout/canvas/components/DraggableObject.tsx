import { DragControls } from "@react-three/drei"
import React, { memo, use, useCallback, useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import { useMeshContext } from "../context/MeshContext"
import { SelectableObjectRef } from "../types"

interface DraggableObjectProps {
  objectId: string,
  position: [number, number, number],
  groundSize: { width: number, depth: number },
  setOrbitEnabled: (enabled: boolean) => void,
  children: React.ReactNode,
  meshRef?: SelectableObjectRef
}

// Store original material states
interface MaterialState {
  material: THREE.Material;
  originalEmissive: THREE.Color;
  originalEmissiveIntensity: number;
}


const DraggableObject = memo(function DraggableObject({
  objectId,
  position,
  groundSize,
  setOrbitEnabled,
  children,
  meshRef
}: DraggableObjectProps) {

  const { setObject, selectedObjectId } = useMeshContext();
  const [objectPosition, setObjectPosition] = useState<[number, number, number]>([position[0], 0, position[2]]) // for now everything should be on ground
  const [dragLimits, setDragLimits] = useState<[[number, number], [number, number], [number, number]]>([[0, groundSize.width], [0, 0], [0, groundSize.depth]])
  const groupRef = useRef<THREE.Group>(null)
  const actualMeshRef = meshRef || groupRef;
  // Store original material states for this specific instance
  const originalMaterialsRef = useRef<Map<THREE.Material, MaterialState>>(new Map());

  // Setting Object Limits
  useEffect(() => {
    if (actualMeshRef.current) {
      const box = new THREE.Box3().setFromObject(actualMeshRef.current)
      const size = new THREE.Vector3()
      box.getSize(size)
      const minEdge = box.min.clone();
      const maxEdge = box.max.clone();

      const collisionPreventionThreshold = 0.05;
      const minX = -groundSize.width / 2 - minEdge.x + collisionPreventionThreshold;
      const maxX = groundSize.width / 2 - maxEdge.x - collisionPreventionThreshold;
      const minZ = -groundSize.depth / 2 - minEdge.z + collisionPreventionThreshold;
      const maxZ = groundSize.depth / 2 - maxEdge.z - collisionPreventionThreshold;

      setDragLimits([
        [minX, maxX], // X limits
        [0, 0], // Y fixed to place object on ground
        [minZ, maxZ]  // Z limits
      ]);

      setObjectPosition((position) => {
        // for x-axis
        if (position[0] < -groundSize.width / 2) position[0] = -groundSize.width / 2;
        else if (position[0] > groundSize.width / 2) position[0] = groundSize.width / 2;
        // for z-asis
        if (position[2] < -groundSize.depth / 2) position[2] = -groundSize.depth / 2;
        else if (position[2] > groundSize.depth / 2) position[2] = groundSize.depth / 2;

        if (actualMeshRef.current) {
          // y-asis will only for main (actualMeshRef) 3D component
          actualMeshRef.current.position.set(position[0], position[1], position[2])
        }
        if (actualMeshRef.current) {
          actualMeshRef.current.position.y = -minEdge.y;
        }
        return position;
      })
    }
  }, [groundSize.width, groundSize.depth, actualMeshRef])

  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (actualMeshRef.current) {
      setObject(actualMeshRef.current.children[0], objectId);
    }
  }, [actualMeshRef, objectId, setObject]);


  // Apply hover effect
  const applyHoverEffect = useCallback((isHover: boolean, isSelected: boolean = false) => {
    if (!actualMeshRef.current) return;

    actualMeshRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];

        materials.forEach((mat) => {
          const materialState = originalMaterialsRef.current.get(mat);
          if (materialState) {
            if (isSelected) {
              mat.emissive.setHex(0x0066ff);
              mat.emissiveIntensity = 0.3;
            } else if (isHover) {
              mat.emissive.setHex(0x00ff66);
              mat.emissiveIntensity = 0.2;
            } else {
              // Restore original state
              mat.emissive.copy(materialState.originalEmissive);
              mat.emissiveIntensity = materialState.originalEmissiveIntensity;
            }
          }
        });
      }
    });
  }, [actualMeshRef]);

  // Initialize and store original material states
  useEffect(() => {
    if (actualMeshRef.current) {
      actualMeshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];

          materials.forEach((mat) => {
            if (!originalMaterialsRef.current.has(mat)) {
              // Clone the material for this instance
              const clonedMaterial = mat.clone();
              child.material = Array.isArray(child.material)
                ? child.material.map(m => m === mat ? clonedMaterial : m)
                : clonedMaterial;

              // Store original state
              originalMaterialsRef.current.set(clonedMaterial, {
                material: clonedMaterial,
                originalEmissive: clonedMaterial.emissive?.clone() || new THREE.Color(0x000000),
                originalEmissiveIntensity: clonedMaterial.emissiveIntensity || 0
              });
            }
          });
        }
      });
    }
  }, [children, actualMeshRef]);

  // Selection effect
  useEffect(() => {
    const isSelected = selectedObjectId === objectId;
    applyHoverEffect(false, isSelected);
  }, [selectedObjectId, objectId, applyHoverEffect]);

  const handlePointerOver = useCallback(() => {
    if (selectedObjectId !== objectId) {
      applyHoverEffect(true, false);
    }
  }, [selectedObjectId, objectId, applyHoverEffect]);

  const handlePointerOut = useCallback(() => {
    if (selectedObjectId !== objectId) {
      applyHoverEffect(false, false);
    }
  }, [selectedObjectId, objectId, applyHoverEffect]);

  return (
    <DragControls
      onDragStart={() => setOrbitEnabled(false)}
      onDragEnd={() => setOrbitEnabled(true)}
      dragLimits={dragLimits}
    >
      <group
        ref={actualMeshRef}
        position={objectPosition}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onDoubleClick={handleDoubleClick}
      >
        {children}
      </group>
    </DragControls>
  )
});

export default DraggableObject;