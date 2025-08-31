"use client"
import React from 'react';
import LocalStorageSave from '@/components/loading/LocalStorageSave';

export default function SimulationHeader(){
    return (
        <div className="h-12 w-full px-5 flex items-center justify-between border-b-2">
            <h1 className="text-3xl font-semibold">Create Simulation Scenario</h1>
            <LocalStorageSave />
        </div>
    );
}