"use client"
import { ImFacebook2 } from "react-icons/im";
import { IoLogoYoutube } from "react-icons/io5";
import { GrInstagram } from "react-icons/gr";
import { RxLinkedinLogo } from "react-icons/rx";
import { IoLanguageSharp } from "react-icons/io5";
import ThemeToggle from "@/components/buttons/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { useLogout } from "@/lib/hooks/authHook";
import { BiLoaderAlt } from "react-icons/bi"; // Import loader icon
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { clearUser } from "@/lib/redux/features/auth/authSlice";

const iconStyle = {
    width: '50%',
    height: '50%',
    fill: 'currentColor',
    stroke: 'currentColor',
}


export default function DashboardNav() {
    const { mutate: logout, isPending: loading } = useLogout();
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        logout();
        dispatch(clearUser());
    };

    return (<>
        <nav className="w-full h-32 bg-navbar-color py-1 px-4">
            <div className="max-w-container overflow-hidden mx-auto">
                <div className="w-full h-12 flex flex-row justify-between border-b border-white">
                    {/* start:::Icons */}
                    <div className="w-auto h-full flex gap-3 overflow-hidden">
                        <div className="h-full aspect-square flex justify-center items-center">
                            <GrInstagram style={iconStyle} />
                        </div>
                        <div className="h-full aspect-square flex justify-center items-center">
                            <ImFacebook2 style={iconStyle} />
                        </div>
                        <div className="h-full aspect-square flex justify-center items-center">
                            <RxLinkedinLogo style={iconStyle} />
                        </div>
                        <div className="h-full aspect-square flex justify-center items-center">
                            <IoLogoYoutube style={iconStyle} />
                        </div>
                    </div>
                    {/* end:::Icons */}
                    {/* start::: Contact, language, theme */}
                    <div className="h-full flex-1 flex justify-end items-center gap-3">
                        <button className="h-full aspect-square flex justify-center items-center">
                            <IoLanguageSharp style={iconStyle} />
                        </button>
                        <div className="h-full aspect-square flex justify-center items-center">
                            <ThemeToggle className="h-full aspect-square" />
                        </div>
                        <button className="h-5/6 w-38 rounded-md bg-[#7cfce7] flex justify-center items-center">
                            Contact Us
                        </button>
                    </div>
                    {/* end::: Contact, language, theme */}
                </div>

                <div className="w-full h-20 flex justify-between items-center gap-4">
                    <div className="h-2/3 w-auto">
                        <Image src="/logo/craftxr.png"
                            alt=""
                            width={400}
                            height={650}
                            className='bg-transparent h-full w-auto object-contain' />
                    </div>

                    <div className="flex-1 h-full flex justify-center items-center gap-10 font-poppins text-xl *:text-gray-100">
                        <Link href={"/"} className="">Home</Link>
                        <Link href={"/programs"} className="">Programe</Link>
                        <Link href={"/simulations"} className="">Simulation</Link>
                        <Link href={"/evaluations"} className="">Evaluation</Link>
                        {user?.username == 'testuser' && <Link href={"/generate_access_tokens"} className="">New User</Link>}
                    </div>

                    <div className="h-full w-auto flex justify-center items-center gap-10">
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="text-lg flex items-center justify-end gap-2 w-38 transition-all"
                        >
                            {loading ? (
                                <>
                                    <BiLoaderAlt className="animate-spin" />
                                    <span>Logging out...</span>
                                </>
                            ) : (
                                "Logout"
                            )}
                        </button>
                        <Link href={"profile"} className="w-auto h-full flex justify-end items-center gap-2 text-lg text-profiletext-color hover:underline">
                            {user ? (
                                <>
                                    <p>{user.first_name}</p>
                                    <div className="h-1/2 aspect-square">
                                        <Image src={user?.profile_picture}
                                            alt=""
                                            width={100}
                                            height={100}
                                            className='bg-transparent w-full h-full rounded-full object-contain'
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="w-28 h-10 bg-[#8bbcb9] rounded animate-pulse"></div>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    </>)
}