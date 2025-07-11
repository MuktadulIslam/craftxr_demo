"use client"
import ProfileCard from "@/components/dashboard/ProfileCard";

export default function Page() {
    return (<>
        <div className="max-w-container mx-auto bg-background-color py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Welcome to your dashboard. Here you can view your profile and manage your account.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <ProfileCard />

                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                        <p className="mt-4 text-sm text-gray-500">No recent activity to display.</p>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
                        <p className="mt-4 text-sm text-gray-500">No stats available yet.</p>
                    </div>
                </div>
            </div>
        </div>
    </>)
}