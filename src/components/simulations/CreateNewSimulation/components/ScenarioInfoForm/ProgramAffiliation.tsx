"use client"
import { useGetProgramAffiliations } from '@/lib/hooks/simulationProgramsHook';
import { useContext, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { SimulationBasicInfoForm } from '@/types/simulations';
import { newSimulationStorage } from '@/utils/storage_name';
import { LocalStorageContext } from '@/lib/redux/LocalStorageContext';

interface ProgramAffiliationProps {
    register: UseFormRegister<SimulationBasicInfoForm>;
    errors: FieldErrors<SimulationBasicInfoForm>;
    setValue: UseFormSetValue<SimulationBasicInfoForm>;
}

export default function ProgramAffiliation({
    register,
    errors,
    setValue
}: ProgramAffiliationProps) {
    const { data: programAffiliations, isLoading: isLoadingProgramAffilation } = useGetProgramAffiliations();
    const { saveToLocalStorage, readFromLocalStorage } = useContext(LocalStorageContext);

    // Load stored program affiliation when data is available
    useEffect(() => {
        if (!isLoadingProgramAffilation) {
            const storedProgramdAffilation = readFromLocalStorage(newSimulationStorage.program_affiliation);
            if (storedProgramdAffilation) {
                setValue('program_affiliation', storedProgramdAffilation, { shouldValidate: true });
            }
        }
    }, [programAffiliations, readFromLocalStorage, isLoadingProgramAffilation, setValue])

    return (
        <div>
            <label className="block text-xl mb-1 font-light italic">Program Affiliation</label>
            <div className="relative">
                <select
                    className={`w-full p-2 border ${errors.program_affiliation ? 'border-red-500' : 'border-gray-300'}`}
                    {...register("program_affiliation", {
                        required: "Program affiliation is required", 
                        onChange: (event) => {
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
    );
}