"use client"
import { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import Link from 'next/link';
import { RiDeleteBin6Fill } from "react-icons/ri";

import { useDeleteProgram, useGetProgramAffiliations } from '@/lib/hooks/simulationProgramsHook';
import { ProgramListResponse } from '@/types/programAffiliation';

const actionButtonHoverText = (text: string) => {
    return (<span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {text}
    </span>);
}

export default function ProgramsTable() {
    const deleteProgramMutation = useDeleteProgram();
    const [programs, setPrograms] = useState<ProgramListResponse>([]);
    const { data: programsData, isLoading } = useGetProgramAffiliations();

    useEffect(() => {
        if (programsData) {
            setPrograms(programsData);
        }
    }, [programsData]);

    const handleDeleteProgram = (affiliationId: string) => {
        if (window.confirm('Are you sure you want to delete this simulation?')) {
            deleteProgramMutation.mutate({
                programID: affiliationId,
                pageNumber: 2
                // pageNumber: currentPageNumber - 1 
            }, {
                onSuccess: () => {
                    // Update local state to immediately remove the deleted simulation
                    setPrograms(prevPrograms =>
                        prevPrograms.filter(program => program.affiliation_id !== affiliationId)
                    );
                }
            });
        }
    };


    return (
        <div className='w-full h-full relative flex flex-col'>
            {/* Header */}
            <div className="h-20 flex justify-between items-center p-4 border-b border-gray-300">
                <h1 className="text-3xl font-medium text-gray-800">Simulation Programs</h1>
                <Link href={"/programs/create"}
                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    <FaPlus className="w-3 h-3" />
                    <span>Create</span>
                </Link>
            </div>

            {/* Scenarios Table */}
            <div className="flex-1">
                <div className="p-4">
                    {isLoading ? (
                        <div className="text-center py-4">Loading evalutions...</div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b h-12 bg-gray-300 z-50 text-xl font-bold border-gray-300 sticky top-0">
                                        <th className="pl-2 w-32 text-left text-gray-600">Actions</th>
                                        <th className="pl-2 text-left text-gray-600">Program Name</th>
                                        <th className="text-left text-gray-600">Affiliation</th>
                                        <th className="text-left text-gray-600">Institute Alias</th>
                                        <th className="text-left text-gray-600">School Alias</th>
                                        <th className="text-left text-gray-600">Department Name</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                    {programs.length > 0 ? (
                                        programs.map((program, index) => (
                                            <tr key={index} className="hover:bg-gray-100 text-gray-600">
                                                <td className="py-3 pl-10 pr-5 w-32">
                                                    <div className="flex items-center space-x-7 font-semibold">
                                                        <button
                                                            onClick={() => handleDeleteProgram(program.affiliation_id)}
                                                            className="text-gray-500 hover:text-gray-700 relative group"
                                                            disabled={deleteProgramMutation.isPending && deleteProgramMutation.variables.programID === program.affiliation_id}
                                                        >
                                                            {deleteProgramMutation.variables?.programID === program.affiliation_id &&
                                                                deleteProgramMutation.isPending ?
                                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin"></div> :
                                                                <>
                                                                    <RiDeleteBin6Fill className="w-5 h-5" />
                                                                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                                        Delete Simulation
                                                                    </span>
                                                                </>
                                                            }
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="pl-2 truncate">
                                                    {program.program_name}
                                                </td>
                                                <td className="">
                                                    {program.program_affiliation}
                                                </td>
                                                <td className="">
                                                    {program.institute.institute_alias}
                                                </td>
                                                <td className="">
                                                    {program.school.school_alias}
                                                </td>
                                                <td className="">
                                                    {program.department.department_name}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center text-gray-500">
                                                No simulation program is found. Create your first one!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}