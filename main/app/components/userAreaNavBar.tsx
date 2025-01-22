'use client';

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/libs/redux-service/store";
import Image from "next/image";
import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";
import { ImCog } from "react-icons/im";
import { IoChatboxEllipses } from "react-icons/io5";
import { AiOutlineTrophy } from "react-icons/ai";
import { usePathname, useParams } from "next/navigation";
import { close_user_area_menu } from "@/app/libs/redux-service/slices/user-area/userAreaMenuToggleSlice";
import { useEffect, useState } from "react";

export default function UserAreaNavBar() {

    const dispatch = useDispatch();
    const pathName = usePathname();
    const params = useParams<{ user_id: string[] }>();
    const user_id = params.user_id[0];

    const isMenuOpen = useSelector((state: RootState) => state.user_area_menu_toggle.is_user_area_menu_open);
    const [nameLetter, setNameLetter] = useState<string>('');
    const [profilePict, setProfilePict] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const settingRoutes: string[] = [`/user/settings/${user_id}`, `/user/settings/password/${user_id}`, `/user/settings/phone/${user_id}`, `/user/settings/profle-photo/${user_id}`];

    const getUser = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/auth-user/get-single-user`, {
            method: 'POST',
            body: JSON.stringify({ user_id }),
        });
        const body = await resp.json();
        if (body.success) {
            setNameLetter(body.user.user_full_name.charAt(0));
            setProfilePict(body.user.user_photo);
            setUserName(body.user.user_full_name);
        }
    }

    useEffect(() => {
        getUser();
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="hidden fixed top-0 left-0 w-full h-full z-[20] bg-black opacity-[0.4]"></div>
            <div className={`transition-all delay-75 min-w-[265px] lg:min-w-[300px] fixed top-0 lg:relative lg:left-0 lg:top-0 h-screen lg:h-auto bg-white border-r border-solid border-zinc-300 dark:bg-zinc-950 dark:border-zinc-700 ${isMenuOpen ? 'left-0' : 'left-[-100%]'}`}>
                <div className="flex flex-col max-h-screen min-h-screen overflow-y-auto lg:fixed lg:left-0 lg:top-0 lg:w-full lg:max-w-[300px]">
                    <div>
                        <div className="pt-[25px] md:pt-[40px] px-[15px] w-full">
                            <div className="pb-[5px] text-center">
                                <div className="concard p-[2px] md:p-[3px] inline-block rounded-full">
                                    <div className="transition-all delay-75 w-[70px] h-[70px] md:w-[100px] md:h-[100px] relative flex items-center justify-center border-[4px] border-solid border-white bg-zinc-200 rounded-full dark:bg-zinc-800 dark:border-zinc-950 font-ubuntu text-[30px] md:text-[40px] text-zinc-800 dark:text-zinc-300">
                                        <span className="uppercase">{nameLetter}</span>
                                        {profilePict && (<Image src={profilePict} width={100} height={100} className="absolute left-0 top-0 z-[2] w-full h-full rounded-full" alt="photo" priority={true} />)}
                                    </div>
                                </div>
                            </div>

                            <div className="pb-[15px] text-center">
                                {/* <h1 className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] font-semibold text-zinc-400">
                                    @amitThakur224
                                </h1> */}
                                <h2 className="transition-all delay-75 font-noto_sans text-[18px] md:text-[20px] font-bold text-zinc-800 dark:text-zinc-300">
                                    {userName}
                                </h2>
                            </div>
                        </div>
                        <div className="pb-[15px] w-full">
                            <ul className="flex flex-col user-area-nav">
                                <li className="w-full">
                                    <Link
                                        href={`/user/${user_id}`}
                                        title="Profile"
                                        className={`transition-all delay-75 py-[10px] md:py-[15px] block px-[15px] border-l-[4px] border-solid border-transparent font-noto_sans font-semibold text-[16px] md:text-[18px] text-zinc-800 hover:bg-zinc-100 hover:border-theme-color-2 dark:text-zinc-400 dark:hover:bg-zinc-900 ${pathName === '/user/' + user_id ? 'active' : ''}`}
                                        onClick={() => dispatch(close_user_area_menu())}
                                    >
                                        <div className="flex gap-x-[10px] items-center">
                                            <FaRegUserCircle size={23} />
                                            <div>
                                                Profile
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        href={`/user/my-winnings/${user_id}`}
                                        title="My Winnings"
                                        className={`transition-all delay-75 py-[10px] md:py-[15px] block px-[15px] border-l-[4px] border-solid border-transparent font-noto_sans font-semibold text-[16px] md:text-[18px] text-zinc-800 hover:bg-zinc-100 hover:border-theme-color-2 dark:text-zinc-400 dark:hover:bg-zinc-900 ${pathName === '/user/my-winnings/' + user_id ? 'active' : ''}`}
                                        onClick={() => dispatch(close_user_area_menu())}
                                    >
                                        <div className="flex gap-x-[10px] items-center">
                                            <AiOutlineTrophy size={23} />
                                            <div>
                                                My Winnings
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        href={`/user/my-participation/${user_id}`}
                                        title="My Participation"
                                        className={`transition-all delay-75 py-[10px] md:py-[15px] block px-[15px] border-l-[4px] border-solid border-transparent font-noto_sans font-semibold text-[16px] md:text-[18px] text-zinc-800 hover:bg-zinc-100 hover:border-theme-color-2 dark:text-zinc-400 dark:hover:bg-zinc-900 ${pathName === '/user/my-participation/' + user_id ? 'active' : ''}`}
                                        onClick={() => dispatch(close_user_area_menu())}
                                    >
                                        <div className="flex gap-x-[10px] items-center">
                                            <IoChatboxEllipses size={23} />
                                            <div>
                                                My Participation
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        href={`/user/settings/${user_id}`}
                                        title="Settings"
                                        className={`transition-all delay-75 py-[10px] md:py-[15px] block px-[15px] border-l-[4px] border-solid border-transparent font-noto_sans font-semibold text-[16px] md:text-[18px] text-zinc-800 hover:bg-zinc-100 hover:border-theme-color-2 dark:text-zinc-400 dark:hover:bg-zinc-900 ${settingRoutes.includes(pathName) ? 'active' : ''}`}
                                        onClick={() => dispatch(close_user_area_menu())}
                                    >
                                        <div className="flex gap-x-[10px] items-center">
                                            <ImCog size={23} />
                                            <div>
                                                Settings
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-auto w-full">
                        <div className="pb-[10px] w-full">
                            <ul className="flex flex-col w-full">
                                <li className="w-full">
                                    <Link
                                        href={`/logout`}
                                        title="Logout"
                                        className={`transition-all delay-75 py-[10px] md:py-[15px] block w-full px-[15px] border-l-[4px] border-solid border-transparent font-noto_sans font-semibold text-[16px] md:text-[18px] text-red-600 hover:bg-zinc-100 hover:border-red-600 dark:text-red-600 dark:hover:bg-zinc-900`}
                                        onClick={() => dispatch(close_user_area_menu())}
                                    >
                                        <div className="flex gap-x-[10px] items-center">
                                            <FaPowerOff size={25} />
                                            <div>
                                                Logout
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="pb-[10px] text-center">
                            <p className="transition-all delay-75 font-noto_sans text-[12px] inline-block text-zinc-600 dark:text-zinc-500">
                                &copy; {new Date().getFullYear()} All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}