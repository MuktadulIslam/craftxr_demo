"use client"
import React from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { SimulationBasicInfoForm } from '@/types/simulations';

interface EvaluationPanelToggleProps {
    register: UseFormRegister<SimulationBasicInfoForm>;
    setValue: UseFormSetValue<SimulationBasicInfoForm>;
    watch: UseFormWatch<SimulationBasicInfoForm>;
    saveToLocalStorage: (key: string, value: string) => void;
    storageKey: string;
}

const EvaluationPanelToggle = ({
    register,
    setValue,
    watch,
    saveToLocalStorage,
    storageKey
}: EvaluationPanelToggleProps) => {
    // Get the current value from the form
    const isEnabled = watch('show_evaluation_panel');

    // Register the field
    register('show_evaluation_panel');

    // Handle toggle change
    const handleToggle = () => {
        const newValue = !isEnabled;
        setValue('show_evaluation_panel', newValue, { shouldValidate: true });
        saveToLocalStorage(storageKey, String(newValue));
    };

    return (
        <div className="flex mb-4">
            <label className="block text-xl mb-1 font-light italic">Show Evaluation Panel</label>

            <div className="flex items-center gap-5 ml-10">
                <span className={`font-semibold  ${isEnabled ? 'text-gray-400' : 'font-medium text-gray-900'}`}>
                    No
                </span>

                <button
                    type="button"
                    onClick={handleToggle}
                    className={`relative inline-flex h-6 w-16 items-center rounded-full transition-colors outline-none ring-2 ring-blue-500 ring-offset-2 ${isEnabled ? 'bg-blue-600' : 'bg-blue-200'
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-11' : 'translate-x-1'
                            }`}
                    />
                </button>

                <span className={`font-semibold ${isEnabled ? 'text-gray-900' : 'text-gray-400'}`}>
                    Yes
                </span>
            </div>
        </div>
    );
};

export default EvaluationPanelToggle;