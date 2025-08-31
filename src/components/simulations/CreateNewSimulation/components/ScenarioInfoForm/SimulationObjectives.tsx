"use client"
import { useContext, useEffect, useState } from 'react';
import { UseFormSetValue, FieldErrors } from 'react-hook-form';
import { SimulationBasicInfoForm } from '@/types/simulations';
import { newSimulationStorage } from '@/utils/storage_name';
import { LocalStorageContext } from '@/lib/redux/LocalStorageContext';
import { inputMaxLength } from '@/config/index'
import CharacterCounterInput from '@/components/text/CharacterCounterInput';
import { useAppSelector } from '@/lib/redux/store';

interface SimulationObjectivesProps {
    setValue: UseFormSetValue<SimulationBasicInfoForm>;
    errors: FieldErrors<SimulationBasicInfoForm>;
}

export default function SimulationObjectives({
    setValue,
    errors
}: SimulationObjectivesProps) {
    const { isLocalStorageRemoved } = useAppSelector(state => state.localStorageState);
    const { saveToLocalStorage, readFromLocalStorage } = useContext(LocalStorageContext);

    // State for objectives management
    const [objectives, setObjectives] = useState<string[]>([]);
    const [objectiveInput, setObjectiveInput] = useState<string>("");

    // Load objectives from localStorage on component mount
    useEffect(() => {
        setObjectives(JSON.parse(readFromLocalStorage(newSimulationStorage.simulation_objectives) || '[]'))
    }, [readFromLocalStorage, isLocalStorageRemoved]);

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
        <div>
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
    );
}