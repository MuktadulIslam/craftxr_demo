'use client'
import React, { createContext, ReactNode, useCallback } from 'react';
import { debounce } from 'lodash';
import { useAppDispatch } from '@/lib/redux/store';
import { setLoaclStorageSavingState } from '@/lib/redux/features/localStorageSavingSlice';
import { config as appConfig } from '@/config';
import { newSimulationStorage } from '@/utils/storage_name';


export const deleteNewSimulationStoredData = (): boolean => {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(newSimulationStorage.program_affiliation)
        localStorage.removeItem(newSimulationStorage.program_affiliation_details)
        localStorage.removeItem(newSimulationStorage.scenario_name)
        localStorage.removeItem(newSimulationStorage.scenario_overview)
        localStorage.removeItem(newSimulationStorage.scenario_description)
        localStorage.removeItem(newSimulationStorage.scenario_related_details)
        localStorage.removeItem(newSimulationStorage.simulation_title)
        localStorage.removeItem(newSimulationStorage.simulation_description)
        localStorage.removeItem(newSimulationStorage.simulation_objectives)
        localStorage.removeItem(newSimulationStorage.avatar_designation)
        localStorage.removeItem(newSimulationStorage.show_evaluation_panel)
        localStorage.removeItem(newSimulationStorage.chat_dialog_nodes)
        localStorage.removeItem(newSimulationStorage.chat_dialog_edges)
        return true;
    }
    return false;
}


interface LocalStorageContextType {
    readFromLocalStorage: (key: string) => string | null;
    saveToLocalStorage: (key: string, value: string) => void;
    saveToLocalStorageAsync: (key: string, value: string) => void;
}

export const LocalStorageContext = createContext<LocalStorageContextType>({
    readFromLocalStorage: () => null,
    saveToLocalStorage: () => { },
    saveToLocalStorageAsync: () => { }
});

export default function LocalStorageProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();

    // Function to safely read from localStorage
    const readFromLocalStorage = useCallback((key: string): string | null => {
        if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem(key);
        }
        return null;
    }, []);

    // Debounced function to save to localStorage
    const saveToLocalStorage = debounce((key: string, value: string) => {
        dispatch(setLoaclStorageSavingState(true));
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(key, value);
            }
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }

        // Set saving loader duration 0.5 second
        setTimeout(() => {
            dispatch(setLoaclStorageSavingState(false));
        }, 500);
    }, appConfig.localStorageSavingDuration);   // Debounced save function - will only execute 1.5 second after the user stops typing

    const saveToLocalStorageAsync = useCallback(
        async (key: string, value: string): Promise<void> => {
            return new Promise<void>((resolve) => {
                dispatch(setLoaclStorageSavingState(true));
                try {
                    if (typeof window !== 'undefined' && window.localStorage) {
                        localStorage.setItem(key, value);
                        resolve();
                    } else {
                        resolve();
                    }
                } catch (error) {
                    console.error(`Error saving ${key} to localStorage:`, error);
                    resolve();
                }
                // Set saving loader duration 0.5 second
                setTimeout(() => {
                    dispatch(setLoaclStorageSavingState(false));
                }, 500);
            });
        },
        [dispatch]
    );

    return (
        <LocalStorageContext.Provider value={{ readFromLocalStorage, saveToLocalStorage, saveToLocalStorageAsync }}>
            {children}
        </LocalStorageContext.Provider>
    );
};