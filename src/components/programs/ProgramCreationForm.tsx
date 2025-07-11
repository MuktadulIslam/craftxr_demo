"use client"
import { useGetDepartments, useGetInstitutes, useGetSchool } from '@/lib/hooks/instituteServiceHook';
import { Program } from '@/types/programAffiliation';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormReset } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';

interface ProgramCreationFormProps {
    handleSubmit: () => void;
    register: UseFormRegister<Program>,
    errors: FieldErrors<Program>,
    setValue: UseFormSetValue<Program>;
    reset: UseFormReset<Program>;
    watch: UseFormWatch<Program>;
}

export default function ProgramCreationForm({ handleSubmit, register, errors, setValue, reset, watch }: ProgramCreationFormProps) {
    const { data: institutesData, isLoading: isLoadingInstitutesData } = useGetInstitutes();
    const { data: schoolsData, isLoading: isLoadingSchoolsData } = useGetSchool();
    const { data: departmentsData, isLoading: isLoadingDepartmentsData } = useGetDepartments();

    // Get the current values from watch
    const instituteValue = watch("institute.institute_name");
    const schoolValue = watch("school.school_name");
    
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

        if (departmentsData) {
            const filtered = departmentsData.filter(dept => 
                dept.department_name.toLowerCase().includes(departmentInput.toLowerCase())
            );
            
            setFilteredDepartments(filtered);
            setIsNewDepartment(filtered.length === 0);
        }
    }, [departmentInput, departmentsData]);

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

    const handleInstituteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        const selectedInstitute = institutesData?.find(inst => inst.institute_name === selectedName);

        if (selectedInstitute) {
            setValue("institute.institute_name", selectedInstitute.institute_name);
            setValue("institute.institute_alias", selectedInstitute.institute_alias);
        } else {
            setValue("institute.institute_name", "");
            setValue("institute.institute_alias", "");
        }
    };

    const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value
        const selectedSchool = schoolsData?.find(sch => sch.school_name === selectedName);

        if (selectedSchool) {
            setValue("school.school_name", selectedSchool.school_name);
            setValue("school.school_alias", selectedSchool.school_alias);
        } else {
            setValue("school.school_name", "");
            setValue("school.school_alias", "");
        }
    };

    const handleDepartmentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDepartmentInput(e.target.value);
        setValue("department.department_name", e.target.value);
        setShowDropdown(true);
    };

    const handleDepartmentSelect = (departmentName: string) => {
        setDepartmentInput(departmentName);
        setValue("department.department_name", departmentName);
        setShowDropdown(false);
        setIsNewDepartment(false);
    };

    const handleCancel = () => {
        reset(); // This will reset all form values to their defaults
        setDepartmentInput("");
        setFilteredDepartments([]);
        setShowDropdown(false);
        setIsNewDepartment(false);
    };

    return (<>
        <form onSubmit={handleSubmit} className="grid w-md grid-cols-1 gap-3">
            {/* Program Name */}
            <div>
                <label htmlFor="program_name" className="block text-lg font-semibold text-gray-700 mb-1">
                    Program Name <span className="text-red-600">*</span>
                </label>
                <input
                    type="text"
                    id="program_name"
                    placeholder="Enter program name"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${errors.program_name ? 'border-red-600 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-700'}`}
                    {...register("program_name", {
                        required: "Program Name is required",
                        minLength: {
                            value: 3,
                            message: "Program Name must be at least 5 characters"
                        }
                    })}
                />
                {errors.program_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.program_name.message}</p>
                )}
            </div>

            {/* Program Abbreviation */}
            <div>
                <label htmlFor="program_abbr" className="block text-lg font-semibold text-gray-700 mb-1">
                    Program Abbreviation <span className="text-red-600">*</span>
                </label>
                <input
                    type="text"
                    id="program_abbr"
                    placeholder="Enter abbreviation (e.g., CS, ENG)"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${errors.program_abbr ? 'border-red-600 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-700'}`}
                    {...register("program_abbr", {
                        required: "Program Abbreviation is required",
                        minLength: {
                            value: 2,
                            message: "Program Abbreviation must be at least 2 characters"
                        },
                        maxLength:{
                            value: 4,
                            message: "Program Abbreviation must not exceed 4 characters"
                        }
                    })}
                />
                {errors.program_abbr && (
                    <p className="mt-1 text-sm text-red-600">{errors.program_abbr.message}</p>
                )}
            </div>

            {/* Institute Selection */}
            <div>
                <label htmlFor="institute" className="block text-lg font-semibold text-gray-700 mb-1">
                    Institute <span className="text-red-600">*</span>
                </label>

                <select
                    id="institute"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${errors.institute?.institute_name ? 'border-red-600 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-700'}`}
                    onChange={handleInstituteChange}
                    value={instituteValue || ""}
                >
                    {isLoadingInstitutesData ? (
                        <option value="">Loading Available Institutes...</option>
                    ) : (
                        <option value="" disabled>Select an Institute</option>
                    )}
                    {institutesData?.map((institute, index) => (
                        <option key={index} value={institute.institute_name}>
                            {institute.institute_name} ({institute.institute_alias})
                        </option>
                    ))}
                </select>
                <input type="hidden" {...register("institute.institute_name", { required: "Institute is required" })} />
                <input type="hidden" {...register("institute.institute_alias")} />

                {errors.institute?.institute_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.institute.institute_name.message}</p>
                )}
            </div>

            {/* School Selection */}
            <div>
                <label htmlFor="school" className="block text-lg font-semibold text-gray-700 mb-1">
                    School <span className="text-red-600">*</span>
                </label>
                <select
                    id="school"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${errors.school?.school_name ? 'border-red-600 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-700'}`}
                    onChange={handleSchoolChange}
                    value={schoolValue || ""}
                >
                    {isLoadingSchoolsData ? (
                        <option value="">Loading Available Schools...</option>
                    ) : (
                        <option value="" disabled>Select a School</option>
                    )}
                    {schoolsData?.map((school, index) => (
                        <option key={index} value={school.school_name}>
                            {school.school_name} ({school.school_alias})
                        </option>
                    ))}
                </select>
                <input type="hidden" {...register("school.school_name", { required: "School is required" })} />
                <input type="hidden" {...register("school.school_alias")} />

                {errors.school?.school_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.school.school_name.message}</p>
                )}
            </div>

            {/* Department Input with Search */}
            <div>
                <label htmlFor="department" className="block text-lg font-semibold text-gray-700 mb-1">
                    Department <span className="text-red-600">*</span>
                </label>
                <div className="relative" ref={dropdownRef}>
                    <input
                        type="text"
                        id="department"
                        placeholder="Type department name to search or create new"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${errors.department?.department_name ? 'border-red-600 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-700'}`}
                        value={departmentInput}
                        onChange={handleDepartmentInputChange}
                        onFocus={() => departmentInput.trim() !== "" && setShowDropdown(true)}
                    />
                    <input type="hidden" {...register("department.department_name", { required: "Department is required" })} />

                    {/* Department dropdown for search results */}
                    {showDropdown && departmentInput.trim() !== "" && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {isLoadingDepartmentsData ? (
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
                    <p className="mt-1 text-sm text-blue-600">
                        {`You are creating a new department: "${departmentInput}"`}
                    </p>
                )}

                {errors.department?.department_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.department.department_name.message}</p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Create Program
                </button>
            </div>
        </form>
    </>)
}