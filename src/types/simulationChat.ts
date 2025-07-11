export type SimulationOutcomeState = 'T' | 'P' | 'N' | 'G' | 'R' | null | undefined;
export type Speaker = 'A' | 'V'
export type ChatLevel = `L${number}`

export interface SimulationChatType {
    simulation_chat_id: string | undefined,
    chat: {
        dialog: string,
        intent: string,
        topic: string
    },
    chat_level: ChatLevel,
    speaker: Speaker,
    outcome_state: SimulationOutcomeState,
    subchat: SimulationChatType[]
}

export type SimulationChatTreeType = SimulationChatType[];


export interface ScenarioChatUpdateFormData {
    outcome_state: SimulationOutcomeState,
    chat: {
        dialog: string,
        intent: string,
        topic: string,
    }
}


export interface RawScenarioChat {
    chat: {
        dialog: string;
        intent: string;
        topic: string;
    };
    chat_level: number;
    speaker: Speaker;
    outcome_state: SimulationOutcomeState;
    subchat: RawScenarioChat[];
}