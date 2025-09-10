import { SelectableObjectRef } from "../types";

export interface DraggableObjectData {
    id: string;
    componentFactory: (meshRef: SelectableObjectRef) => React.ReactNode ;
    name: string;
    icon: string;
    description: string;
}

export interface DraggableObjectGroup {
    id: string;
    name: string;
    icon: string;
    color: string;
    objects: DraggableObjectData[];
}