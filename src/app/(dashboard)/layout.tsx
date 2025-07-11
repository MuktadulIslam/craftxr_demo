import DashboardNav from "@/components/dashboard/DashboardNav";
import UserDataLoader from "./UserDataLoader";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>
        <div className="w-full h-full flex flex-col overflow-y-auto overflow-x-hidden">
            <UserDataLoader />        {/* To get user information in reload */}
            <DashboardNav />
            <div className="w-full flex-1">
                {children}
            </div>
        </div>
    </>);
}