"use client"
import { SimulationChatType } from '@/types/simulationChat';
import { nanoid } from 'nanoid';
import { DialogFlowEdge, DialogFlowNode} from './types';


function generateId() {
    return `<<react-flow-${nanoid(10)}>>`;
}

    // Calculate subtree sizes (widths) for proper horizontal distribution
function calculateSubtreeSizes(chat: SimulationChatType): number {
    // Base case: no children
    if (!chat.subchat || chat.subchat.length === 0) {
        return 1; // Minimum width for a leaf node
    }
    
    // Recursive case: sum up all children's widths
    let totalWidth = 0;
    for (const subchat of chat.subchat) {
        totalWidth += calculateSubtreeSizes(subchat);
    }
    return Math.max(1, totalWidth) * 1.05;
}

// Process the tree and assign node positions
function processTree(
    chat: SimulationChatType, 
    editable: boolean,
    parentId: string | null,
    depth: number = 0,
    xOffset: number = 0,
    horizontalSpacing: number = 350,
    baseVerticalSpacing: number = 300,  // Base vertical spacing
    depthYPosition: number = 0,  // Track actual Y position for this depth
): [DialogFlowNode[], DialogFlowEdge[], number, number[]] {
    // Calculate dynamic vertical spacing based on number of children
    const childCount = chat.subchat?.length || 0;
    const verticalSpacing = baseVerticalSpacing + (childCount * 40); // Increase vertical space with more children
    // Create node ID
    const nodeId = generateId();
    
    // Calculate width for this subtree
    const subtreeWidth = calculateSubtreeSizes(chat);
    
    // Create node data
    const nodeData: DialogFlowNode = {
        id: nodeId,
        type: 'dialogNode',
        position: {
            x: 0, // Will be calculated later
            y: depthYPosition
        },
        data: {
            label: chat.speaker === 'A' ? 'Avatar' : 'Human',
            dialog: chat.chat.dialog,
            outcome_state: chat.outcome_state,
            intent: chat.chat.intent,
            topic: chat.chat.topic,
            speaker: chat.speaker,
            chat_level: chat.chat_level,
            simulation_chat_id: chat.simulation_chat_id,
            isFirstNode: parentId === null,
            editable: editable,
            allowToAddNewDialog: editable,
            allowToRemoveDialog: editable,
            allowToUpdateDialog: editable,
        },
        width: subtreeWidth
    };
    
    const nodes: DialogFlowNode[] = [nodeData];
    const edges: DialogFlowEdge[] = [];
    
    // Create edge to parent if not root
    if (parentId !== null) {
        edges.push({
            id: generateId(),
            source: parentId,
            target: nodeId,
            animated: true,
            style: { strokeWidth: 2 },
        });
    }
    
    // Process children if any
    if (chat.subchat && chat.subchat.length > 0) {
        let currentXOffset = xOffset;
        const childrenXPositions: number[] = [];
        
        // Calculate next depth's Y position
        const nextDepthY = depthYPosition + verticalSpacing;
        
        // First pass: process all children and collect their x positions
        for (const subchat of chat.subchat) {
            const [childNodes, childEdges, childXPos] = processTree(
                subchat,
                editable,
                nodeId,
                depth + 1,
                currentXOffset,
                horizontalSpacing, // Keep standard spacing for next level, only siblings are closer
                baseVerticalSpacing,
                nextDepthY
            );
            
            nodes.push(...childNodes);
            edges.push(...childEdges);
            childrenXPositions.push(childXPos);
            
            // Update offset for next child
            currentXOffset += childNodes[0].width || 1;
        }
        
        // Calculate parent's x position as average of its children
        if (childrenXPositions.length > 0) {
            const firstChildX = childrenXPositions[0];
            const lastChildX = childrenXPositions[childrenXPositions.length - 1];
            nodeData.position.x = (firstChildX + lastChildX) / 2;
        }
    } else {
        // For leaf nodes, position based on offset but with sibling spacing factor
        nodeData.position.x = xOffset * horizontalSpacing + horizontalSpacing/2;
    }
    
    // Return node positions at each depth for tracking
    const depthPositions = new Array(depth + 1).fill(0);
    depthPositions[depth] = depthYPosition;
    
    return [nodes, edges, nodeData.position.x, depthPositions];
}

export function getNodesAndEdges(
    chat: SimulationChatType, 
    editable: boolean = true, 
    initialPosition: { x: number, y: number }, 
    parentId: string | null
): [DialogFlowNode[], DialogFlowEdge[]] {
    // First, calculate the tree layout without considering the initial position
    const [nodes, edges, _, __] = processTree(chat, editable, parentId, 0, 0, 270, 190, 0);
    
    // Calculate the root node position offset to apply to all nodes
    const xOffset = initialPosition.x - nodes[0].position.x;
    const yOffset = initialPosition.y - nodes[0].position.y;
    
    // Apply offset to all nodes
    for (const node of nodes) {
        node.position.x += xOffset;
        node.position.y += yOffset;
        
        // Remove the temporary width property as it's not needed in the final output
        delete node.width;
    }
    
    return [nodes, edges];
}