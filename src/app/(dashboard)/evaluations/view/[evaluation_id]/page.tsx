"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react"
import { GetEvaluationResponse, MetricItem } from '@/types/evaluations';
import { useGetEvaluation } from '@/lib/hooks/evaluationHook';
import CircularProgress from '@/components/evaluations/CircularProgress';
import DialogScoreFlowDiagram from '@/components/evaluations/DialogScoreFlowDiagram';

const getStandardTimeFormat = (timeString: string | undefined) => {
    if (timeString) {
        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            // timeZoneName: 'short'
        });
        return formatter.format(new Date(timeString));
    }
    else return '';
}


const MetricGauge: React.FC<MetricItem> = ({ value, range, unit, status, verdict, name }) => {
    // Determine color based on status
    const statusColors: Record<string, string> = {
        green: "border-green-500",
        yellow: "border-yellow-500",
        red: "border-red-500",
        gray: 'border-gray-300',
        default: 'border-gray-600'
    };

    const borderColor = statusColors[status] || statusColors.default;

    return (
        <div className="flex flex-col items-center">
            <p className="text-sm font-medium mb-1">{name}</p>
            <div className={`relative w-28 aspect-square rounded-full border-6 ${borderColor} flex items-center justify-center mb-1`}>
                <div className="text-sm font-bold">
                    {typeof value === 'number' ? (value % 1 === 0 ? value : value.toFixed(1)) : value}
                    <span className="text-xs">{unit}</span>
                </div>
            </div>
            <p className="text-xs font-medium text-center">{verdict}</p>
            <p className="text-xs font-semibold text-center">{`Ideal: ${range}`}</p>
        </div>
    );
};

interface MetricCategoryProps {
    title: string;
    metrics: MetricItem[];
}

const MetricCategory: React.FC<MetricCategoryProps> = ({ title, metrics }: {
    title: string,
    metrics: MetricItem[]
}) => {

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3">{title}</h3>
            <div className="grid grid-cols-2 gap-4">
                {metrics.map((metric, index) => (
                    metric.name && metric.value !== undefined && (
                        <MetricGauge
                            key={index}
                            name={metric.name}
                            value={metric.value}
                            range={metric.range}
                            unit={metric.unit}
                            status={metric.status}
                            description={metric.description}
                            verdict={metric.verdict}
                        />
                    )
                ))}
            </div>
        </div>
    );
};

export default function ViewEvalutions() {
    const params = useParams();
    const evaluationID = params.evaluation_id as string;

    const [evaluation, setEvaluation] = useState<GetEvaluationResponse>();
    const { data: evaluationData, isLoading: evaluationDataLoading } = useGetEvaluation(evaluationID);

    useEffect(() => {
        if (evaluationData) {
            setEvaluation(evaluationData);
        }
    }, [evaluationData]);

    if (evaluationDataLoading) {
        return (<div className="w-full h-full flex justify-center items-center text-2xl font-semibold">
            Evalution data is loading...
        </div>)
    }

    return (<>
        <div className="w-full max-w-container h-full bg-white mx-auto text-black">
            <div className="w-full h-16 flex justify-start items-center px-5 text-3xl border-b-4 border-gray-900">
                <h1>Simulation Conversation Summary</h1>
            </div>
            {evaluation && <>
                {/* Basic Information */}
                <div className="w-full h-auto flex flex-col gap-4 p-4 *:w-full *:h-auto">
                    <div className="flex gap-5 *:rounded-lg *:bg-gray-100 *:shadow-md *:p-4">
                        <div className="flex-1 h-auto">
                            <h3 className='text-xl'>Simulation Title</h3>
                            <p>{evaluation?.simulation_title}</p>
                        </div>
                        <div className="flex-1 h-auto">
                            <h3 className='text-xl'>Scenario Name</h3>
                            <p>{evaluation?.scenario_name}</p>
                        </div>
                        <div className="w-80 h-auto">
                            <h3 className='text-xl'>Session Time</h3>
                            <p>{getStandardTimeFormat(evaluation?.session_time)}</p>
                        </div>
                    </div>
                    <div className="rounded-lg bg-gray-100 shadow-md p-4">
                        <h3 className='text-xl'>Conversation Summary</h3>
                        <p>{evaluation?.session_summary.conversation_summary}</p>
                    </div>
                </div>

                {/* Speech Performance Metrics Dashboard */}
                <div className="p-5">
                    <h2 className="text-2xl font-bold mb-4">Speech Performance Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MetricCategory
                            title={evaluation?.session_summary.metrics.voice_quality.name}
                            metrics={[
                                evaluation?.session_summary.metrics.voice_quality.tone_of_voice,
                                evaluation?.session_summary.metrics.voice_quality.speaking_volume
                            ]}
                        />

                        <MetricCategory
                            title={evaluation?.session_summary.metrics.speaking_pace.name}
                            metrics={[
                                evaluation?.session_summary.metrics.speaking_pace.speech_tempo,
                                evaluation?.session_summary.metrics.speaking_pace.speaking_speed
                            ]}
                        />

                        <MetricCategory
                            title={evaluation?.session_summary.metrics.expression_engagement.name}
                            metrics={[
                                evaluation?.session_summary.metrics.expression_engagement.tone_variety,
                                evaluation?.session_summary.metrics.expression_engagement.speech_variation
                            ]}
                        />

                        <MetricCategory
                            title={evaluation?.session_summary.metrics.rythm_flow.name}
                            metrics={[
                                evaluation?.session_summary.metrics.rythm_flow.breaks_in_speech,
                                evaluation?.session_summary.metrics.rythm_flow.pause_length
                            ]}
                        />
                    </div>
                </div>

                {/* Performance Summary */}
                <div className="p-5 mt-5">
                    <h2 className="text-2xl font-bold mb-4">Dialog Performance Evaluation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 *:bg-gray-100 *:p-4 *:rounded-lg *;shadow-md">
                        <div className='w-full h-auto'>
                            <h3 className="text-xl">Performance Summary</h3>
                            <p className="text-gray-700">{evaluation?.session_summary.evaluation.performance_summary}</p>
                        </div>
                        <div className="w-full h-auto flex">
                            <h3 className="text-xl">Total Score</h3>
                            <div className='flex-1 h-auto flex flex-col justify-center  items-center gap-2'>
                                <CircularProgress
                                    currentValue={evaluation?.session_summary.evaluation.total_dialog_score ?? 0}
                                    maxValue={5}
                                    size={170}
                                    strokeWidth={20}
                                    textClassName='font-semibold text-2xl text-black'
                                />
                                <div className="mt-2 flex items-center">
                                    <span className="text-base font-semibold mr-3">Overall Verdict:</span>
                                    <span className={`px-5 py-0.5 rounded-full text-sm font-semibold ${evaluation?.session_summary.evaluation.overall_verdict === 'Excellent' ? 'bg-green-100 text-green-800' :
                                        evaluation?.session_summary.evaluation.overall_verdict === 'Good' ? 'bg-blue-100 text-blue-800' :
                                            evaluation?.session_summary.evaluation.overall_verdict === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {evaluation?.session_summary.evaluation.overall_verdict}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 z-50">
                    <h2 className="text-xl font-bold">Dialog Performance Evaluation</h2>
                    <DialogScoreFlowDiagram dialogScores={evaluation?.session_summary.evaluation.per_dialog_score} />
                </div>
            </>
            }
        </div >
    </>)
}