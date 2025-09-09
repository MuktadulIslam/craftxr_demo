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

// Utility function to apply glow effect to all meshes in an object
const applyGlowEffect = (object: THREE.Object3D, isSelected: boolean, isHovered: boolean) => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      // Store original material properties if not already stored
      if (!child.userData.originalMaterial) {
        child.userData.originalMaterial = {
          emissive: child.material.emissive?.clone() || new THREE.Color(0x000000),
          emissiveIntensity: child.material.emissiveIntensity || 0,
          color: child.material.color?.clone() || new THREE.Color(0xffffff),
        };
      }

      const original = child.userData.originalMaterial;

      if (isSelected) {
        // Selected effect - blue glow
        if (child.material.emissive) {
          child.material.emissive.setHex(0x0066ff);
          child.material.emissiveIntensity = 0.3;
        }
        // if (child.material.color) {
        //   child.material.color.copy(original.color).multiplyScalar(1.2);
        // }
      } else if (isHovered) {
        // Hovered effect - green glow
        if (child.material.emissive) {
          child.material.emissive.setHex(0x00ff66);
          child.material.emissiveIntensity = 0.2;
        }
        // if (child.material.color) {
        //   child.material.color.copy(original.color).multiplyScalar(1.1);
        // }
      } else {
        // Reset to original
        if (child.material.emissive) {
          child.material.emissive.copy(original.emissive);
          child.material.emissiveIntensity = original.emissiveIntensity;
        }
        // if (child.material.color) {
        //   child.material.color.copy(original.color);
        // }
      }

      // Ensure material updates
      child.material.needsUpdate = true;
    }
  });
};

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

  useEffect(() => {
    if (selectedObjectId == objectId && actualMeshRef.current) {
      actualMeshRef.current?.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          child.material.emissive.setHex(0x0066ff);
          child.material.emissiveIntensity = 0.3;
        }
      });
    }

    return () => {
      if (actualMeshRef.current) {
        actualMeshRef.current?.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            child.material.emissiveIntensity = 0;
          }
        });
      }
    }
  }, [selectedObjectId])

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

  const handlePointerOver = useCallback(() => {
    if (selectedObjectId !== objectId) {
      actualMeshRef.current?.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          child.material.emissive.setHex(0x00ff66);
          child.material.emissiveIntensity = 0.2;
        }
      });
    }
  }, [selectedObjectId]);

  const handlePointerOut = useCallback(() => {
    if (selectedObjectId !== objectId) {
      actualMeshRef.current?.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          child.material.emissive.setHex(0x00ff66);
          child.material.emissiveIntensity = 0;
        }
      });
    }
  }, [selectedObjectId]);

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