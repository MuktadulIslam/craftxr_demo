'use client'
import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";

interface CharacterCounterFormInputProps {
    name?: string;
    type: React.HTMLInputTypeAttribute;
    formFieldName: string;
    maxLength: number;
    id?: string;
    placeholder?: string;
    required?: boolean;
    requiredMessage?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    register: UseFormRegister<any>;
    errors?: FieldErrors<any>;
    watch: UseFormWatch<any>;
    fontSize?: number;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function CharacterCounterFormInput({
    name,
    type,
    id,
    formFieldName,
    maxLength = 50,
    placeholder = "",
    required = false,
    requiredMessage = "This field is required",
    onChange,
    className = "",
    inputProps = {},
    register,
    errors,
    watch,
    fontSize = 16,
    onBlur,
    onFocus,
}: CharacterCounterFormInputProps) {
    return (
        <div className="flex flex-col gap-0">
            <input
                {...id ? { id } : {}}
                {...name ? { name } : {}}
                type={type}
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
                {...inputProps}
            />

            <div
                className="w-full h-auto px-1 flex justify-between"
                style={{ fontSize: `${fontSize - 3}px` }}
            >
                <p className="text-red-600">{errors && errors[formFieldName]?.message as string}</p>
                <div className=" text-gray-600"> {watch(formFieldName)?.length || 0}
                    <span className="px-0.5 inline-block">/</span>
                    {maxLength}</div>
            </div>
        </div>
    );
}