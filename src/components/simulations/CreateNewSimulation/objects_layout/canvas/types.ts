import { Group, Mesh, Object3D } from "three";

export type SelectableObject = Mesh | Group | Object3D | null;
export type SelectableObjectRef =  React.RefObject<Mesh | Group | Object3D | null>;

export interface PlacedObject {
  id: string;
  component: React.ReactNode;
  position: [number, number, number];
  meshRef: SelectableObjectRef;
}
