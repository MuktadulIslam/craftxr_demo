import React, { useState, KeyboardEvent, ChangeEvent } from 'react';

interface CharacterCounterInputProps {
    id?: string;
    name?: string;
    type?: React.HTMLInputTypeAttribute;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void; // Changed from KeyboardEvent to ChangeEvent
    onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    placeholder?: string;
    maxLength: number;
    fontSize?: number;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function CharacterCounterInput({
    id,
    name,
    type = 'text',
    value,
    onChange,
    onKeyPress,
    className = '',
    placeholder = 'Enter text',
    maxLength = 50,
    fontSize = 16,
    onBlur,
    onFocus,
}: CharacterCounterInputProps) {

    const [text, setText] = useState('');

    return (
        <div className="w-full h-auto flex flex-col gap-0">
            <input
                {...id ? { id } : {}}
                {...name ? { name } : {}}
                type={type}
                value={value}
                onChange={(event) => { // Fixed typo 'enent' to 'event'
                    onChange(event);
                    if (event.target.value.length <= maxLength) {
                        setText(event.target.value);
                    }
                }}
                maxLength={maxLength}
                onKeyPress={onKeyPress}
                className={className.length != 0 ? className : 'w-full h-10 px-3 border border-gray-300'}
                style={{ fontSize: `${fontSize}px` }}
                placeholder={placeholder}
                onBlur={onBlur}
                onFocus={onFocus}
            />
            <div
                className="w-full h-auto px-1 flex justify-end"
                style={{ fontSize: `${fontSize-3}px` }}
            >
                <div className="text-gray-600">
                    {text.length}
                    <span className="px-0.5 inline-block">/</span>
                    {maxLength}
                </div>
            </div>
        </div>
    );
};