"use client"
import ScenarioFormFinalView from '@/components/scenario_form/ScenarioFormFinalView';
import ScenarioInfoForm from '@/components/scenario_form/ScenarioInfoForm';
import { SimulationBasicInfoForm } from '@/types/simulations';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useContext } from 'react';
import { DialogFlowNode, DialogFlowEdge } from '@/components/reactflow/utils'
import ScenarioLayoutForm from '@/components/scenario_form/ScenarioLayoutForm';
import { convertFlowToChat } from '@/utils/generateChatFlow'
import { useCreateSimulation } from '@/lib/hooks/simulationHook';
import SimulationsUserManualTips from '@/components/simulations/SimulationsUserManualTips';
import { newSimulationStorage } from '@/utils/storage_name';
import { deleteNewSimulationStoredData, LocalStorageContext } from '@/lib/redux/LocalStorageContext';
import { config as appConfig } from '@/config';
import LocalStorageSave from '@/components/loading/LocalStorageSave';
import SimulationTree from '@/components/reactflow/SimulationTree';
import { useAppSelector } from '@/lib/redux/store';
import Room3DCanvas from '@/components/objects_layout/canvas/Room3DCanvas';

const StepsButton = ({ setCurrentPage, currentPage, pageIndex }: {
    setCurrentPage: (pageIndex: number) => void,
    currentPage: number,
    pageIndex: number
}) => {
    return (<button
        onClick={() => setCurrentPage(pageIndex)}
        className={`z-10 h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium 
            ${currentPage >= pageIndex ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-2 border-blue-600'}`}
    >{pageIndex + 1}</button>)
}

const getSimulationBasicInitialValues = (readFromLocalStorage: (key: string) => string | null): SimulationBasicInfoForm => {
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

const initialNodesTemplate: DialogFlowNode[] = [
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

export default function SimulationScenarioForm() {
    const { isLocalStorageRemoved } = useAppSelector(state => state.localStorageState);

    const [currentPage, setCurrentPage] = useState(0);
    const [updatedNodes, setUpdatedNodes] = useState<DialogFlowNode[]>(initialNodesTemplate);
    const [updatedEdges, setUpdatedEdges] = useState<DialogFlowEdge[]>([]);

    const [initialNodes, setInitialNodes] = useState<DialogFlowNode[]>(initialNodesTemplate);
    const [initialEdges, setInitialEdges] = useState<DialogFlowEdge[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogErrors, setDialogErrors] = useState<string[]>([]);
    const [tipsOpen, setTipsOpen] = useState(true);
    const createSimulation = useCreateSimulation();
    const router = useRouter();
    const { readFromLocalStorage, saveToLocalStorageAsync } = useContext(LocalStorageContext);
    const [dataLoading, setDataLoading] = useState<boolean>(true);
    const {
        register,
        formState: { errors },
        setValue,
        watch,
        trigger,
        reset
    } = useForm<SimulationBasicInfoForm>({
        defaultValues: {
            program_affiliation: '',
            scenario_name: '',
            scenario_overview: '',
            scenario_description: '',
            scenario_related_details: '',
            simulation_title: '',
            simulation_description: '',
            simulation_objectives: [],
            avatar_designation: '',
            show_evaluation_panel: false, // Add default value for new field
        },
        mode: 'onChange'
    });


    useEffect(() => {
        try {
            reset(getSimulationBasicInitialValues(readFromLocalStorage));
            const oldNodes = readFromLocalStorage(newSimulationStorage.chat_dialog_nodes);
            const oldEdges = readFromLocalStorage(newSimulationStorage.chat_dialog_edges);

            if (oldNodes != null) {
                setUpdatedNodes(JSON.parse(oldNodes))
                setInitialNodes(JSON.parse(oldNodes))
            }
            else {
                setUpdatedNodes(initialNodesTemplate)
                setInitialNodes(initialNodesTemplate)
            }
            if (oldEdges != null) {
                setUpdatedEdges(JSON.parse(oldEdges))
                setInitialEdges(JSON.parse(oldEdges))
            }
            else {
                setUpdatedEdges([])
                setInitialEdges([])
            }
            setDataLoading(false)
            setCurrentPage(0);

        } catch (error) {
            console.error('Error loading autosaved data:', error);
        }
    }, [isLocalStorageRemoved, readFromLocalStorage, reset]);

    // Re-read from localStorage when the removal flag changes in Redux
    useEffect(() => {
        if (isLocalStorageRemoved) {
            reset(getSimulationBasicInitialValues(readFromLocalStorage));
        }
    }, [isLocalStorageRemoved, readFromLocalStorage, reset]);

    // Register simulation_objectives with validation
    useEffect(() => {
        register("simulation_objectives", {
            required: "At least one simulation objective is required",
            validate: (value) => (value && value.length > 0) || "At least one simulation objective is required"
        });
    }, [register]);


    useEffect(() => {
        if (!dataLoading) {
            const setTimeId = setTimeout(() => {
                saveToLocalStorageAsync(newSimulationStorage.chat_dialog_nodes, JSON.stringify(updatedNodes))
            }, appConfig.localStorageSavingDuration)
            return () => { clearTimeout(setTimeId) }
        }
    }, [updatedNodes, dataLoading, saveToLocalStorageAsync]);

    useEffect(() => {
        if (!dataLoading) {
            const setTimeId = setTimeout(() => {
                saveToLocalStorageAsync(newSimulationStorage.chat_dialog_edges, JSON.stringify(updatedEdges))
            }, appConfig.localStorageSavingDuration)
            return () => { clearTimeout(setTimeId) }
        }
    }, [updatedEdges, dataLoading, saveToLocalStorageAsync]);



    // Function to validate the current page
    const validateCurrentPage = async () => {
        let fieldsToValidate: string[] = [];

        // Define which fields to validate based on the current page
        if (currentPage === 0) {
            // This will automatically include all fields without having to list them manually
            // fieldsToValidate = Object.keys(watch()) as (keyof SimulationBasicInfoForm)[];
            fieldsToValidate = [
                'program_affiliation',
                'scenario_name',
                'scenario_overview',
                'scenario_description',
                'scenario_related_details',
                'simulation_title',
                'simulation_description',
                'simulation_objectives',
                'avatar_designation'
            ];
        }

        // Trigger validation for the specified fields
        const result = await trigger(fieldsToValidate as (keyof SimulationBasicInfoForm)[]);

        // For page 1 (chat form), check if all dialog nodes have content
        if (currentPage === 1) {
            const emptyDialogNodes = validateDialogNodes();

            if (emptyDialogNodes.length > 0) {
                setDialogErrors(emptyDialogNodes);
                setTimeout(() => {
                    setDialogErrors([]);
                }, 5000)
                return false;
            }
        }

        // If validation fails, collect error messages
        if (!result) {
            return false;
        }

        return true;
    };

    const validateDialogNodes = (): string[] => {
        const errors: string[] = [];

        if (updatedNodes.length === 0) {
            return [];
        }

        let numberOfHumanNode = 0, numberOfAvatarNode = 0;

        // Check each node for empty dialog
        updatedNodes.forEach((node) => {
            if (node.data.dialog.trim() === '') {
                if (node.data.speaker === 'A') numberOfAvatarNode++;
                else numberOfHumanNode++;
            }
        });

        // Check for orphaned nodes (not a target in any edge)
        const targetNodeIds = updatedEdges.map(edge => edge.target);
        const orphanedNodes = updatedNodes.filter(node =>
            !node.data.isFirstNode && !targetNodeIds.includes(node.id)
        );

        if (orphanedNodes.length > 0) {
            errors.push(`${orphanedNodes.length} node(s) are disconnected from the conversation flow`);
        }

        // Check if each human node has exactly one avatar node connected to it
        const humanNodes = updatedNodes.filter(node => node.data.speaker === 'V');
        humanNodes.forEach(humanNode => {
            // Find edges where this human node is the source
            const outgoingEdges = updatedEdges.filter(edge => edge.source === humanNode.id);

            // Count avatar nodes connected to this human node
            let avatarResponseCount = 0;
            outgoingEdges.forEach(edge => {
                const targetNode = updatedNodes.find(node => node.id === edge.target);
                if (targetNode && targetNode.data.speaker === 'A') {
                    avatarResponseCount++;
                }
            });

            // Check if there's exactly one avatar response
            if (avatarResponseCount === 0) {
                errors.push(`Human node "${humanNode.data.dialog.substring(0, 20)}..." has no avatar response`);
            } else if (avatarResponseCount > 1) {
                errors.push(`Human node "${humanNode.data.dialog.substring(0, 20)}..." has ${avatarResponseCount} avatar responses, but should have exactly one`);
            }
        });

        if (numberOfAvatarNode > 0) errors.push(`${numberOfAvatarNode > 1 ? 'Some' : ''} Avatar node ${numberOfAvatarNode > 1 ? 'have' : 'has an'} empty dialog field`);
        if (numberOfHumanNode > 0) errors.push(`${numberOfHumanNode > 1 ? 'Some' : ''} Human node ${numberOfHumanNode > 1 ? 'have' : 'has an'} empty dialog field`);

        return errors;
    };

    // Clear dialog errors when nodes are updated
    useEffect(() => {
        setDialogErrors([]);
    }, [updatedNodes]);

    const handleNextByProgressIndicator = async (newPageNo: number) => {
        // Don't allow skipping ahead if current page isn't valid
        if (newPageNo > currentPage) {
            // Validate all pages up to the requested page
            for (let i = currentPage; i < newPageNo; i++) {
                setCurrentPage(i);
                const isValid = await validateCurrentPage();
                if (!isValid) {
                    return;
                }
            }
        }

        setCurrentPage(newPageNo);
    };

    const handleNext = async () => {
        // Validate the current page before proceeding
        const isValid = await validateCurrentPage();

        if (isValid) {
            setCurrentPage(prev => prev + 1);
        }
        // Don't show an alert - the error will be shown in the UI
    };

    const handlePrevious = () => {
        setCurrentPage(prev => prev - 1);
    };

    const handleFormSubmit = async () => {
        try {
            setIsSubmitting(true);
            // Get form values and exclude program_affiliation_details
            const { program_affiliation_details, ...dataToSubmit } = watch();
            void program_affiliation_details; // Explicitly mark as unused

            const result = await createSimulation.mutateAsync({
                ...dataToSubmit,
                chats: convertFlowToChat(updatedNodes, updatedEdges)
            });

            if (result) {
                alert('Simulation created successfully!');
                deleteNewSimulationStoredData();
                router.push(`/simulations/maxview/${result.simulation_id}`);
            }
        } catch (error) {
            alert(`Error creating simulation: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-container h-full flex flex-col bg-white mx-auto text-black">
            <div className="h-12 w-full px-5 flex items-center justify-between border-b-2">
                <h1 className="text-3xl font-semibold">Create Simulation Scenario</h1>
                <LocalStorageSave />
            </div>

            {/* Progress indicator */}
            <div className="w-full h-16 flex justify-center items-center">
                <div className="relative h-2 w-md bg-gray-200 flex justify-between items-center">
                    {/* Progress bar that fills based on current page */}
                    <div
                        className="absolute h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${(currentPage / 3) * 100}%` }}
                    ></div>

                    {Array(4).fill(null).map((_, index: number) => (
                        <StepsButton setCurrentPage={handleNextByProgressIndicator} currentPage={currentPage} pageIndex={index} key={index} />
                    ))}
                </div>
            </div>

            {/* User Manual Tips with toggle button */}
            <SimulationsUserManualTips currentPage={currentPage} isOpen={tipsOpen} setIsOpen={setTipsOpen} />

            {/* Dialog Errors Alert - Only show when trying to navigate from page 1 to 2 */}
            {dialogErrors.length > 0 && currentPage === 1 && (
                <div className="w-full px-5 py-2">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Please fix the following issues:</strong>
                        <ul className="mt-2 list-disc pl-5">
                            {dialogErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Page content container */}
            <div className="w-full grow overflow-hidden">
                {/* Page content slides */}
                <div className="w-full h-full flex" style={{ transform: `translateX(-${currentPage * 100}%)`, transition: 'transform 0.3s ease' }}>
                    <div className='w-full shrink-0 h-auto'>
                        <ScenarioInfoForm
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            watch={watch}
                        />
                    </div>
                    <div className='w-full shrink-0 h-full'>
                        <SimulationTree
                            initialEdges={initialEdges}
                            initialNodes={initialNodes}
                            editable={true}
                            setUpdatedNodes={setUpdatedNodes}
                            setUpdatedEdges={setUpdatedEdges}
                            bgStyleClass={'bg-gray-200 text-black'}
                        />
                    </div>
                    <div className='w-full shrink-0 h-full'>
                        <Room3DCanvas />
                        {/* <ScenarioLayoutForm /> */}
                    </div>
                    <div className='w-full shrink-0 h-auto'>
                        <ScenarioFormFinalView simulation={{ ...watch() }} dialogFlowNodes={updatedNodes} dialogFlowEdges={updatedEdges} />
                    </div>
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="w-full h-16 flex justify-between px-5 py-2">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 0}
                    className="w-32 h-full p-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                >
                    Previous
                </button>

                {currentPage >= 3 ? (
                    <button
                        onClick={handleFormSubmit}
                        disabled={isSubmitting}
                        className="w-32 h-full p-2 bg-green-600 text-white rounded disabled:bg-green-500 flex items-center justify-center"
                    >
                        {isSubmitting ? 'Loading...' : 'Submit'}
                    </button>
                ) : (
                    <button onClick={handleNext} className="w-32 h-full p-2 bg-blue-600 text-white rounded">
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}