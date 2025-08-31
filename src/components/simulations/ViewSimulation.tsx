"use client"

import SimulationTree from '@/components/reactflow/SimulationTree';
import { useGetSimulationChat } from "@/lib/hooks/simulationHook";
import { useEffect, useState } from "react";
import { getNodesAndEdges } from "@/components/reactflow/utils";
import { DialogFlowEdge, DialogFlowNode } from "@/components/reactflow/types";

export default function ViewSimulation({ simulationID }: { simulationID: string }) {
    const { data: chatData } = useGetSimulationChat(simulationID);
    const [initialNodes, setInitialNodes] = useState<DialogFlowNode[]>([]);
    const [initialEdges, setInitialEdges] = useState<DialogFlowEdge[]>([]);
    const editable = false;

    useEffect(() => {
        if (chatData) {
            const [initialNodes, initialEdges] = getNodesAndEdges(chatData[0], editable, { x: 100, y: 100 }, null)
            setInitialNodes(initialNodes)
            setInitialEdges(initialEdges)
        }
    }, [chatData, editable]);

    return (
        <>
            <div className="w-full h-full">
                {initialNodes.length > 0 ?
                    <SimulationTree initialEdges={initialEdges} initialNodes={initialNodes}/> :
                    <div className="w-full h-full bg-white flex justify-center items-center">
                        Loading...
                    </div>
                }
            </div>
        </>
    );
}