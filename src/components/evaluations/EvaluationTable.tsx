"use client"
import { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { IoEye } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { IoDuplicateSharp } from "react-icons/io5";
import Link from 'next/link';
import { useGetEvaluations } from '@/lib/hooks/evaluationHook';
import { EvaluationsTableData, GetEvaluationsResponse } from '@/types/evaluations';
import { config as AppConfig } from '@/config';

export default function EvaluationTable() {
    const [evaluations, setEvaluations] = useState<EvaluationsTableData[]>([]);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
    const [totalEvalutionCount, setTotalEvalutionCount] = useState<number>(0);

    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const { data: evaluationData, isLoading } = useGetEvaluations(currentPageNumber - 1);

    useEffect(() => {
        if (evaluationData) {
            setTotalEvalutionCount(evaluationData.total_count);
            setEvaluations(evaluationData.results);
            setHasNextPage(evaluationData.next != null);
            setHasPreviousPage(evaluationData.previous != null);
        }
    }, [evaluationData]);

    const handlePreviousPage = () => {
        if (hasPreviousPage) {
            setCurrentPageNumber(currentPageNumber - 1);
        }
    };

    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentPageNumber(currentPageNumber + 1);
        }
    };

    const handlePageClick = (pageNumber: number) => {
        setCurrentPageNumber(pageNumber);
    };

    function convertToLocalTime(isoTimestamp: string): string {
        const date = new Date(isoTimestamp);

        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }
    // Calculate which page numbers to show
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const activePage = currentPageNumber;
        const totalAvailablePages = Math.ceil(totalEvalutionCount / AppConfig.evalutionOffsetLimit);
        const maxPageNumbersToShow = 3;
        const startPage = Math.max(1, activePage - maxPageNumbersToShow + 1);
        const endPage = Math.min(totalAvailablePages, Math.max(activePage, maxPageNumbersToShow));

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${activePage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalAvailablePages - 1) {
            pageNumbers.push(
                <span key="ellipsis2" className="px-1 text-2xl font-bold">......</span>
            );
        }
        if (endPage < totalAvailablePages) {
            pageNumbers.push(
                <button
                    key={totalAvailablePages}
                    onClick={() => handlePageClick(totalAvailablePages)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${activePage === totalAvailablePages ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    {totalAvailablePages}
                </button>
            )
        }
        return pageNumbers;
    };

    return (
        <div className='w-full h-full relative flex flex-col'>
            {/* Header */}
            <div className="h-20 flex justify-between items-center p-4 border-b border-gray-300">
                <h1 className="text-3xl font-medium text-gray-800">Evalution Sessions</h1>
                <Link href={"/evaluations/create"}
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
                                        <th className="pl-2 text-left text-gray-600">Actions</th>
                                        <th className="text-left text-gray-600">Simulation Title</th>
                                        <th className="text-left text-gray-600">Scenario Name</th>
                                        <th className="text-left text-gray-600">Session Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                    {evaluations.length > 0 ? (
                                        evaluations.map((evaluation) => (
                                            <tr key={evaluation.session_id} className="hover:bg-gray-100">
                                                <td className="py-3 pl-10 w-32">
                                                    <div className="flex items-center space-x-7 font-semibold">
                                                        <Link
                                                            href={`/evaluations/view/${evaluation.session_id}`}
                                                            className="text-gray-500 hover:text-gray-700 relative group"
                                                        >
                                                            <IoEye className="w-6 h-6" />
                                                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                                View Evaluation
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className="font-medium">{evaluation.simulation_title}</span>
                                                </td>
                                                <td className="py-3 text-left min-w-48 whitespace-nowrap">
                                                    <span className="text-gray-600">{evaluation.scenario_name}</span>
                                                </td>
                                                <td className="py-3 text-left min-w-48 whitespace-nowrap">
                                                    <span className="text-gray-600">{convertToLocalTime(evaluation.session_time)}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center text-gray-500">
                                                No evalutions sessions found. Create your first one!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>

            {/* Page Navigation buttons */}
            <div className="w-full h-12 flex justify-between items-center bg-[#00835e] px-5">
                <button
                    onClick={handlePreviousPage}
                    disabled={!hasPreviousPage}
                    className={`w-32 py-1.5 rounded-md ${hasPreviousPage
                        ? 'bg-indigo-700 text-white hover:scale-110'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Previous
                </button>

                <div className="flex items-center space-x-2">
                    {renderPageNumbers()}
                </div>

                <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className={`w-32 py-1.5 rounded-md ${hasNextPage
                        ? 'bg-indigo-700 text-white hover:scale-110'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}