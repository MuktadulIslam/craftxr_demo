import { DialogFlowNode } from "@/components/reactflow/types";
import { SimulationBasicInfoForm } from "@/types/simulations";
import { newSimulationStorage } from "@/utils/storage_name";

export const initialNodesTemplate: DialogFlowNode[] = [
    {
        id: "<<chat-parent-node>>",
        type: "dialogNode",
        position: { x: 250, y: 100 },
        data: {
            label: "Avatar",
            dialog: "Hello! How can I help you today?",
            outcome_state: "P",
            intent: "greeting",
            topic: "introduction",
            speaker: "A",
            chat_level: "L1",
            isFirstNode: true,
            editable: true,
            allowToAddNewDialog: true,
            allowToRemoveDialog: true,
            allowToUpdateDialog: true
        }
    }
];

export const getSimulationBasicInitialValues = (readFromLocalStorage: (key: string) => string | null): SimulationBasicInfoForm => {
    const showEvaluationPanelValue = readFromLocalStorage(newSimulationStorage.show_evaluation_panel);
    const showEvaluationPanel = showEvaluationPanelValue === null ? false : showEvaluationPanelValue === 'true';

    return {
        program_affiliation: readFromLocalStorage(newSimulationStorage.program_affiliation) || '',
        program_affiliation_details: JSON.parse(readFromLocalStorage(newSimulationStorage.program_affiliation_details) || '{}'),
        scenario_name: readFromLocalStorage(newSimulationStorage.scenario_name) || '',
        scenario_overview: readFromLocalStorage(newSimulationStorage.scenario_overview) || '',
        scenario_description: readFromLocalStorage(newSimulationStorage.scenario_description) || '',
        scenario_related_details: readFromLocalStorage(newSimulationStorage.scenario_related_details) || '',
        simulation_title: readFromLocalStorage(newSimulationStorage.simulation_title) || '',
        simulation_description: readFromLocalStorage(newSimulationStorage.simulation_description) || '',
        simulation_objectives: JSON.parse(readFromLocalStorage(newSimulationStorage.simulation_objectives) || '[]'),
        avatar_designation: readFromLocalStorage(newSimulationStorage.avatar_designation) || '',
        show_evaluation_panel: showEvaluationPanel,
    };
};