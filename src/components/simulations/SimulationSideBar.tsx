
import { useGetSimulation } from "@/lib/hooks/simulationHook";
import { Simulation } from "@/types/simulations";
import { useEffect, useState } from "react";
import { CollapsibleText } from "@/components/text/CollapsibleText";

export default function SimulationSideBar({ simulationID }: { simulationID: string }) {
    const [simulation, setSimulation] = useState<Simulation>();
    const { data: simulationData, isLoading: simulationDataLoading } = useGetSimulation(simulationID);
    useEffect(() => {
        if (simulationData) {
            setSimulation(simulationData);
        }
    }, [simulationData]);

    return (<>
        {simulationDataLoading ?
            <div className="w-full h-full flex justify-center items-center text-center text-gray-500">
                Loading...
            </div> :

            <div className="w-full flex-1 overflow-auto flex flex-col gap-3 p-2 text-sm">
                <div className="w-full h-2-scrollbar bg-gray-100 dark:bg-gray-300 rounded-md p-2">
                    <div className="w-full border-b-2 text-lg">
                        Simulation Information
                    </div>
                    <div className="w-full h-auto flex flex-col gap-2 *:w-full *:h-auto *:grid *:grid-cols-3">
                        <div>
                            <div className="">Title:</div>
                            <div className="col-span-2">
                                {simulation?.simulation_title}
                            </div>
                        </div>
                        <div>
                            <div className="">Description:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation?.simulation_description} maxTextLength={300} />
                            </div>
                        </div>
                        <div>
                            <div className="">Objectives:</div>
                            <div className="col-span-2">
                                <ul className="space-y-2 list-disc pl-4">
                                    {simulation?.simulation_objectives.map((objective, index) => (
                                        <li key={index} className="">
                                            {objective}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-2-scrollbar bg-gray-100 dark:bg-gray-300 rounded-md p-2">
                    <div className="w-full border-b-2 text-lg">
                        Secnario Information
                    </div>
                    <div className="w-full h-auto flex flex-col gap-2 *:w-full *:h-auto *:grid *:grid-cols-3">
                        <div>
                            <div className="">Name:</div>
                            <div className="col-span-2">
                                {simulation?.scenario.scenario_name}
                            </div>
                        </div>
                        <div>
                            <div className="">Description:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation?.scenario.scenario_description} maxTextLength={250} />
                            </div>
                        </div>
                        <div>
                            <div className="">Additional Details:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation?.scenario.scenario_details} maxTextLength={250} />
                            </div>
                        </div>
                        <div>
                            <div className="">Overview:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation?.scenario.scenario_overview} maxTextLength={250} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-2-scrollbar bg-gray-100 dark:bg-gray-300 rounded-md p-2">
                    <div className="w-full border-b-2 text-lg">
                        Scene Information
                    </div>
                    <div className="w-full h-auto flex flex-col gap-2 *:w-full *:h-auto *:grid *:grid-cols-3">
                        <div>
                            <div className="">Description:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation?.scene.scene_description} maxTextLength={250} />
                            </div>
                        </div>
                        <div>
                            <div className="">Location:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation?.scene.scene_location} maxTextLength={250} />
                            </div>
                        </div>
                        <div>
                            <div className="">Ambiance:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation?.scene.scene_ambiance} maxTextLength={250} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-2-scrollbar bg-gray-100 dark:bg-gray-300 rounded-md p-2">
                    <div className="w-full border-b-2 text-lg">
                        Program Information
                    </div>
                    <div className="w-full h-auto flex flex-col gap-2 *:w-full *:h-auto *:grid *:grid-cols-3">
                        <div>
                            <div className="">Name:</div>
                            <div className="col-span-2">
                                {`${simulation?.affiliation.program_name} (${simulation?.affiliation.program_abbr})`}
                            </div>
                        </div>
                        <div>
                            <div className="">Institute:</div>
                            <div className="col-span-2">
                                {`${simulation?.affiliation.institute.institute_name} (${simulation?.affiliation.program_abbr})`}
                            </div>
                        </div>
                        <div>
                            <div className="">School:</div>
                            <div className="col-span-2">
                                {`${simulation?.affiliation.school.school_name} (${simulation?.affiliation.program_abbr})`}
                            </div>
                        </div>
                        <div>
                            <div className="">Department:</div>
                            <div className="col-span-2">
                                {simulation?.affiliation.department.department_name}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    </>)
}