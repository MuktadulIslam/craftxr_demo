"use client"
import { useParams } from 'next/navigation';
import { useState } from "react"
import ViewSimulation from '@/components/simulations/ViewSimulation';
import { BsBoxArrowLeft, BsBoxArrowRight } from "react-icons/bs";
import SimulationSideBar from '@/components/simulations/SimulationSideBar';

export default function Page() {
    const params = useParams();
    const simulationID = params.simulation_id as string;

    // Use state to track sidebar visibility
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)

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
            <div className={`z-50 w-[500px] h-full flex flex-col absolute top-0 left-0 bg-blue-200 transition-transform duration-300 ${isSidebarVisible ? '' : '-translate-x-full'}`}>
                <div className="h-12 w-full flex items-center pl-3 text-2xl font-bold">
                    Simulation Details
                </div>
                <button onClick={toggleSidebar}
                    className={`w-[40px] aspect-square absolute transition-all duration-300 flex items-center justify-center ${isSidebarVisible ? '-right-[40px]' : '-right-[40px]'}`}
                >
                    {isSidebarVisible ? <BsBoxArrowLeft style={iconStyle} /> : <BsBoxArrowRight style={iconStyle} />}
                </button>

                <SimulationSideBar simulationID={simulationID} />
            </div>

            {/* For Simulation View & Update */}
            <div className="w-full h-full bg-gray-500">
                <ViewSimulation simulationID={simulationID} />
            </div>
        </div>
    )
}
