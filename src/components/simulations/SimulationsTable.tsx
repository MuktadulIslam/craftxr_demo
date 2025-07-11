"use client"
import { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoDuplicateSharp } from "react-icons/io5";
import { useDeleteSimulation, useGetSimulations, useDuplicateSimulation } from '@/lib/hooks/simulationHook';
import { SimulationInfo, SimulationsResponse } from '@/types/simulations';
import Popup from '@/components/popup/Popup';
import SimulationPopupView from '@/components/simulations/SimulationPopupView';
import Link from 'next/link';
import { config as AppConfig } from '@/config';

const actionButtonHoverText = (text: string) => {
    return (<span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {text}
    </span>);
}

export default function SimulationScenariosTable() {
    const [isOpen, setIsOpen] = useState(false);
    const [simulation, setSimulation] = useState<SimulationInfo>();

    const [simulations, setSimulations] = useState<SimulationInfo[]>([]);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
    const [totalSimulationCount, setTotalSimulationCount] = useState<number>(0);
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);

    const { data: simulationsData, isLoading, refetch: refetchSimulations } = useGetSimulations(currentPageNumber - 1);
    const deleteSimulationMutation = useDeleteSimulation();
    const duplicateSimulationMutation = useDuplicateSimulation();

    useEffect(() => {
        if (simulationsData) {
            setSimulations(simulationsData.results || []);
            setTotalSimulationCount(simulationsData.total_count || 0);
            setHasNextPage(simulationsData.next != null);
            setHasPreviousPage(simulationsData.previous != null);
        }
    }, [simulationsData]);

    const openScenarioView = (simulation: SimulationInfo) => {
        setIsOpen(true)
        setSimulation(simulation)
    }

    const handleDeleteSimulation = (simulationId: string) => {
        if (window.confirm('Are you sure you want to delete this simulation?')) {
            deleteSimulationMutation.mutate({ 
                simulationID: simulationId, 
                pageNumber: currentPageNumber - 1 
            }, {
                onSuccess: () => {
                    // Update local state to immediately remove the deleted simulation
                    setSimulations(prevSimulations =>
                        prevSimulations.filter(sim => sim.simulation_id !== simulationId)
                    );
                }
            });
        }
    };

    const duplicateSimulation = async (simulationId: string) => {
        duplicateSimulationMutation.mutate(simulationId, {
            onSuccess: () => {
                refetchSimulations()
            }
        });
    };

    const handlePreviousePage = () => {
        if (hasPreviousPage) {
            setCurrentPageNumber(currentPageNumber - 1);
        }
    };

    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentPageNumber(currentPageNumber + 1);
        }
    };

    const handlePageClick = (pageNumber: number) => {
        setCurrentPageNumber(pageNumber);
    };

    // Calculate which page numbers to show
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const activePage = currentPageNumber;
        const totalAvailablePages = Math.ceil(totalSimulationCount / (AppConfig?.simulationOffsetLimit || 10));
        const maxPageNumbersToShow = 3;
        const startPage = Math.max(1, activePage - maxPageNumbersToShow + 1);
        const endPage = Math.min(totalAvailablePages, Math.max(activePage, maxPageNumbersToShow));

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${activePage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalAvailablePages - 1) {
            pageNumbers.push(
                <span key="ellipsis2" className="px-1 text-2xl font-bold">......</span>
            );
        }
        if (endPage < totalAvailablePages) {
            pageNumbers.push(
                <button
                    key={totalAvailablePages}
                    onClick={() => handlePageClick(totalAvailablePages)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${activePage === totalAvailablePages ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    {totalAvailablePages}
                </button>
            )
        }
        return pageNumbers;
    };

    return (
        <div className='w-full h-full relative flex flex-col'>
            <Popup
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={simulation?.simulation_title}
            >
                <SimulationPopupView simulationID={simulation?.simulation_id} />
            </Popup>

            {/* Header */}
            <div className="h-24 flex justify-between items-center p-4 border-b border-gray-300">
                <h1 className="text-3xl font-medium text-gray-800">Simulation Scenarios</h1>
                <Link href={"/simulations/create"}
                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    <FaPlus className="w-3 h-3" />
                    <span>Create</span>
                </Link>
            </div>

            {/* Scenarios Table */}
            <div className="p-4 flex-1">
                {isLoading ? (
                    <div className="text-center py-4">Loading simulations...</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-200 text-xl font-bold border-gray-300">
                                <th className="py-2 pl-2 text-left text-gray-600">Actions</th>
                                <th className="py-2 pl-2 text-left text-gray-600">Simulation Title</th>
                                <th className="py-2 pl-2 text-left text-gray-600">Scenario Name</th>
                                <th className="py-2 pr-4 text-left min-w-48 text-gray-600 w-32">Program Affiliation</th>
                                <th className="py-2 pr-4 text-right w-32 text-gray-600">VR Ready</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {simulations && simulations.length > 0 ? (
                                simulations.map((simulation) => (
                                    <tr key={simulation.simulation_id} className="hover:bg-gray-100">
                                        <td className="py-3 pl-2 pr-5 w-40">
                                            <div className="flex items-center space-x-7 font-semibold text-gray-700">
                                                <button
                                                    onClick={() => openScenarioView(simulation)}
                                                    className="hover:text-blue-700 relative group"
                                                >
                                                    <IoEye className="w-6 h-6" />
                                                    {actionButtonHoverText("View Simulation")}
                                                </button>
                                                {simulation?.is_simulation_editable && simulation?.vr_ready ?
                                                    <Link href={`/simulations/edit/${simulation.simulation_id}`}
                                                        className="text-gray-700 hover:text-blue-700 relative group">
                                                        <FaEdit className="w-5 h-5" />
                                                        {actionButtonHoverText("Edit Simulation")}
                                                    </Link> :
                                                    <div className="text-gray-400 relative group">
                                                        <FaEdit className="w-5 h-5" />
                                                        {actionButtonHoverText(!simulation?.is_simulation_editable ? "Not Editable!" : "Not Editable(VR Not Ready)!")}
                                                    </div>
                                                }
                                                <button
                                                    onClick={() => duplicateSimulation(simulation.simulation_id)}
                                                    className="hover:text-blue-700 relative group"
                                                    disabled={duplicateSimulationMutation.isPending && duplicateSimulationMutation.variables === simulation.simulation_id}
                                                >
                                                    {duplicateSimulationMutation.variables === simulation.simulation_id &&
                                                        duplicateSimulationMutation.isPending ?
                                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin"></div> :
                                                        <>
                                                            <IoDuplicateSharp className="w-5 h-5" />
                                                            {actionButtonHoverText("Duplicate Simulation")}
                                                        </>
                                                    }
                                                </button>
                                                {simulation?.is_simulation_editable && simulation?.vr_ready ?
                                                    <button
                                                        onClick={() => handleDeleteSimulation(simulation.simulation_id)}
                                                        className="hover:text-blue-700 relative group"
                                                        disabled={deleteSimulationMutation.isPending && deleteSimulationMutation.variables?.simulationID === simulation.simulation_id}
                                                    >
                                                        {deleteSimulationMutation.variables?.simulationID === simulation.simulation_id &&
                                                            deleteSimulationMutation.isPending ?
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin"></div> :
                                                            <>
                                                                <RiDeleteBin6Fill className="w-5 h-5" />
                                                                {actionButtonHoverText("Delete Simulation")}
                                                            </>
                                                        }
                                                    </button> :
                                                    <div className="text-gray-400 relative group">
                                                        <RiDeleteBin6Fill className="w-5 h-5" />
                                                        {!simulation?.is_simulation_editable ? actionButtonHoverText("Not Deletable!") : actionButtonHoverText("Not Deletable (VR Not Ready)!")}
                                                    </div>
                                                }
                                            </div>
                                        </td>
                                        <td className="py-3 pl-2">
                                            <span className="font-medium">{simulation.simulation_title}</span>
                                        </td>
                                        <td className="py-3 pr-4 text-left min-w-48 whitespace-nowrap">
                                            <span className="text-gray-600">{simulation.scenario_name}</span>
                                        </td>
                                        <td className="py-3 pr-4 text-left min-w-48 whitespace-nowrap">
                                            <span className="text-gray-600">{`${simulation.program_name} (${simulation.program_affiliation})`}</span>
                                        </td>
                                        <td className="py-3 pr-4 text-right w-32">
                                            {
                                                simulation.vr_ready ?
                                                    <span className="inline-flex items-center text-green-500 font-semibold">
                                                        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        VR Ready
                                                    </span> :
                                                    <span className="inline-flex items-center text-red-500 font-semibold">
                                                        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                                        </svg>
                                                        Not Ready
                                                    </span>
                                            }
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-500">
                                        No scenarios found. Create your first one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Page Navigation buttons */}
            <div className="w-full h-12 flex justify-between items-center bg-[#00835e] px-5">
                <button
                    onClick={handlePreviousePage}
                    disabled={!hasPreviousPage}
                    className={`w-32 py-1.5 rounded-md ${hasPreviousPage
                        ? 'bg-indigo-700 text-white hover:scale-110'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Previous
                </button>

                <div className="flex items-center space-x-2">
                    {renderPageNumbers()}
                </div>

                <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className={`w-32 py-1.5 rounded-md ${hasNextPage
                        ? 'bg-indigo-700 text-white hover:scale-110'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}