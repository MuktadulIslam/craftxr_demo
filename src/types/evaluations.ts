// Metric item interface for reusability
export type Status = "green" | "yellow" | "red" | "gray"; 

export interface MetricItem {
    name: string;
    value: number;
    range: string;
    unit: string;
    status: Status;
    description: string;
    verdict: string;
}

export interface DialogScore {
    dialog_sequence: number;
    dialog_score: number;
    dialog: string;
    status: Status;
    emotional_intelligence: {
        active_listening: {
            score: number;
            description: string;
        };
    };
}

interface Metrics {
    voice_quality: {
        name: string;
        tone_of_voice: MetricItem;
        speaking_volume: MetricItem;
    };
    speaking_pace: {
        name: string;
        speech_tempo: MetricItem;
        speaking_speed: MetricItem;
    };
    expression_engagement: {
        name: string;
        tone_variety: MetricItem;
        speech_variation: MetricItem;
    };
    rythm_flow: {
        name: string;
        breaks_in_speech: MetricItem;
        pause_length: MetricItem;
    };
}

interface Evaluation {
    performance_summary: string;
    total_dialog_count: number;
    per_dialog_score: DialogScore[];
    total_dialog_score: number;
    overall_verdict: string;
}


export interface GetEvaluationResponse {
    session_id: string,
    simulation_title: string,
    scenario_name: string,
    session_time: string,
    session_summary: {
        conversation_summary: string,
        metrics: Metrics,
        evaluation: Evaluation,
        show_evaluation: boolean
    }
}

export interface EvaluationsTableData{
    session_id: string;
    simulation_title: string;
    scenario_name: string;
    session_time: string;
}

export type GetEvaluationsResponse = {
    total_count: number
    count: number,
    next: string | null,
    previous: string | null,
    results: EvaluationsTableData[]
};