"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react"
import UpdateSimulation from '@/components/simulations/UpdateSimulation';
import { BsBoxArrowLeft, BsBoxArrowRight } from "react-icons/bs";
import ScenarioFormSideBar from '@/components/simulations/ScenarioFormSideBar';
import { DialogFlowEdge, DialogFlowNode } from '@/components/reactflow/types';

export default function Page() {
    const params = useParams();
    const simulationID = params.simulation_id as string;

    const [updatedNodes, setUpdatedNodes] = useState<DialogFlowNode[]>([])
    const [updatedEdges, setUpdatedEdges] = useState<DialogFlowEdge[]>([])

    // Use state to track sidebar visibility
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)
    useEffect(()=>{},[updatedEdges, updatedNodes])

    // Toggle function to hide or show sidebar
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible)
    }

    const iconStyle = {
        width: '50%',
        height: '50%',
        fill: 'currentColor',
        stroke: 'currentColor',
    }

    return (
        <div className="w-full h-full relative mx-auto overflow-hidden">
            {/* <button
                onClick={handelUpdate}
                className="w-32 h-10 absolute top-2 right-2 bg-blue-600 text-white rounded-sm z-50">
                Make Update
            </button> */}

            <div className={`z-50 w-[500px] h-full flex flex-col absolute top-0 left-0 bg-blue-200 transition-transform duration-300 ${isSidebarVisible ? '' : '-translate-x-full'}`}>
                <div className="h-12 w-full flex items-center pl-3 text-2xl font-bold">
                    <h1>Simulation Configuration</h1>
                </div>
                <button onClick={toggleSidebar}
                    className={`w-[40px] aspect-square absolute transition-all duration-300 flex items-center justify-center ${isSidebarVisible ? '-right-[40px]' : '-right-[40px]'}`}
                >
                    {isSidebarVisible ? <BsBoxArrowLeft style={iconStyle} /> : <BsBoxArrowRight style={iconStyle} />}
                </button>

                <ScenarioFormSideBar simulationID={simulationID} />
            </div>

            {/* For Simulation View & Update */}
            <div className="w-full h-full">
                <UpdateSimulation
                    simulationID={simulationID}
                    setUpdatedNodes={setUpdatedNodes}
                    setUpdatedEdges={setUpdatedEdges}
                />
            </div>
        </div>
    )
}
