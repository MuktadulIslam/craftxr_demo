'use client';

import { useState, FormEvent } from 'react';
import { LoginCredentials } from '@/types/auth';
import { useLogin } from '@/lib/hooks/authHook';
import Image from 'next/image';
import { registrationRequestMailToLink } from '@/utils/emailUtils';
import { BiLoaderAlt } from "react-icons/bi"; // Import loader icon

const LoginForm = () => {
    const { mutate: login, isPending: loading } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<LoginCredentials>({
        username: '',
        password: '',
        // username: 'testuser',
        // password: 'craftxr123',
    });
    

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            alert('Username and password are required');
            return;
        }

        try {
            login({
                username: formData.username,
                password: formData.password
            });
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <div className="w-full h-12 flex justify-center items-center">
                <Image src="/logo/craftxr.png"
                    alt=""
                    width={400}
                    height={650}
                    className='bg-transparent h-full w-auto' />
            </div>
            <h1 className='w-full h-10 text-center text-xl text-white mt-3 font-normal'>Login to Your Account</h1>

            <form onSubmit={handleSubmit} className="space-y-4 text-white">
                <div>
                    <label htmlFor="username" className="block mb-1 form-level">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        className="w-full h-10 p-2 border rounded outline-none focus:border-hover-color"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block mb-1 form-level">
                        Password
                    </label>
                    <div className="w-full h-10 relative flex justify-between border rounded focus:border-hover-color">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="h-full flex-1 p-2 outline-none border-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="inset-y-0 right-0 h-full aspect-square flex items-center justify-center text-white"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className='text-xs text-center text-gray-300'>
                    {"By continuing, you agree to CraftXR's"} <u>Consumer Terms</u> and <u>Usage Policy</u>, and acknowledge their <u>Privacy Policy</u>.
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 p-1 flex justify-center items-center gap-1 rounded-md primary"
                >
                    {loading ? <>
                        <BiLoaderAlt className="animate-spin" />
                        <span>Logging in...</span>
                    </> :
                        <span>Login</span>
                    }
                </button>
            </form>

            <div className="text-center text-gray-300 text-sm mt-2">
                {"Don't have an account? "}
                <a href={registrationRequestMailToLink()} className="underline">
                    Contact With Admin
                </a>
            </div>

            <div className='w-full my-4 text-center text-white'>OR</div>
            <button className="w-full h-9 secondary cursor-none my-2 rounded-md flex justify-center items-center text-sm font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50" className='h-4/5'>
                    <path d="M 29 8.53125 C 23.785 8.53125 19.371 11.6525 17.25 16.0625 C 16.121 15.2855 14.81175 14.71875 13.34375 14.71875 C 9.61675 14.71875 6.6445 17.66775 6.4375 21.34375 C 2.7105 22.68875 5.9211895e-16 26.16375 0 30.34375 C 0 35.67175 4.32825 40 9.65625 40 L 41.09375 40 C 45.99975 40 50 35.99975 50 31.09375 C 50 26.54275 46.50775 22.92625 42.09375 22.40625 C 42.10975 22.16425 42.15625 21.9375 42.15625 21.6875 C 42.15625 14.4375 36.25 8.53125 29 8.53125 z M 31.208984 16.255859 L 34.386719 16.523438 L 34.732422 19.769531 L 33.767578 20.736328 L 33.767578 22.234375 L 32.273438 22.234375 L 32.230469 22.277344 L 32.230469 23.744141 L 30.767578 23.744141 L 30.732422 23.779297 L 30.732422 25.242188 L 29.271484 25.242188 L 28.498047 26.019531 C 28.827047 26.811531 29 27.644 29 28.5 C 29 32.084 26.084 35 22.5 35 C 18.916 35 16 32.084 16 28.5 C 16 24.916 18.916 22 22.5 22 C 23.356 22 24.190469 22.171047 24.980469 22.498047 L 31.208984 16.255859 z M 21.5 28 A 1.5 1.5 0 0 0 21.5 31 A 1.5 1.5 0 0 0 21.5 28 z"></path>
                </svg>
                Continue with SSO
            </button>
        </>
    );
};

export default LoginForm;