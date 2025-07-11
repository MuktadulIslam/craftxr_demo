import React from 'react';

interface CircularProgressProps {
    currentValue: number;
    maxValue: number;
    text?: string;
    size?: number;
    strokeWidth?: number;
    backgroundColor?: string;
    textClassName?: string;
}

export default function CircularProgress({
    currentValue,
    maxValue,
    text,
    size = 120,
    strokeWidth = 8,
    backgroundColor = "text-gray-200",
    textClassName = "text-base font-semibold"
}: CircularProgressProps) {
    // Calculate the radius and circumference
    const progress = (currentValue / maxValue) * 100;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    const textView = text ?? `${currentValue} / ${maxValue}`;

    // Determine color based on progress - divided into five parts
    const getProgressColor = () => {
        if (progress < 20) {
            return "text-[#ff2e2e]"; // Red for very low progress
        } else if (progress < 40) {
            return "text-[#ff5500]"; // Orange for low progress
        } else if (progress < 60) {
            return "text-[#ffff00]"; // Yellow for medium progress
        } else if (progress < 80) {
            return "text-[#bcff00]"; // Lime for good progress
        } else {
            return "text-[#1aff00]"; // Green for excellent progress
        }
    };

    // Set text color based on progress too
    const getTextColorClass = () => {
        if (progress < 20) {
            return "text-[#ff2e2e]"; // Red for very low progress
        } else if (progress < 40) {
            return "text-[#ff5500]"; // Orange for low progress
        } else if (progress < 60) {
            return "text-[#ffff00]"; // Yellow for medium progress
        } else if (progress < 80) {
            return "text-[#bcff00]"; // Lime for good progress
        } else {
            return "text-[#1aff00]"; // Green for excellent progress
        }
    };

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background circle */}
            <svg className="absolute" width={size} height={size}>
                <circle
                    className={backgroundColor}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress circle */}
                <circle
                    className={getProgressColor()}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            {/* Text in center */}
            <div className={`${textClassName} ${getTextColorClass()}`}>
                {textView}
            </div>
        </div>
    );
};