"use client";

import { useGetSimulation, useUpdateSimulation } from "@/lib/hooks/simulationHook";
import { useEffect, useState, useCallback } from "react";
import { useForm } from 'react-hook-form';
import { ScenarioUpdateFormData } from '@/types/simulations';
import CharacterCounterFormInput from "../text/CharacterCounterFormInput";
import { inputMaxLength } from '@/config/index'
import CharacterCounterFormTextArea from "../text/CharacterCounterFormTextArea";
import CharacterCounterInput from "../text/CharacterCounterInput";

export default function ScenarioFormSideBar({ simulationID }: { simulationID: string }) {
    const { data: simulationData, isLoading: simulationDataLoading } = useGetSimulation(simulationID);
    const updateSimulation = useUpdateSimulation(simulationID);

    // Initialize form with default values
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ScenarioUpdateFormData>({
        defaultValues: {
            program_affiliation: "",
            scenario_name: "",
            scenario_overview: "",
            scenario_description: "",
            scenario_related_details: "",
            simulation_title: "",
            simulation_description: "",
            simulation_objectives: [],
            avatar_designation: "patient"
        }
    });

    // State for objectives management
    const [objectives, setObjectives] = useState<string[]>([]);
    const [objectiveInput, setObjectiveInput] = useState<string>("");

    // Define resetFormWithApiData as a useCallback to memoize it
    const resetFormWithApiData = useCallback(() => {
        if (!simulationData) return;

        reset({
            program_affiliation: simulationData.affiliation.affiliation_id || "",
            scenario_name: simulationData.scenario?.scenario_name || "",
            scenario_overview: simulationData.scenario?.scenario_overview || "",
            scenario_description: simulationData.scenario?.scenario_description || "",
            scenario_related_details: simulationData.scenario?.scenario_details || "",
            simulation_title: simulationData.simulation_title || "",
            simulation_description: simulationData.simulation_description || "",
            simulation_objectives: simulationData.simulation_objectives || [],
            avatar_designation: simulationData.avatar_designation || ""
        });

        // Reset objectives as well
        setObjectives(simulationData.simulation_objectives || []);
    }, [simulationData, reset]);

    // Update form when simulation data is loaded
    useEffect(() => {
        if (simulationData) {
            // Set objectives from simulation data
            if (simulationData.simulation_objectives) {
                setObjectives(simulationData.simulation_objectives);
            }

            // Reset form with data from API
            resetFormWithApiData();
        }
    }, [simulationData, resetFormWithApiData]);

    const onSubmit = async (data: ScenarioUpdateFormData) => {
        try {
            // Include the objectives array in the form data
            data.simulation_objectives = objectives;

            // Use the mutation hook to update the simulation
            await updateSimulation.mutateAsync(data);

            alert("Scenario saved successfully!");
        } catch (error) {
            console.error("Error saving scenario:", error);
            alert("An error occurred while saving the scenario.");
        }
    };

    // Handler for cancel button
    const handleCancel = () => {
        resetFormWithApiData();
        alert("Form reset to original values");
    };

    const addObjective = (): void => {
        if (objectiveInput.trim() !== "") {
            setObjectives([...objectives, objectiveInput]);
            setObjectiveInput("");
        }
    };

    const removeObjective = (index: number): void => {
        setObjectives(objectives.filter((_, i) => i !== index));
    };

    if (simulationDataLoading) {
        return <div className="w-full h-full flex items-center justify-center">Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full px-2 pt-2 space-y-2 overflow-y-auto text-black">

            <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Simulation Configuration</h2>

                <div className="mb-1">
                    <label htmlFor="simulation_title" className="block text-base font-medium text-gray-700 mb-1">
                        Simulation Title
                    </label>
                    <CharacterCounterFormInput
                        id="simulation_title"
                        type='text'
                        formFieldName='simulation_title'
                        register={register}
                        errors={errors}
                        watch={watch}
                        maxLength={inputMaxLength.simulation.title}
                        required={true}
                        requiredMessage='Simulation title is required'
                        onChange={() => { }}
                        className="p-1 border border-gray-700"
                        fontSize={14}
                    />
                </div>

                <div className="mb-1">
                    <label htmlFor="simulation_description" className="block text-base font-medium text-gray-700 mb-1">
                        Simulation Description
                    </label>
                    <CharacterCounterFormTextArea
                        id="simulation_description"
                        rows={4}
                        formFieldName='simulation_description'
                        register={register}
                        errors={errors}
                        watch={watch}
                        maxLength={inputMaxLength.scenario.description}
                        required={true}
                        requiredMessage='Scenario description is required'
                        onChange={() => { }}
                        className="p-1 border border-gray-700"
                        fontSize={14}
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-base font-medium text-gray-700 mb-1">
                        Simulation Objectives
                    </label>
                    <div className="flex">
                        <CharacterCounterInput
                            type='text'
                            value={objectiveInput}
                            onChange={(e) => setObjectiveInput(e.target.value)}
                            placeholder="Add a new objective"
                            maxLength={inputMaxLength.simulation.objectives}
                            className="p-1 border border-gray-700 h-8"
                            fontSize={14}
                        />
                        <button
                            type="button"
                            onClick={addObjective}
                            className="bg-blue-500 text-white px-4 h-8 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Add
                        </button>
                    </div>
                    <div className="mt-1 space-y-1 text-sm">
                        {objectives.map((objective, index) => (
                            <div key={index} className="flex items-center bg-gray-100 p-1 rounded border border-gray-700">
                                <span className="flex-grow">{objective}</span>
                                <button
                                    type="button"
                                    onClick={() => removeObjective(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-1">
                    <label htmlFor="avatar_designation" className="block text-base font-medium text-gray-700 mb-1">
                        Avatar Designation
                    </label>
                    <CharacterCounterFormInput
                        id='avatar_designation'
                        type='text'
                        formFieldName='avatar_designation'
                        register={register}
                        errors={errors}
                        watch={watch}
                        maxLength={inputMaxLength.avatar.designation}
                        required={true}
                        requiredMessage='Avatar designation is required'
                        onChange={() => { }}
                        fontSize={14}
                        className="p-1 border border-gray-700"
                        placeholder="e.g. patient"
                    />
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Scenario Details</h2>

                <div className="mb-1">
                    <label htmlFor="scenario_name" className="block text-base font-medium text-gray-700 mb-1">
                        Scenario Name
                    </label>
                    <CharacterCounterFormInput
                        id="scenario_name"
                        type='text'
                        formFieldName='scenario_name'
                        register={register}
                        errors={errors}
                        watch={watch}
                        maxLength={inputMaxLength.scenario.name}
                        required={true}
                        requiredMessage='Scenario name is required'
                        onChange={() => { }}
                        fontSize={14}
                        className="p-1 border border-gray-700"
                    />
                </div>

                <div className="mb-1">
                    <label htmlFor="scenario_overview" className="block text-base font-medium text-gray-700 mb-1">
                        Scenario Overview
                    </label>
                    <CharacterCounterFormTextArea
                        id="scenario_overview"
                        rows={4}
                        formFieldName='scenario_overview'
                        register={register}
                        errors={errors}
                        watch={watch}
                        maxLength={inputMaxLength.scenario.overview}
                        required={true}
                        requiredMessage='Scenario overview is required'
                        onChange={() => { }}
                        fontSize={14}
                        className="p-1 border border-gray-700"
                    />
                </div>

                <div className="mb-1">
                    <label htmlFor="scenario_description" className="block text-sm font-medium text-gray-700 mb-1">
                        Scenario Description
                    </label>
                    <CharacterCounterFormTextArea
                        id="scenario_description"
                        rows={4}
                        formFieldName='scenario_description'
                        register={register}
                        errors={errors}
                        watch={watch}
                        maxLength={inputMaxLength.scenario.description}
                        required={true}
                        requiredMessage='Scenario description is required'
                        onChange={() => { }}
                        fontSize={14}
                        className="p-1 border border-gray-700"
                    />
                </div>

                <div className="">
                    <label htmlFor="scenario_related_details" className="block text-sm font-medium text-gray-700 mb-1">
                        Related Details
                    </label>
                    <CharacterCounterFormTextArea
                        id="scenario_related_details"
                        rows={4}
                        formFieldName='scenario_related_details'
                        register={register}
                        errors={errors}
                        watch={watch}
                        maxLength={inputMaxLength.scenario.related_details}
                        required={true}
                        requiredMessage='Scenario related details is required'
                        onChange={() => { }}
                        fontSize={14}
                        className="p-1 border border-gray-700"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-4 p-2 sticky bottom-0 backdrop-blur-xl backdrop-opacity-70">
                <button
                    type="button"
                    onClick={handleCancel}
                    className={`w-28 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 ${updateSimulation.isPending ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={updateSimulation.isPending}
                    className={`w-28 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${updateSimulation.isPending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                    {updateSimulation.isPending ? 'Saving...' : 'Save Scenario'}
                </button>
            </div>
        </form>
    );
}