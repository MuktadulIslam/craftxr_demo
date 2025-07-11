"use client"
import { useGetDepartments } from '@/lib/hooks/instituteServiceHook';
import { UserSignUpFormData } from '@/types/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useForm, UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { config as AppConfig } from '@/config';

interface SignupFormProps {
    handleSubmit: () => void;
    register: UseFormRegister<UserSignUpFormData>,
    errors: FieldErrors<UserSignUpFormData>,
    watch: UseFormWatch<UserSignUpFormData>,
    setValue: UseFormSetValue<UserSignUpFormData>, // Add this prop
    loading: boolean
}

export default function SignupForm({ handleSubmit, register, errors, watch, setValue, loading }: SignupFormProps) {
    const [termsAgreed, setTermsAgreed] = useState(false);
    const { data: departments, isLoading: isDepartmentsLoading } = useGetDepartments();

    // Department search functionality
    const [departmentInput, setDepartmentInput] = useState("");
    const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isNewDepartment, setIsNewDepartment] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Effect to handle filtering departments based on input
    useEffect(() => {
        if (departmentInput.trim() === "") {
            setFilteredDepartments([]);
            setIsNewDepartment(false);
            return;
        }

        if (departments) {
            const filtered = departments.filter(dept => 
                dept.department_name.toLowerCase().includes(departmentInput.toLowerCase())
            );
            
            setFilteredDepartments(filtered);
            setIsNewDepartment(filtered.length === 0);
        }
    }, [departmentInput, departments]);

    // Effect to handle clicks outside the dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDepartmentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDepartmentInput(value);
        // Update the form value using setValue
        setValue("department_name", value, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true 
        });
        setShowDropdown(true);
    };

    const handleDepartmentSelect = (departmentName: string) => {
        setDepartmentInput(departmentName);
        // Update the form value using setValue
        setValue("department_name", departmentName, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true 
        });
        setShowDropdown(false);
        setIsNewDepartment(false);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
            <div className="w-full h-auto grid grid-cols-2 gap-y-2 gap-x-5">
                {/* Username */}
                <div>
                    <label className="block text-base font-medium text-gray-700">
                        Username <span className='text-red-500'>*</span>
                    </label>
                    <input
                        type="text"
                        className={`h-9 block w-full rounded-md shadow-sm p-2 border
                        ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        {...register("username", {
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message: "Username must be at least 3 characters"
                            }
                        })}
                    />
                    {errors.username && (
                        <p className="text-sm text-red-500">{errors.username.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-base font-medium text-gray-700">
                        Email <span className='text-red-500'>*</span>
                    </label>
                    <input
                        type="email"
                        className={`h-9 block w-full rounded-md shadow-sm p-2 border
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Email address is invalid"
                            }
                        })}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* First Name */}
                <div>
                    <label className="block text-base font-medium text-gray-700">
                        First Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                        type="text"
                        className={`h-9 block w-full rounded-md shadow-sm p-2 border
                        ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                        {...register("first_name", {
                            required: "First Name is required",
                            minLength: {
                                value: 3,
                                message: "First Name must be at least 3 characters"
                            }
                        })}
                    />
                    {errors.first_name && (
                        <p className="text-sm text-red-500">{errors.first_name.message}</p>
                    )}
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-base font-medium text-gray-700">
                        Last Name
                    </label>
                    <input
                        type="text"
                        className={`h-9 block w-full rounded-md shadow-sm p-2 border border-gray-300`}
                        {...register("last_name")}
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-base font-medium text-gray-700">
                        Password <span className='text-red-500'>*</span>
                    </label>
                    <input
                        type="password"
                        className={`h-9 block w-full rounded-md shadow-sm p-2 border
                        ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 3,
                                message: "Password must be at least 3 characters"
                            }
                        })}
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-base font-medium text-gray-700">
                        Confirm Password <span className='text-red-500'>*</span>
                    </label>
                    <input
                        type="password"
                        className={`h-9 block w-full rounded-md shadow-sm p-2 border
                        ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'}`}
                        {...register("confirm_password", {
                            required: "Please confirm your password",
                            validate: (value) =>
                                value === watch("password") || "Passwords do not match"
                        })}
                    />
                    {errors.confirm_password && (
                        <p className="text-sm text-red-500">{errors.confirm_password.message}</p>
                    )}
                </div>

                {/* Designation */}
                <div>
                    <label className="block text-base font-medium text-gray-700">
                        Designation <span className='text-red-500'>*</span>
                    </label>
                    <input
                        type="text"
                        className={`h-9 block w-full rounded-md shadow-sm p-2 border
                        ${errors.designation ? 'border-red-500' : 'border-gray-300'}`}
                        {...register("designation", {
                            required: "Designation is required"
                        })}
                    />
                    {errors.designation && (
                        <p className="text-sm text-red-500">{errors.designation.message}</p>
                    )}
                </div>

                {/* Department Input with Search */}
                <div>
                    <label className="block text-base font-medium text-gray-700">
                        Department <span className='text-red-500'>*</span>
                    </label>
                    <div className="relative" ref={dropdownRef}>
                        <input
                            type="text"
                            className={`h-9 block w-full rounded-md shadow-sm p-2 border
                            ${errors.department_name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Type to search or create department"
                            value={departmentInput}
                            onChange={handleDepartmentInputChange}
                            onFocus={() => departmentInput.trim() !== "" && setShowDropdown(true)}
                        />

                        {/* Department dropdown for search results */}
                        {showDropdown && departmentInput.trim() !== "" && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                                {isDepartmentsLoading ? (
                                    <div className="px-4 py-2 text-gray-500">Loading departments...</div>
                                ) : filteredDepartments.length > 0 ? (
                                    filteredDepartments.map((dept, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleDepartmentSelect(dept.department_name)}
                                        >
                                            {dept.department_name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500">
                                        <span className="font-medium text-blue-600">{`"${departmentInput}"`}</span> will be created as a new department
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {isNewDepartment && departmentInput.trim() !== "" && !showDropdown && (
                        <p className="text-xs text-blue-600 mt-1">
                            {`You are creating a new department: "${departmentInput}"`}
                        </p>
                    )}

                    
                    {/* Register the field without a hidden input */}
                        <input
                            type="hidden"
                            {...register("department_name", {
                                required: "Department is required"
                            })}
                            value={departmentInput}
                        />
                    {errors.department_name && (
                        <p className="text-sm text-red-500">{errors.department_name.message}</p>
                    )}
                </div>
            </div>
            
            {/* Profile Picture Selection */}
            <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                    Profile Picture <span className='text-red-500'>*</span>
                </label>

                {/* Avatar Grid */}
                <div className="mb-3 px-10">
                    <div className="grid grid-cols-6 gap-3 border p-2">
                        {Array.from({ length: 12 }).map((_, index) => {
                            const image_url = `https://image-storage-snowy.vercel.app/avatar_images/profile${index + 1}.png`;
                            const inputId = `new-user-avatar-profile-image-${index}`;
                            return (
                                <div
                                    key={`avatar-profile-${index}`}
                                    className={`w-full aspect-square cursor-pointer rounded-full border-2 overflow-hidden ${watch("profile_picture") === image_url
                                        ? 'border-blue-600 border-4'
                                        : 'border-gray-400'
                                        } hover:border-blue-300 transition-colors`}
                                >
                                    <input
                                        type="radio"
                                        id={inputId}
                                        value={image_url}
                                        className="hidden"
                                        {...register("profile_picture", {
                                            required: "Please select a profile picture"
                                        })}
                                    />
                                    <label htmlFor={inputId}>
                                        <Image
                                            width={100}
                                            height={100}
                                            src={image_url}
                                            alt={`Avatar ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {errors.profile_picture && (
                    <p className="text-sm text-red-500">{errors.profile_picture.message}</p>
                )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={termsAgreed}
                    onChange={() => setTermsAgreed(!termsAgreed)}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <span className="text-blue-600 cursor-pointer">Terms and Conditions</span>
                </label>
            </div>

            {/* Submit Button */}
            <div>
                <button
                    type="submit"
                    disabled={!termsAgreed || loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
        ${termsAgreed && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center text-sm">
                Already have an account?
                <Link href="/accounts/login">
                    <span className="text-blue-600 ml-1 cursor-pointer">Sign In</span>
                </Link>
            </div>
        </form>
    );
}