'use client';

import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";


const ProfileCard = () => {
    const {user} = useSelector((state: RootState)=>state.user);

    if (!user) {
        return (
            <div className="bg-white shadow rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">User Profile</h3>
            <div className="mt-4">
                <div className="flex items-center space-x-2 mb-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="text-sm text-gray-900">{user.first_name} {user.last_name}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                    <div className="bg-green-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Username</p>
                        <p className="text-sm text-gray-900">{user.username}</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;