// components/Popup.tsx
'use client';

import React, { useEffect, ReactNode } from 'react';

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    width?: string;
    position?: 'center' | 'top' | 'right' | 'bottom' | 'left';
    showCloseButton?: boolean;
    closeOnClickOutside?: boolean;
    closeOnEsc?: boolean;
    bgColor?: string;
    popupBGColor?: string;
}

const Popup: React.FC<PopupProps> = ({
    isOpen,
    onClose,
    title,
    children,
    width = 'w-auto', // default width, can be overridden
    position = 'center', // options: 'center', 'top', 'right', 'bottom', 'left'
    showCloseButton = true,
    closeOnClickOutside = true,
    closeOnEsc = true,
    bgColor = 'bg-none',
    popupBGColor = 'bg-popup-background-color'
}) => {
    // Close popup when Escape key is pressed
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (closeOnEsc && e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Prevent body scrolling when popup is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose, closeOnEsc]);

    // Handle positioning
    const getPositionClasses = (): string => {
        switch (position) {
            case 'top':
                return 'items-start mt-16';
            case 'right':
                return 'items-center justify-end';
            case 'bottom':
                return 'items-end mb-16';
            case 'left':
                return 'items-center justify-start';
            case 'center':
            default:
                return 'items-center justify-center';
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex ${getPositionClasses()} ${bgColor} p-4 transition-all duration-300`}
            onClick={closeOnClickOutside ? onClose : undefined}
        >
            <div
                className={`${width} relative rounded-lg ${popupBGColor} bg-opacity-10 p-6 shadow-xl transition-all duration-300`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-semibold">
                            {title}
                        </h3>
                        {showCloseButton && (
                            <button
                                type="button"
                                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                <span className="sr-only">Close</span>
                            </button>
                        )}
                    </div>
                )}
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Popup;