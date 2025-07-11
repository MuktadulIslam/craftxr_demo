"use client";

import React, { useEffect, useState } from 'react';

const ThemeToggle = ({className = "" }) => {
    const [theme, setTheme] = useState('light');
    // State to track if component is mounted (for hydration safety)
    const [mounted, setMounted] = useState(false);

    // Effect to sync component state with already-applied theme on mount
    useEffect(() => {
        setMounted(true);

        // Check if theme is already stored in localStorage
        // const storedTheme = localStorage.getItem('theme');
        const storedTheme = 'light'

        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            // Check system preference but don't store it
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }, []);

    // Effect to apply the theme change to the document
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
            // Set CSS variables for dark theme
            root.style.setProperty('--background-color', '#121212');
            root.style.setProperty('--text-color', '#ffffff');
        } else {
            root.classList.remove('dark');
            // Set CSS variables for light theme
            root.style.setProperty('--background-color', '#ffffff');
            root.style.setProperty('--text-color', '#121212');
        }

        // Removed localStorage.setItem from here
    }, [theme, mounted]);

    // Function to toggle theme
    const toggleTheme = () => {
        const newTheme = 'light';
        // const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        // Only store theme in localStorage when explicitly toggled by user
        localStorage.setItem('theme', newTheme);
    };

    // Don't render anything until after client-side hydration
    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 transition-colors flex justify-center items-center ${className}`}>
            {theme === 'light' ? (
                // Sun icon for light mode
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className='h-full aspect-square'>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            ) : (
                // Sun icon for light mode
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className='h-full aspect-square'>
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                
            )}
        </button>
    );
};

export default ThemeToggle;