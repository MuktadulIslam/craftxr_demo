import LoginForm from '@/components/auth/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <div className="w-full h-full bg-[url('/banner/background.png')] bg-cover bg-center flex justify-center items-center">
            <div className="w-[550px] h-auto p-5 rounded-3xl  backdrop-blur-sm">
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}