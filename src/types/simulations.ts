import { RawScenarioChat } from "./simulationChat";

interface Institute {
    institute_name: string;
    institute_alias: string;
}

interface School {
    school_name: string;
    school_alias: string;
}

interface Department {
    department_name: string;
}

export interface Affiliation {
    affiliation_id: string;
    program_name: string;
    program_abbr: string;
    program_affiliation: string;
    institute: Institute;
    school: School;
    department: Department;
}

interface Scenario {
    scenario_name: string;
    scenario_description: string;
    scenario_details: string;
    scenario_overview: string;
}

interface Scene {
    scene_description: string;
    ambient_sounds: Record<string, object | string | number>; // This could be refined based on actual data
    scene_location: string;
    scene_ambiance: string;
}

export interface Simulation {
    simulation_id: string;
    simulation_title: string;
    simulation_description: string;
    simulation_objectives: string[];
    avatar_designation: string;
    is_simulation_editable: boolean;

    scenario: Scenario;
    scene: Scene;
    affiliation: Affiliation;
}


export interface ScenarioUpdateFormData {
    program_affiliation: string;
    scenario_name: string;
    scenario_overview: string;
    scenario_description: string;
    scenario_related_details: string;
    simulation_title: string;
    simulation_description: string;
    simulation_objectives: string[];
    avatar_designation: string;
}




export interface SimulationInfo {
    simulation_id: string;
    simulation_title: string;
    scenario_name: string;
    affiliation_id: string;
    program_affiliation: string;
    program_name: string;
    is_simulation_editable: boolean;
    vr_ready: boolean;
}

export interface SimulationsResponse {
    total_count: number,
    count: number,
    next: string | null,
    previous: string | null,
    results:SimulationInfo[]
}



export interface SimulationBasicInfoForm {
    program_affiliation: string,
    program_affiliation_details?: Affiliation,
    scenario_name: string,
    scenario_overview: string,
    scenario_description: string,
    scenario_related_details: string,
    simulation_title: string,
    simulation_description: string,
    simulation_objectives: string[],
    avatar_designation: string,
    show_evaluation_panel: boolean;
}

export interface SimulationCreateRequest extends SimulationBasicInfoForm{
    chats: RawScenarioChat
}