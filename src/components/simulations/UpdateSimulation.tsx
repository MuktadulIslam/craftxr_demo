"use client"
import { useRouter } from 'next/navigation';
import { useGetSimulationChat } from "@/lib/hooks/simulationHook";
import { useEffect, useState } from "react"
import { getNodesAndEdges } from "@/components/reactflow/utils";
import { DialogFlowEdge, DialogFlowNode } from "@/components/reactflow/types";
import SimulationTree from '@/components/reactflow/SimulationTree';

interface UpdateSimulationProps {
    simulationID: string,
    setUpdatedNodes: (nodes: DialogFlowNode[]) => void;
    setUpdatedEdges: (edges: DialogFlowEdge[]) => void;
}

export default function UpdateSimulation({ simulationID, setUpdatedNodes, setUpdatedEdges }: UpdateSimulationProps) {
    const router = useRouter();
    const editable = true;

    const { data: chatData, isLoading: chatLoading, isError: isErrorInChatLoading } = useGetSimulationChat(simulationID);
    const [initialNodes, setInitialNodes] = useState<DialogFlowNode[]>([])
    const [initialEdges, setInitialEdges] = useState<DialogFlowEdge[]>([])

    // Handle error and redirect
    useEffect(() => {
        if (isErrorInChatLoading) {
            // Show default browser alert
            alert("Failed to load simulation data. Redirecting back.");

            // Redirect to previous page
            router.back();
        }
    }, [isErrorInChatLoading, router]);

    useEffect(() => {
        if (chatData) {
            const [initialNodes, initialEdges] = getNodesAndEdges(chatData[0], editable, { x: 100, y: 100 }, null)
            setInitialNodes(initialNodes)
            setInitialEdges(initialEdges)
            setUpdatedNodes(initialNodes)
            setUpdatedEdges(initialEdges)
        }
    }, [chatData, editable, setUpdatedEdges, setUpdatedNodes]);

    if (chatLoading) {
        return (
            <div className="w-full h-full bg-white flex justify-center items-center">
                Loading...
            </div>
        )
    }

    return (
        <div className="w-full h-full">
            <SimulationTree
                initialEdges={initialEdges}
                initialNodes={initialNodes}
                editable={editable}
                allowToAddNewDialog={false}
                allowToRemoveDialog={false}
                allowToUpdateDialog={true}
                setUpdatedNodes={setUpdatedNodes}
                setUpdatedEdges={setUpdatedEdges}
            />
        </div>
    )
}
