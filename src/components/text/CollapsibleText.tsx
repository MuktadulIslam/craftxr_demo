"use client"

import { useState } from "react";

interface CollapsibleText {
    text: string | undefined;
    maxTextLength?: number;
}

export const CollapsibleText = ({ text='',maxTextLength=65 }: CollapsibleText) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    // Display truncated text with "See more" at the end if not expanded
    if (!expanded && text && text.length > maxTextLength) {
        const truncatedLength = maxTextLength+5; // Adjust this value as needed
        const truncatedText = text.substring(0, truncatedLength);

        return (
            <div className="inline">
                {truncatedText}
                {truncatedText.length < text.length && (
                    <>
                        ...
                        <button
                            onClick={toggleExpanded}
                            className="text-blue-600 hover:text-blue-800 font-medium ml-1"
                        >
                            see more
                        </button>
                    </>
                )}
            </div>
        );
    }
    // Display full text with "See less" at the end if expanded
    return (
        <div className="inline">
            {text}
            {text && text.length > maxTextLength && (
                <button
                    onClick={toggleExpanded}
                    className="text-blue-600 hover:text-blue-800 font-medium ml-1"
                >
                    see less
                </button>
            )}
        </div>
    );
};