"use client"
import React from 'react';

const StepsButton = ({ setCurrentPage, currentPage, pageIndex }: {
    setCurrentPage: (pageIndex: number) => void,
    currentPage: number,
    pageIndex: number
}) => {
    return (
        <button
            onClick={() => setCurrentPage(pageIndex)}
            className={`z-10 h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium 
            ${currentPage >= pageIndex ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-2 border-blue-600'}`}
        >
            {pageIndex + 1}
        </button>
    );
}

interface ProgressIndicatorProps {
    currentPage: number;
    onPageChange: (pageIndex: number) => Promise<void>;
}

export default function ProgressIndicator({ currentPage, onPageChange }: ProgressIndicatorProps) {
    return (
        <div className="w-full h-16 flex justify-center items-center">
            <div className="relative h-2 w-md bg-gray-200 flex justify-between items-center">
                {/* Progress bar that fills based on current page */}
                <div
                    className="absolute h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${(currentPage / 3) * 100}%` }}
                />

                {Array(4).fill(null).map((_, index: number) => (
                    <StepsButton
                        setCurrentPage={onPageChange}
                        currentPage={currentPage}
                        pageIndex={index}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
};