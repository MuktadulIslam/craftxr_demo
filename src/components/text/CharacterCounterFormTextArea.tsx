'use client'
import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";

interface CharacterCounterFormTextAreaProps {
    id?: string;
    name?: string;
    formFieldName: string;
    maxLength: number;
    rows?: number;
    placeholder?: string;
    required?: boolean;
    requiredMessage?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    register: UseFormRegister<any>;
    errors?: FieldErrors<any>;
    watch: UseFormWatch<any>;
    fontSize?: number;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export default function CharacterCounterFormTextArea({
    id,
    name,
    formFieldName,
    maxLength = 500,
    rows = 5,
    placeholder = "",
    required = false,
    requiredMessage = "This field is required",
    onChange,
    className = "",
    textareaProps = {},
    register,
    errors,
    watch,
    fontSize = 16,
    onBlur,
    onFocus,
}: CharacterCounterFormTextAreaProps) {


    return (
        <div className="flex flex-col gap-0">
            <textarea
                {...id ? { id } : {}}
                {...name ? { name } : {}}
                rows={rows}
                placeholder={placeholder}
                className={`${errors && errors[formFieldName] ? 'border-red-500' : ''} ${className ? className : 'w-full p-2 border border-gray-700'} `}
                style={{ fontSize: `${fontSize}px` }}
                maxLength={maxLength}
                {...register(formFieldName, {
                    required: required ? requiredMessage : false,
                    maxLength: {
                        value: maxLength,
                        message: `Input field cannot exceed ${maxLength} characters`
                    },
                    onChange: onChange,
                })}
                onBlur={onBlur}
                onFocus={onFocus}
                {...textareaProps}
            ></textarea>

            <div
                className="w-full h-auto px-1 flex justify-between"
                style={{ fontSize: `${fontSize - 3}px` }}
            >
                <p className="text-red-600">{errors && errors[formFieldName]?.message as string}</p>
                <div className="text-gray-600">
                    {watch(formFieldName)?.length || 0}
                    <span className="px-0.5 inline-block">/</span>
                    {maxLength}
                </div>
            </div>
        </div>
    );
}