"use client"
import { SimulationOutcomeState } from '@/types/simulationChat';
import { CSSProperties } from 'react';
import { Node } from '@xyflow/react';

export interface DialogNodeData {
    label: 'Avatar' | 'Human',
    dialog: string,
    outcome_state: SimulationOutcomeState,
    intent: string,
    topic: string,
    speaker: 'A' | 'V',
    chat_level: `L${number}`,
    simulation_chat_id?: string,
    isFirstNode: boolean,
    editable: boolean;
    allowToAddNewDialog: boolean;
    allowToRemoveDialog: boolean;
    allowToUpdateDialog: boolean;
    [key: string]: unknown; // Add this index signature
}

export interface DialogEditPayload {
    dialog: string,
    intent: string,
    topic: string,
    outcome_state: SimulationOutcomeState,
    simulation_chat_id: string | undefined
}

export interface DialogFlowNode extends Node<DialogNodeData> {
    id: string;
    type: 'dialogNode';
    position: { x: number; y: number };
    data: DialogNodeData;
    width?: number; // Added for layout calculation
}

export interface InteractiveDialogNodeData extends DialogNodeData {
    onAddNode: (parentId: string, nodeType: string) => void,
    onDeleteNode: (nodeId: string) => void,
    onEditNode: (nodeId: string, updatedData: DialogEditPayload) => void,
}

export interface InteractiveDialogNode {
    id: string,
    type: 'dialogNode',
    position: { x: number, y: number },
    data: InteractiveDialogNodeData,
}

export interface DialogFlowEdge {
    id: string,
    source: string,
    target: string,
    animated: true | false,
    style?: CSSProperties,
}