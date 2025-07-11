"use client"
import { useGenerateAccessToken } from '@/lib/hooks/authHook';
import { useGetInstitutes } from '@/lib/hooks/instituteServiceHook';
import { Institute } from '@/types/instituteService';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from 'next/navigation';

interface TokenFormData {
    institute: string;
    max_users: number;
}

export default function AccessTokenGeneration() {
    const { user } = useSelector((state: RootState) => state.user);
    const router = useRouter();
    useEffect(() => {
        if (user?.username != 'testuser') {
            // Clear all route history and redirect to login
            window.history.replaceState(null, '', '/');
            router.replace('/');
        }
    }, [user, router]);


    const { data: institutesData, isLoading: isLoadingInstitutesData } = useGetInstitutes();
    const generateTokenMutation = useGenerateAccessToken();
    const [generatedToken, setGeneratedToken] = useState<string>("");
    const [signupUrl, setSignupUrl] = useState<string>("");
    const [copySuccess, setCopySuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<TokenFormData>({
        defaultValues: {
            institute: "",
            max_users: 1
        }
    });

    const instituteValue = watch("institute");

    const generateToken = async (data: TokenFormData) => {
        try {
            const result = await generateTokenMutation.mutateAsync({
                institute: data.institute,
                max_users: data.max_users
            });
            setGeneratedToken(result.invitation_code);
            setSignupUrl(`https://portal.craftxr.io/accounts/signup?invite=${result.invitation_code}`);
        } catch (error) {
            console.error('Error generating token:', error);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(signupUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleReset = () => {
        reset();
        setGeneratedToken("");
        setSignupUrl("");
        setCopySuccess(false);
        generateTokenMutation.reset();
    };

    return (
        <div className="w-full h-full max-w-container overflow-hidden mx-auto bg-background-color p-10">
            <div className="bg-gray-100 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Generate Access Token
                </h1>
                <p className="text-gray-600 mb-8">
                    Create an access token to allow new users to sign up for your institute.
                </p>

                <form onSubmit={handleSubmit(generateToken)} className="space-y-6">
                    {/* Institute Selection */}
                    <div>
                        <label htmlFor="institute" className="block text-lg font-semibold text-gray-700 mb-2">
                            Select Institute <span className="text-red-600">*</span>
                        </label>
                        <select
                            id="institute"
                            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${errors.institute
                                ? 'border-red-500 focus:ring-red-400'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            {...register("institute", {
                                required: "Please select an institute"
                            })}
                            disabled={generateTokenMutation.isPending}
                        >
                            {isLoadingInstitutesData ? (
                                <option value="">Loading Available Institutes...</option>
                            ) : (
                                <option value="">Select an Institute</option>
                            )}
                            {institutesData?.map((institute: Institute, index: number) => (
                                <option key={index} value={institute.institute_alias}>
                                    {institute.institute_name} ({institute.institute_alias})
                                </option>
                            ))}
                        </select>
                        {errors.institute && (
                            <p className="mt-2 text-sm text-red-600">{errors.institute.message}</p>
                        )}
                    </div>

                    {/* Max Users Input */}
                    <div>
                        <label htmlFor="max_users" className="block text-lg font-semibold text-gray-700 mb-2">
                            Maximum Users <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            id="max_users"
                            min="1"
                            max="100"
                            placeholder="Enter maximum number of users"
                            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${errors.max_users
                                ? 'border-red-500 focus:ring-red-400'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            {...register("max_users", {
                                required: "Maximum users is required",
                                min: {
                                    value: 1,
                                    message: "Minimum 1 user is required"
                                },
                                max: {
                                    value: 100,
                                    message: "Maximum 100 users allowed"
                                }
                            })}
                            disabled={generateTokenMutation.isPending}
                        />
                        {errors.max_users && (
                            <p className="mt-2 text-sm text-red-600">{errors.max_users.message}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            Specify how many users can sign up using this token
                        </p>
                    </div>

                    {/* API Error Display */}
                    {generateTokenMutation.isError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-700 text-sm">
                                {generateTokenMutation.error instanceof Error
                                    ? generateTokenMutation.error.message
                                    : 'Failed to generate token'}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
                            disabled={generateTokenMutation.isPending}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={generateTokenMutation.isPending || !instituteValue}
                        >
                            {generateTokenMutation.isPending ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Token...
                                </span>
                            ) : (
                                'Generate Access Token'
                            )}
                        </button>
                    </div>
                </form>

                {/* Generated Token Display */}
                {signupUrl && (
                    <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-md">
                        <h3 className="text-lg font-semibold text-green-800 mb-4">
                            ✅ Access Token Generated Successfully!
                        </h3>

                        <div className="space-y-6">
                            {/* Signup URL */}
                            <div>
                                <label className="block text-sm font-medium text-green-700 mb-2">
                                    Signup URL (Share this with users):
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={signupUrl}
                                        readOnly
                                        className="flex-1 px-4 py-2 bg-white border border-green-300 rounded-md text-sm text-gray-800 focus:outline-none"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${copySuccess
                                            ? 'bg-green-600 text-white'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                    >
                                        {copySuccess ? 'Copied!' : 'Copy URL'}
                                    </button>
                                </div>
                            </div>

                            {/* Raw Token (Collapsible) */}
                            <details className="group">
                                <summary className="cursor-pointer text-sm font-medium text-green-700 hover:text-green-800 select-none">
                                    ▶ Show Raw Token (Advanced)
                                </summary>
                                <div className="mt-3 pl-4">
                                    <label className="block text-sm font-medium text-green-700 mb-2">
                                        Raw Invitation Token:
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={generatedToken}
                                            readOnly
                                            className="flex-1 px-4 py-2 bg-white border border-green-300 rounded-md text-sm font-mono text-gray-800 focus:outline-none"
                                        />
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await navigator.clipboard.writeText(generatedToken);
                                                    setCopySuccess(true);
                                                    setTimeout(() => setCopySuccess(false), 2000);
                                                } catch (err) {
                                                    console.error('Failed to copy: ', err);
                                                }
                                            }}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Copy Token
                                        </button>
                                    </div>
                                </div>
                            </details>

                            <div className="text-sm text-green-700">
                                <p className="font-medium">Instructions:</p>
                                <ul className="mt-2 space-y-1 list-disc list-inside">
                                    <li>Share the signup URL above with users who need to create accounts</li>
                                    <li>Users can simply click the link and it will take them to the signup page</li>
                                    <li>This link allows up to {watch("max_users")} users to create accounts</li>
                                    <li>Keep this link secure and only share with authorized users</li>
                                    <li>The link has an expiration date for security purposes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}