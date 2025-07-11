"use client"
import { useGetProgramAffiliations } from '@/lib/hooks/simulationProgramsHook';
import { useContext, useEffect, useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { SimulationBasicInfoForm } from '@/types/simulations';
import { newSimulationStorage } from '@/utils/storage_name';
import { LocalStorageContext } from '@/lib/redux/LocalStorageContext';
import { inputMaxLength } from '@/config/index'
import CharacterCounterFormInput from '@/components/text/CharacterCounterFormInput';
import CharacterCounterInput from '@/components/text/CharacterCounterInput';
import CharacterCounterFormTextArea from '@/components/text/CharacterCounterFormTextArea';
import EvaluationPanelToggle from './EvaluationPanelToggle';
import { useAppSelector } from '@/lib/redux/store';

interface ScenarioInfoFormProps {
    register: UseFormRegister<SimulationBasicInfoForm>;
    errors: FieldErrors<SimulationBasicInfoForm>;
    setValue: UseFormSetValue<SimulationBasicInfoForm>;
    watch: UseFormWatch<SimulationBasicInfoForm>;
}

export default function ScenarioInfoForm({
    register,
    errors,
    setValue,
    watch
}: ScenarioInfoFormProps) {
    const { isLocalStorageRemoved } = useAppSelector(state => state.localStorageState);
    const { data: programAffiliations, isLoading: isLoadingProgramAffilation } = useGetProgramAffiliations();
    const { saveToLocalStorage, readFromLocalStorage, saveToLocalStorageAsync } = useContext(LocalStorageContext);

    // State for objectives management
    const [objectives, setObjectives] = useState<string[]>([]);
    const [objectiveInput, setObjectiveInput] = useState<string>("");

    // Register simulation_objectives with validation
    useEffect(() => {
        setObjectives(JSON.parse(readFromLocalStorage(newSimulationStorage.simulation_objectives) || '[]'))
    }, [readFromLocalStorage, isLocalStorageRemoved]);

    useEffect(() => {
        if (!isLoadingProgramAffilation) {
            const storedProgramdAffilation = readFromLocalStorage(newSimulationStorage.program_affiliation);
            if (storedProgramdAffilation) {
                setValue('program_affiliation', storedProgramdAffilation, { shouldValidate: true });
            }
        }
    }, [programAffiliations, readFromLocalStorage, isLoadingProgramAffilation, setValue])

    // Add new objective
    const addObjective = (): void => {
        if (objectiveInput.trim() !== "") {
            const newObjectives = [...objectives, objectiveInput];
            setObjectives(newObjectives);
            setValue('simulation_objectives', newObjectives, { shouldValidate: true });
            saveToLocalStorage(newSimulationStorage.simulation_objectives, JSON.stringify(newObjectives))
            setObjectiveInput("");
        }
    };

    // Remove objective
    const removeObjective = (index: number): void => {
        const newObjectives = objectives.filter((_, i) => i !== index);
        setObjectives(newObjectives);
        setValue('simulation_objectives', newObjectives, { shouldValidate: true });
        saveToLocalStorage(newSimulationStorage.simulation_objectives, JSON.stringify(newObjectives))
    };

    // Handle keypress for adding objectives
    const handleObjectiveKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addObjective();
        }
    };

    return (
        <form className="w-full flex-none bg-gray-100 p-5">
            <div className="w-full h-12 text-2xl font-semibold">
                Add Basic Info
            </div>

            <div className="w-full h-auto grid grid-cols-2 gap-6">
                <div className=' space-y-1.5'>
                    <div>
                        <label className="block text-xl mb-1 font-light italic">Program Affiliation</label>
                        <div className="relative">
                            <select
                                className={`w-full p-2 border ${errors.program_affiliation ? 'border-red-500' : 'border-gray-300'}`}
                                {...register("program_affiliation", {
                                    required: "Program affiliation is required", onChange: (event) => {  // Fixed syntax here
                                        const selectedId = event.target.value;
                                        const selectedProgram = programAffiliations?.find(program => program.affiliation_id === selectedId);
                                        saveToLocalStorage(newSimulationStorage.program_affiliation, selectedId);
                                        setValue('program_affiliation_details', selectedProgram, { shouldValidate: true });
                                    },
                                })}
                            >
                                {isLoadingProgramAffilation ? (
                                    <option value="">Loading program affiliations...</option>
                                ) : (
                                    <option value="" disabled>Select an affiliation</option>
                                )}
                                {programAffiliations?.map((program, index) => (
                                    <option key={index} value={program.affiliation_id}>
                                        {program.program_name}
                                    </option>
                                ))}
                            </select>
                            {errors.program_affiliation && (
                                <p className="mt-1 text-sm text-red-600">{errors.program_affiliation.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xl mb-1 font-light italic" htmlFor="scenario_name">
                            <span className="relative">Scenario Name</span>
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
                            onChange={(event) => {
                                saveToLocalStorage(newSimulationStorage.scenario_name, event.target.value)
                            }}
                            onBlur={(event) => {
                                saveToLocalStorageAsync(newSimulationStorage.scenario_name, event.target.value)
                            }}
                        />
                    </div>

                    <div>
                        <label
                            className="block text-xl mb-1 font-light italic"
                            htmlFor='scenario_description'
                        >
                            Scenario Description
                        </label>
                        <div className="relative">
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
                                onChange={(event) => {
                                    saveToLocalStorage(newSimulationStorage.scenario_description, event.target.value)
                                }}
                                onBlur={(event) => {
                                    saveToLocalStorageAsync(newSimulationStorage.scenario_description, event.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xl mb-1 font-light italic" htmlFor="scenario_overview">Scenario Overview</label>
                        <div className="relative">
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
                                onChange={(event) => {
                                    saveToLocalStorage(newSimulationStorage.scenario_overview, event.target.value)
                                }}
                                onBlur={(event) => {
                                    saveToLocalStorageAsync(newSimulationStorage.scenario_overview, event.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xl mb-1 font-light italic" htmlFor="scenario_related_details">Scenario Related Details</label>
                        <div className="relative">
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
                                onChange={(event) => {
                                    saveToLocalStorage(newSimulationStorage.scenario_related_details, event.target.value)
                                }}
                                onBlur={(event) => {
                                    saveToLocalStorageAsync(newSimulationStorage.scenario_related_details, event.target.value)
                                }}

                            />
                        </div>
                    </div>
                </div>

                <div className=' space-y-1.5'>
                    <div>
                        <label htmlFor="simulation_title" className="block text-xl mb-1 font-light italic">Simulation Title</label>
                        <div className="relative">
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
                                onChange={(event) => {
                                    saveToLocalStorage(newSimulationStorage.simulation_title, event.target.value)
                                }}
                                onBlur={(event) => {
                                    saveToLocalStorageAsync(newSimulationStorage.simulation_title, event.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xl mb-1 font-light italic">Simulation Description</label>
                        <div className="relative">
                            <CharacterCounterFormTextArea
                                rows={4}
                                formFieldName='simulation_description'
                                register={register}
                                errors={errors}
                                watch={watch}
                                maxLength={inputMaxLength.scenario.description}
                                required={true}
                                requiredMessage='Scenario related details is required'
                                onChange={(event) => {
                                    saveToLocalStorage(newSimulationStorage.simulation_description, event.target.value)
                                }}
                                onBlur={(event) => {
                                    saveToLocalStorageAsync(newSimulationStorage.simulation_description, event.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <EvaluationPanelToggle
                        register={register}
                        setValue={setValue}
                        watch={watch}
                        saveToLocalStorage={saveToLocalStorage}
                        storageKey={newSimulationStorage.show_evaluation_panel}
                    />

                    <div className="mb-4">
                        <label
                            className="block text-xl mb-1 font-light italic"
                            htmlFor="avatar_designation"
                        >
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
                            onChange={(event) => {
                                saveToLocalStorage(newSimulationStorage.avatar_designation, event.target.value)
                            }}
                            onBlur={(event) => {
                                saveToLocalStorageAsync(newSimulationStorage.avatar_designation, event.target.value)
                            }}

                            placeholder="e.g. patient"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xl mb-1 font-light italic">Simulation Objectives</label>
                        <div className="flex">
                            <CharacterCounterInput
                                type='text'
                                value={objectiveInput}
                                onChange={(e) => setObjectiveInput(e.target.value)}
                                onKeyPress={handleObjectiveKeyPress}
                                placeholder="Add a new objective"
                                maxLength={inputMaxLength.simulation.objectives}
                            />

                            <button
                                type="button"
                                onClick={addObjective}
                                className="ml-2 px-4 h-10 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>

                        <div className="mt-2">
                            <ul className="mt-2 border border-gray-200 rounded bg-white max-h-48 overflow-y-auto">
                                {objectives.map((objective, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center p-2 border-b border-gray-200 last:border-b-0"
                                    >
                                        <span>{objective}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeObjective(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                                {objectives.length === 0 && (
                                    <li className="p-2 text-gray-500 italic">No objectives added yet</li>
                                )}
                            </ul>
                            {errors.simulation_objectives && (
                                <p className="mt-1 text-sm text-red-600">{errors.simulation_objectives.message}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}