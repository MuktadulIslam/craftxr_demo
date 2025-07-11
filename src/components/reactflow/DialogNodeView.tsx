"use client"
import { useState } from "react";
import { InteractiveDialogNodeData } from "./utils";
import { FaPlus } from "react-icons/fa6";
import { RiPencilFill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import { Handle, Position } from "@xyflow/react";
import { SimulationOutcomeState } from "@/types/simulationChat";
import CharacterCounterFormInput from "../text/CharacterCounterFormInput";
import { useForm } from "react-hook-form";
import { inputMaxLength } from '@/config/index'
import CharacterCounterFormTextArea from "../text/CharacterCounterFormTextArea";

interface DialogFormProps {
    dialog: string,
    intent: string,
    topic: string,
    outcome_state: SimulationOutcomeState
}

export default function DialogNodeView({ data, isConnectable, id }: { data: InteractiveDialogNodeData, isConnectable: boolean, id: string }) {
    const {
        label,
        dialog,
        outcome_state,
        intent,
        topic,
        onAddNode,
        onDeleteNode,
        onEditNode,
        isFirstNode,
        editable,
        allowToAddNewDialog,
        allowToRemoveDialog,
        allowToUpdateDialog,
        simulation_chat_id
    } = data;

    const [showEditPopup, setShowEditPopup] = useState(false);

    // Different styling based on node type (Avatar vs Human)
    const headerClass = label === 'Human' ? 'border-red-500' : 'border-blue-500';

    // React Hook Form setup
    const { 
        register, 
        handleSubmit: hookFormSubmit, 
        formState: { errors }, 
        watch,
        reset 
    } = useForm<DialogFormProps>({
        defaultValues: {
            dialog: dialog || '',
            intent: intent || '',
            topic: topic || '',
            outcome_state: outcome_state || 'G'
        }
    });

    // Handle delete button click
    const handleDelete = () => {
        if (isFirstNode) return; // Don't allow deletion of first node

        if (window.confirm("Are you sure you want to delete this dialog node?")) {
            onDeleteNode(id);
        }
    };

    // Handle add button click
    const handleAdd = () => {
        onAddNode(id, label === 'Avatar' ? 'Human' : 'Avatar');
    };

    // Handle edit button click
    const handleEdit = () => {
        // Reset form with current values
        reset({
            dialog: dialog || '',
            intent: intent || '',
            topic: topic || '',
            outcome_state: outcome_state || 'G'
        });
        setShowEditPopup(true);
    };

    // Handle form submission
    const onSubmit = (formData: DialogFormProps) => {
        onEditNode(id, {
            dialog: formData.dialog,
            intent: formData.intent,
            topic: formData.topic,
            outcome_state: formData.outcome_state,
            simulation_chat_id: simulation_chat_id
        });

        setShowEditPopup(false);
    };

    // Handle cancel
    const handleCancel = () => {
        setShowEditPopup(false);
    };

    return (
        <>
            <div className={`w-64 h-48 flex flex-col relative border-2 rounded shadow-md bg-white`}>
                {/* Header section with title and controls */}
                <div className={`w-full h-9 flex justify-between items-center px-2 border-b-2 ${headerClass}`}>
                    <div className="font-bold text-xl">{label}</div>
                    {editable &&
                        <div className="flex items-center gap-1 *:flex *:justify-center *:items-center *:h-6 *:aspect-square text-gray-500">
                            {allowToUpdateDialog &&
                                <button id='edit-node' className="hover:text-gray-700" onClick={handleEdit}>
                                    <RiPencilFill />
                                </button>
                            }
                            {allowToAddNewDialog &&
                                <button id='add-node' className="hover:text-gray-700" onClick={handleAdd}>
                                    <FaPlus />
                                </button>
                            }
                            {!isFirstNode && allowToRemoveDialog && (
                                <button id='delete-node' className="hover:text-gray-700" onClick={handleDelete}>
                                    <CgClose />
                                </button>
                            )}
                        </div>
                    }
                </div>

                {/* Dialog content section */}
                <div className="px-1.5 mb-1 flex-1 w-full overflow-hidden">
                    <div className="font-medium flex justify-between items-center ">
                        <span className='font-semibold mb-0.5 text-base'>Dialogue:</span>
                        {outcome_state != null && label == 'Human' && (
                            <div className={`px-2 rounded-full text-white text-xs ${outcome_state === 'R' ? 'bg-green-600' :
                                outcome_state === 'G' ? 'bg-green-400' :
                                    outcome_state === 'N' ? 'bg-gray-400' :
                                        outcome_state === 'P' ? 'bg-red-400' :
                                            outcome_state === 'T' ? 'bg-red-600' : 'bg-gray-200'
                                }`}>
                                {outcome_state === 'R' ? 'Great' :
                                    outcome_state === 'G' ? 'Good' :
                                        outcome_state === 'N' ? 'Neutral' :
                                            outcome_state === 'P' ? 'Poor' :
                                                outcome_state === 'T' ? 'Terrible' :
                                                    outcome_state}
                            </div>
                        )}
                    </div>
                    <div className="h-full w-full text-sm">
                        {dialog !== '' ? dialog :
                            <div className='mt-1 space-y-2 *:h-2 *:bg-gray-300 *:w-full *:rounded-sm'>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        }
                    </div>
                </div>

                <div className="h-7 w-full border-t-2 px-1 flex items-center gap-1">
                    <span className="font-bold text-base">Intent:</span>
                    <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis inline-block">{intent}</span>
                </div>

                {/* Connection handles */}
                <>
                    {!isFirstNode && (
                        <Handle
                            type="target"
                            position={Position.Top}
                            id="top"
                            style={{ background: '#555', width: 10, height: 10 }}
                            isConnectable={isConnectable}
                        />
                    )}
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id="bottom"
                        style={{ background: '#555', width: 10, height: 10 }}
                        isConnectable={isConnectable}
                    />
                </>
            </div>

            {/* Edit Dialog Popup with Form Validation */}
            {showEditPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-2 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">Edit {label} Dialogue</h3>

                        <form onSubmit={hookFormSubmit(onSubmit)}>
                            {/* Intent Field */}
                            <div className="">
                                <label className="block text-base font-semibold mb-1" htmlFor="intent">
                                    Intent <span className="text-red-500">*</span>
                                </label>
                                <CharacterCounterFormInput
                                    id="intent"
                                    name="intent"
                                    type='text'
                                    formFieldName='intent'
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    maxLength={inputMaxLength.chat.intent}
                                    required={true}
                                    requiredMessage='Intent is required'
                                    className="w-full p-1 border"
                                    placeholder="Enter intent..."
                                    onChange={() => {}}
                                    fontSize={14}
                                />
                            </div>

                            {/* Topic Field */}
                            <div className="">
                                <label className="block text-base font-semibold mb-1" htmlFor="topic">
                                    Topic <span className="text-red-500">*</span>
                                </label>
                                <CharacterCounterFormInput
                                    id="topic"
                                    name="topic"
                                    type='text'
                                    formFieldName='topic'
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    maxLength={inputMaxLength.chat.topic}
                                    required={true}
                                    requiredMessage='Topic is required'
                                    placeholder="Enter topic..."
                                    className="w-full p-1 border"
                                    onChange={() => {}}
                                    fontSize={14}
                                />
                            </div>

                            {/* Outcome State (only for Human nodes) */}
                            {label == 'Human' && (
                                <div className="">
                                    <label className="block text-base mb-1 font-semibold" htmlFor="outcome_state">
                                        Outcome State <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="outcome_state"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{ fontSize: `14px` }}
                                        {...register('outcome_state', { required: true })}
                                    >
                                        <option value="R">Great</option>
                                        <option value="G">Good</option>
                                        <option value="N">Neutral</option>
                                        <option value="P">Poor</option>
                                        <option value="T">Terrible</option>
                                    </select>
                                </div>
                            )}

                            {/* Dialogue Text */}
                            <div className="mb-3">
                                <label className="block text-base font-semibold mb-1" htmlFor="dialog">
                                    Dialogue Text <span className="text-red-500">*</span>
                                </label>
                                <CharacterCounterFormTextArea
                                    id="dialog"
                                    name="dialog"
                                    formFieldName='dialog'
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    maxLength={inputMaxLength.chat.dialog}
                                    required={true}
                                    requiredMessage='Dialog is required'
                                    placeholder="Enter dialogue text here..."
                                    className="w-full p-1 border"
                                    onChange={() => {}}
                                    fontSize={14}
                                />
                            </div>

                            <div className="flex justify-end gap-2 text-sm *:px-6 *:py-1">
                                <button
                                    type="button"
                                    className="bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};