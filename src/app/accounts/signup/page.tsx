'use client'

import SignupForm from "@/components/auth/SignupForm"
import { useSignUp } from "@/lib/hooks/authHook";
import { SignUpCredentials, UserSignUpFormData } from "@/types/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from "react-hook-form"

// Separate component that uses useSearchParams
function SignUpContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const invitationToken = searchParams.get('invite');
    const signUpMutation = useSignUp();
    const {
        register,
        formState: { errors },
        watch,
        setValue,
        handleSubmit
    } = useForm<UserSignUpFormData>({
        defaultValues: {
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            profile_picture: '',
            designation: '',
            department_name: '',
            confirm_password: ''
        },
        mode: 'onChange'
    });

    useEffect(() => {
        if (invitationToken === '' || invitationToken === null || invitationToken === undefined) {
            // Clear all route history and redirect to login
            window.history.replaceState(null, '', '/accounts/login');
            router.replace('/accounts/login');
        }
    }, [invitationToken, router]);

    const onSubmit = async (data: UserSignUpFormData) => {
        const { confirm_password, ...signUpData } = data;
        console.log('Form submitted:', signUpData);

        signUpMutation.mutate({
            credentials: signUpData as SignUpCredentials,
            invitationToken: invitationToken ?? ''
        });
    };

    return (
        <>
            <div className="w-full h-full flex justify-center items-center">
                {/* Success Popup */}
                {signUpMutation.isSuccess && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
                            <div className="text-center">
                                <div className="text-green-500 text-5xl mb-4">✓</div>
                                <h2 className="text-2xl font-bold mb-4">Account Created Successfully!</h2>
                                <p className="mb-6">Welcome {watch().first_name}! Your account has been created.</p>
                                <div className="flex justify-center">
                                    <Link href="/accounts/login"
                                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        Go to Login Page
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
                    <div className="w-full h-auto flex flex-col justify-center">
                        <Image src="/logo/craftxr_dark.png"
                            alt=""
                            width={400}
                            height={650}
                            className='bg-transparent h-16 w-auto object-contain'
                        />
                        <h2 className="text-xl font-semibold mb-6 text-center">Create an Account</h2>
                    </div>
                    <SignupForm
                        handleSubmit={handleSubmit(onSubmit)}
                        register={register}
                        errors={errors}
                        watch={watch}
                        loading={signUpMutation.isPending}
                        setValue={setValue}
                    />
                </div>
            </div>
        </>
    );
}

// Loading fallback component
function SignUpLoading() {
    return (
        <div className="max-w-container h-full mx-auto bg-background-color border border-gray-300 rounded-md w-full">
            <div className="w-full h-full flex justify-center items-center">
                <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
                    <div className="w-full h-auto flex flex-col justify-center">
                        <div className="h-16 bg-gray-200 animate-pulse rounded mb-6"></div>
                        <h2 className="text-xl font-semibold mb-6 text-center">Create an Account</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<SignUpLoading />}>
            <SignUpContent />
        </Suspense>
    );
}