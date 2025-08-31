"use client"
import React from 'react';

interface DialogErrorsAlertProps {
    errors: string[];
    show: boolean;
}

export default function DialogErrorsAlert({ errors, show }: DialogErrorsAlertProps) {
    if (!show || errors.length === 0) {
        return null;
    }

    return (
        <div className="w-full px-5 py-2">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Please fix the following issues:</strong>
                <ul className="mt-2 list-disc pl-5">
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}