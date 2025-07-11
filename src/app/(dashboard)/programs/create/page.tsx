'use client'
import ProgramCreationForm from '@/components/programs/ProgramCreationForm';
import { useCreateProgram } from '@/lib/hooks/simulationProgramsHook';
import { Program } from '@/types/programAffiliation';
import React from 'react';
import { useForm } from 'react-hook-form';



export default function Page() {
    const createProgram = useCreateProgram();
    const {
        register,
        formState: { errors },
        setValue,
        reset,
        watch,
        handleSubmit
    } = useForm<Program>({
        defaultValues: {
            program_name: '',
            program_abbr: '',
            institute: {
                institute_name: '',
                institute_alias: ''
            },
            school: {
                school_name: '',
                school_alias: ''
            },
            department: {
                department_name: ''
            },
        },
        mode: 'onChange'
    });


    const onSubmit = async (data: Program) => {
        try {
            const result = await createProgram.mutateAsync(data);
            reset();
        } catch (error) {
            console.error('Error creating Program:', error);
        }
    };

    return (
        <div className="w-full max-w-container h-full flex flex-col bg-white mx-auto text-black">
            <div className="h-16 w-full px-5 flex items-center justify-between border-b-2">
                <h1 className="text-3xl font-semibold">Create New Program</h1>
            </div>
            <div className="w-full h-auto pt-5 flex justify-center">
                <ProgramCreationForm
                    handleSubmit={handleSubmit(onSubmit)}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    reset={reset}
                    watch={watch} // Add this line
                />
            </div>
        </div>
    );
};
