import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SelectableObject, PlacedObject, SelectableObjectRef } from '../types';

interface MeshContextType {
  // Current Object management (being dragged for placement)
  currentObject: React.ReactNode | null;
  setCurrentObject: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
  currentObjectRef: SelectableObjectRef | null;
  setCurrentObjectRef: React.Dispatch<React.SetStateAction<SelectableObjectRef | null>>;

  // Objects management
  objects: PlacedObject[];
  setObjects: React.Dispatch<React.SetStateAction<PlacedObject[]>>;
  addObject: (object: PlacedObject) => void;
  removeObject: (objectId: string) => void;
  updateObjectPosition: (objectId: string, newPosition: [number, number, number]) => void;

  // Selected object management
  selectedObject: SelectableObject;
  selectedObjectId: string | null;
  setObject: (object: SelectableObject, objectId: string) => void;
  clearObject: () => void;
  // Object controls visibility
  isObjectControlsVisible: boolean;
}

const MeshContext = createContext<MeshContextType | undefined>(undefined);

export const useMeshContext = () => {
  const context = useContext(MeshContext);
  if (context === undefined) {
    throw new Error('useMeshContext must be used within a MeshProvider');
  }
  return context;
};

interface MeshProviderProps {
  children: ReactNode;
}

export function MeshProvider({ children }: MeshProviderProps) {
  // Objects state
  const [objects, setObjects] = useState<PlacedObject[]>([]);
  // Current object being placed
  const [currentObject, setCurrentObject] = useState<React.ReactNode | null>(null);
  const [currentObjectRef, setCurrentObjectRef] = useState<SelectableObjectRef | null>(null);

  // Selected object state
  const [selectedObject, setSelectedObject] = useState<SelectableObject>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Object controls visibility
  const [isObjectControlsVisible, setObjectControlsVisible] = useState<boolean>(false);

  // Helper functions
  const addObject = (object: PlacedObject) => {
    setObjects(prev => [...prev, object]);
  };

  const removeObject = (objectId: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== objectId));

    // If the deleted object is currently selected, clear selection
    if (selectedObjectId === objectId) {
      clearObject();
    }
  };

  const updateObjectPosition = (objectId: string, newPosition: [number, number, number]) => {
    setObjects(prev => prev.map(obj => 
      obj.id === objectId 
        ? { ...obj, position: newPosition }
        : obj
    ));
  };

  const setObject = (object: SelectableObject, objectId: string) => {
    setSelectedObject(object);
    setSelectedObjectId(objectId);
    setObjectControlsVisible(true);
  };

  const clearObject = () => {
    setSelectedObject(null);
    setSelectedObjectId(null);
    setObjectControlsVisible(false);
  };

  const value: MeshContextType = {
    currentObject,
    setCurrentObject,
    currentObjectRef,
    setCurrentObjectRef,
    objects,
    setObjects,
    addObject,
    removeObject,
    updateObjectPosition,
    selectedObject,
    selectedObjectId,
    setObject,
    clearObject,
    isObjectControlsVisible,
  };

  return (
    <MeshContext.Provider value={value}>
      {children}
    </MeshContext.Provider>
  );
}