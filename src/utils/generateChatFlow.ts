import { DialogFlowEdge, DialogFlowNode } from "@/components/reactflow/types";
import { RawScenarioChat } from "@/types/simulationChat";

export function convertFlowToChat(
    nodes: DialogFlowNode[],
    edges: DialogFlowEdge[]
): RawScenarioChat {
    const nodeMap = new Map<string, DialogFlowNode>();
    const childrenMap = new Map<string, string[]>();

    // Step 1: Map node IDs
    nodes.forEach(node => {
        nodeMap.set(node.id, node);
    });

    // Step 2: Map edges (parent -> [child])
    edges.forEach(edge => {
        const source = edge.source;
        const target = edge.target;

        if (!childrenMap.has(source)) {
            childrenMap.set(source, []);
        }
        childrenMap.get(source)!.push(target);
    });

    // Step 3: Find the root (first node)
    const rootNode = nodes.find(n => n.data.isFirstNode);
    if (!rootNode) throw new Error('Root node not found.');

    // Step 4: Recursively build RawChat tree
    const buildChatTree = (nodeId: string, level: number): RawScenarioChat => {
        const node = nodeMap.get(nodeId)!;
        const subchatIds = childrenMap.get(nodeId) || [];

        return {
            chat: {
                dialog: node.data.dialog,
                intent: node.data.intent,
                topic: node.data.topic,
            },
            // Convert 'L0' → 0, 'L1' → 1, etc.
            chat_level: level,
            speaker: node.data.speaker,
            outcome_state: node.data.outcome_state,
            subchat: subchatIds.map(childId => buildChatTree(childId, level + 1)),
        };
    };

    return buildChatTree(rootNode.id, 0);
}
