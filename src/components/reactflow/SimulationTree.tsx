"use client"
import '@xyflow/react/dist/style.css';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    Connection
} from '@xyflow/react';


import { DialogFlowEdge, DialogFlowNode } from "./types";
import { DialogEditPayload } from "./types";
import { useCallback, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import DialogNodeView from './DialogNodeView';
import { useUpdateSimulationChat } from '@/lib/hooks/simulationHook';

interface EditableSimulationTreeProps {
    initialNodes: DialogFlowNode[];
    initialEdges: DialogFlowEdge[];
    editable: true;
    allowToAddNewDialog?: boolean;
    allowToRemoveDialog?: boolean;
    allowToUpdateDialog?: boolean;
    setUpdatedNodes: (nodes: DialogFlowNode[]) => void;
    setUpdatedEdges: (edges: DialogFlowEdge[]) => void;

    bgStyleClass?: string;
}

interface NonEditableSimulationTreeProps {
    initialNodes: DialogFlowNode[];
    initialEdges: DialogFlowEdge[];
    editable?: false;
    allowToAddNewDialog?: never;
    allowToRemoveDialog?: never;
    allowToUpdateDialog?: never;
    setUpdatedNodes?: never;
    setUpdatedEdges?: never;
    bgStyleClass?: string;
}

type SimulationTreeProps = EditableSimulationTreeProps | NonEditableSimulationTreeProps;


export default function SimulationTree(
    {
        initialNodes,
        initialEdges,
        editable,
        allowToAddNewDialog,
        allowToRemoveDialog,
        allowToUpdateDialog,
        setUpdatedNodes,
        setUpdatedEdges,
        bgStyleClass = 'text-black bg-white'
    }: SimulationTreeProps) {


    // State hooks
    // const [nodes, setNodes, onNodesChange] = useNodesState<DialogFlowNode[] | any>([]);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as DialogFlowNode[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<DialogFlowEdge>(initialEdges);
    const updateChat = useUpdateSimulationChat();
    const flowRef = useRef<HTMLDivElement>(null);
    // const firstRenderRef = useRef(true);

    useEffect(() => {
        const processedInitialNodes = initialNodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                editable: editable === true ? node.data.editable : false, // Force all nodes to be non-editable if component is non-editable
                allowToAddNewDialog: allowToAddNewDialog != undefined ? allowToAddNewDialog : editable === true ? node.data.editable : false,
                allowToRemoveDialog: allowToRemoveDialog != undefined ? allowToRemoveDialog : editable === true ? node.data.editable : false,
                allowToUpdateDialog: allowToUpdateDialog != undefined ? allowToUpdateDialog : editable === true ? node.data.editable : false,
            }
        }));

        setNodes(processedInitialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, allowToAddNewDialog, allowToRemoveDialog, allowToUpdateDialog, editable, setEdges, setNodes]);


    useEffect(() => {
        if (setUpdatedNodes) {
            setUpdatedNodes(nodes);
        }
    }, [nodes, setUpdatedNodes]);

    useEffect(() => {
        if (setUpdatedEdges) {
            setUpdatedEdges(edges);
        }
    }, [edges, setUpdatedEdges]);

    // Handle new connections with validation
    const onConnect = useCallback(
        (params: Connection) => {
            // Get source and target nodes
            const sourceNode = nodes.find(node => node.id === params.source);
            const targetNode = nodes.find(node => node.id === params.target);

            if (!sourceNode || !targetNode) return;

            // Check if target node already has ANY incoming connection
            const targetHasAnyConnection = edges.some(edge => edge.target === params.target);

            // If target already has any connection, don't allow new connection
            if (targetHasAnyConnection) {
                return;
            }

            // Check if nodes are of the same type (both Avatar or both Human)
            if (sourceNode.data.label === targetNode.data.label) {
                // Don't allow connection between same node types
                return;
            }

            // If all validations pass, add the edge with animation
            setEdges((eds) => addEdge({
                ...params,
                animated: true, // Make sure all edges are animated
                style: { strokeWidth: 3 }
            }, eds));
        },
        [setEdges, nodes, edges]
    );

    // Move createNewNode inside useCallback to fix the warning
    const onAddNode = useCallback((parentId: string, nodeType: 'Avatar' | 'Human') => {
        const parentNode = nodes.find(node => node.id === parentId) as DialogFlowNode;
        if (!parentNode) return null;

        const parentChatLevel = parentNode.data.chat_level;
        const parentLevel = parseInt(parentChatLevel.substring(1));

        // Create new node function moved inside the callback
        const createNewNode = (parentPosition: { x: number, y: number }, parentLevel: number, nodeType: 'Avatar' | 'Human'): DialogFlowNode => {
            // Calculate position for new node
            const newNodePosition = {
                x: parentPosition.x + Math.floor(Math.random() * 60 + 50),
                y: parentPosition.y + Math.floor(Math.random() * 100 + 200)
            };
            const newChatLevel = `L${parentLevel + 1}` as `L${number}`;

            // Create new node
            return {
                id: `<<react-flow-${nanoid(10)}>>`,
                type: 'dialogNode',
                position: newNodePosition,
                data: {
                    label: nodeType,
                    dialog: '',
                    // outcome_state: nodeType === 'Avatar' ? 'G' : null,
                    outcome_state: nodeType === 'Avatar' ? 'N' : 'G',
                    intent: '',
                    topic: '',
                    speaker: nodeType === 'Human' ? 'V' : 'A',
                    chat_level: newChatLevel,
                    isFirstNode: false,
                    editable: editable === true ? editable : false,
                    allowToAddNewDialog: allowToAddNewDialog != undefined ? allowToAddNewDialog : true,
                    allowToRemoveDialog: allowToUpdateDialog != undefined ? allowToUpdateDialog : true,
                    allowToUpdateDialog: allowToUpdateDialog != undefined ? allowToUpdateDialog : true,
                },
            };
        };

        const newAvatarNode = createNewNode({ x: parentNode.position.x, y: parentNode.position.y }, parentLevel, nodeType);

        // Add new node and connect with edge
        setNodes((nodes) => [...nodes, newAvatarNode]);
        setEdges((eds) => [
            ...eds,
            {
                id: `<<react-flow-${nanoid(10)}>>`,
                source: parentId,
                target: newAvatarNode.id,
                animated: true,
                style: { strokeWidth: 3 } // Increased line width
            }
        ]);

    }, [nodes, setNodes, setEdges, editable, allowToAddNewDialog, allowToUpdateDialog]);

    // Delete node functionality
    const onDeleteNode = useCallback((nodeId: string) => {
        // Remove the node
        setNodes((nds) => nds.filter(node => node.id !== nodeId));

        // Remove any connected edges
        setEdges((eds) => eds.filter(edge =>
            edge.source !== nodeId && edge.target !== nodeId
        ));
    }, [setNodes, setEdges]);

    // Add edit node functionality with advanced properties
    const onEditNode = useCallback((nodeId: string, updatedData: DialogEditPayload) => {
        if (updatedData.simulation_chat_id != undefined && updatedData.simulation_chat_id != null) {
            updateChat.mutate({
                chatData: {
                    'outcome_state': updatedData.outcome_state,
                    'chat': {
                        'dialog': updatedData.dialog,
                        'intent': updatedData.intent,
                        'topic': updatedData.topic
                    }
                },
                simulationChatID: updatedData.simulation_chat_id ? updatedData.simulation_chat_id : ''
            });
        }
        setNodes(nodes => nodes.map(node => {
            if (node.id === nodeId) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        dialog: updatedData.dialog,
                        intent: updatedData.intent,
                        topic: updatedData.topic,
                        outcome_state: updatedData.outcome_state
                    }
                };
            }
            return node;
        }));
    }, [setNodes, updateChat]);

    // Add callback functions to each node's data is it's editable
    const nodesWithCallbacks = editable ?
        nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                onAddNode,
                onDeleteNode,
                onEditNode,
            }
        })) : nodes;

    // Define node types
    const nodeTypes = {
        dialogNode: DialogNodeView,
    };

    const nodeColor = (node: DialogFlowNode) => {
        // Return different colors based on node type
        if (node.data.label === 'Human') {
            return '#fe2f2cbb'; // Red color for Human nodes
        } else {
            return '#345cfcbb'; // Blue color for Avatar nodes
        }
    };

    return (
        <div className={`w-full h-full ${bgStyleClass}`} ref={flowRef}>
            <ReactFlow
                nodes={nodesWithCallbacks}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.03}
                maxZoom={3}
            >
                <Controls />
                {editable && <MiniMap nodeColor={nodeColor} />}
                <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </div>
    );
}