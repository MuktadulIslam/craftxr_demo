"use client"
import { Simulation } from "@/types/simulations";
import { CollapsibleText } from "@/components/text/CollapsibleText";
import Link from "next/link";
import ViewSimulation from "./ViewSimulation";
import { useEffect, useState } from "react";
import { useGetSimulation } from "@/lib/hooks/simulationHook";

export default function SimulationPopupView({ simulationID }: { simulationID: string | undefined }) {
    const [simulation, setSimulation] = useState<Simulation>();
    const { data: simulationData, isLoading: simulationDataLoading } = useGetSimulation(simulationID ? simulationID : '');

    useEffect(() => {
        if (simulationData) {
            setSimulation(simulationData)
        }
    }, [simulationData]);

    return (
        <>
            <div className="w-lg 2xl:w-xl h-[650px] flex gap-3 relative">
                <div className="h-full w-sm flex flex-col gap-3 overflow-x-hidden overflow-y-auto">
                    {simulationDataLoading ?
                        <div className="w-full h-full flex justify-center  items-center text-white">
                            <p>Loading...</p>
                        </div> :
                        <>
                            <div className="w-full h-2-scrollbar bg-gray-100 dark:bg-gray-500 rounded-md p-2">
                                <div className="w-full border-b-2 border-black text-xl">
                                    Simulation Description
                                </div>
                                <div className="w-full h-auto">
                                    <CollapsibleText text={simulation?.simulation_description} maxTextLength={400} />
                                </div>
                            </div>

                            <div className="w-full h-2-scrollbar bg-gray-100 dark:bg-gray-500 rounded-md p-2">
                                <div className="w-full border-b-2 border-black text-xl">
                                    Simulation Objectives
                                </div>
                                <div className="w-full h-auto">
                                    <ul className="space-y-2 list-disc list-inside pl-4">
                                        {simulation?.simulation_objectives.map((objective, index) => (
                                            <li key={index} className="text-base leading-relaxed">
                                                {objective}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="w-full h-2-scrollbar bg-gray-100 dark:bg-gray-500 rounded-md p-2">
                                <div className="w-full border-b-2 border-black text-xl">
                                    Scenario Overview
                                </div>
                                <div className="w-full h-auto">
                                    <CollapsibleText text={simulation?.scenario.scenario_overview} maxTextLength={400} />
                                </div>
                            </div>


                            <div className="w-auto h-auto absolute bottom-1 right-1 z-50 flex justify-between gap-1">
                                <Link
                                    href={`/simulations/maxview/${simulation?.simulation_id}`}
                                    className={`px-4 py-1 rounded-lg  bg-blue-600 text-white text-sm flex justify-center items-center font-semibold`}>
                                    ViewMax
                                </Link>
                                {simulation?.is_simulation_editable ?
                                    <Link
                                        href={`/simulations/edit/${simulation?.simulation_id}`}
                                        className={`px-4 py-1 rounded-lg  bg-amber-300 text-black text-sm flex justify-center items-center font-semibold`}>
                                        Edit
                                    </Link> : <></>
                                }
                            </div>
                        </>
                    }
                </div>
                <div className="flex-1 h-full">
                    <ViewSimulation simulationID={simulationID ? simulationID : ''} />
                </div>
            </div>
        </>
    );
}