import { SimulationBasicInfoForm } from "@/types/simulations";
import { CollapsibleText } from "@/components/text/CollapsibleText";
import SimulationTree from "../reactflow/SimulationTree";
import { DialogFlowEdge, DialogFlowNode } from "@/components/reactflow/utils";

export default function ScenarioFormFinalView({ simulation, dialogFlowNodes, dialogFlowEdges }: {
    simulation: SimulationBasicInfoForm,
    dialogFlowNodes: DialogFlowNode[];
    dialogFlowEdges: DialogFlowEdge[];
}) {
    return (<>
        <div className="w-full h-full flex gap-3 relative p-5">
            <div className="flex flex-col gap-3">
                <div className="w-sm min:h-48 overflow-auto h-2-scrollbar bg-gray-100 rounded-md p-2">
                    <div className="w-full border-b-2 text-xl">
                        Secnario Information
                    </div>
                    <div className="w-full h-auto flex flex-col gap-2 *:w-full *:h-auto *:grid *:grid-cols-3">
                        <div>
                            <div className="">Name:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation.scenario_name} maxTextLength={200}/>
                            </div>
                        </div>
                        <div>
                            <div className="">Overview:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation.scenario_overview} maxTextLength={200}/>
                            </div>
                        </div>

                        <div>
                            <div className="">Description:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation.scenario_description} maxTextLength={200}/>
                            </div>
                        </div>
                        <div>
                            <div className="">Related Details:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation.scenario_related_details} maxTextLength={200}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-sm min-h-48 overflow-auto h-2-scrollbar bg-gray-100 rounded-md p-2">
                    <div className="w-full border-b-2 text-xl">
                        Simulation Information
                    </div>
                    <div className="w-full h-auto flex flex-col gap-2 *:w-full *:h-auto *:grid *:grid-cols-3">
                        <div>
                            <div className="">Title:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation.simulation_title} maxTextLength={200}/>
                            </div>
                        </div>
                        <div>
                            <div className="">Description:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation.simulation_description} maxTextLength={200}/>
                            </div>
                        </div>
                        <div>
                            <div className="">Objectives:</div>
                            <div className="col-span-2">
                                <ul className="list-disc pl-4">
                                    {simulation.simulation_objectives.map((objective, index) => (
                                        <li key={index} className="">
                                            {objective}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-sm min-h-48 overflow-auto h-2-scrollbar bg-gray-100 rounded-md p-2">
                    <div className="w-full border-b-2 text-xl">
                        Program Information
                    </div>
                    <div className="w-full h-auto flex flex-col gap-2 *:w-full *:h-auto *:grid *:grid-cols-3">
                        <div>
                            <div className="">Program Affiliation:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation?.program_affiliation_details?.program_name} maxTextLength={200}/>
                            </div>
                        </div>
                        <div>
                            <div className="">Avatar Designation:</div>
                            <div className="col-span-2">
                                <CollapsibleText text={simulation.avatar_designation} maxTextLength={200}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 h-auto border">
                <SimulationTree initialNodes={dialogFlowNodes} initialEdges={dialogFlowEdges} />
            </div>
        </div>
    </>)
}