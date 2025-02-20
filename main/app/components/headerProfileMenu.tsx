'use client';

import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import Image from "next/image";
// import { RootState } from "@/app/libs/redux-service/store";
// import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { getCookie } from "cookies-next/client";
import { siteAuthUserCookieName } from "@/app/constant/datafaker";
import { JWTDec } from "@/app/types/commonTypes";
import { jwtDecode } from "jwt-decode";
import { useGetWebsiteAuthUserInfo } from "@/app/libs/tanstack-query/website/queries/websiteQueries";
import { QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";

export default function HeaderProfileMenu() {

    let fintkn: string = 'null';
    const token = getCookie(siteAuthUserCookieName);
    if (token) {
        fintkn = token;
    } else {
        fintkn = 'null';
    }
    // const AuthUser = useSelector((state: RootState) => state.auth_user_id.auth_user_id);
    const [nameLetter, setNameLetter] = useState<string>('');
    const [profilePict, setProfilePict] = useState<string>("");
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [authUser, setAuthUser] = useState<string>('');

    useEffect(() => {

        const menuHandler = (e: MouseEvent) => {
            if (menuRef.current !== null) {
                if (!menuRef.current.contains(e.target as Node)) {
                    setIsMenuOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', menuHandler);
    }, []);

    const { data, isError, error, isSuccess } = useGetWebsiteAuthUserInfo(fintkn);

    useEffect(() => {
        if (isSuccess) {
            if (data.user) {
                setNameLetter(data.user.user_full_name.charAt(0));
                setProfilePict(data.user.user_photo);
                let user_id: JWTDec = {
                    is_auth_user: '',
                    exp: 0,
                    iat: 0
                };
                if (token) {
                    user_id = jwtDecode(token);
                    setAuthUser(user_id.is_auth_user);
                }
            }
        }
        QF_TQ_UEF_CatchErrorCB(isError, error);
        //eslint-disable-next-line
    }, [data, isSuccess, isError, error]);

    return (
        <>
            {
                authUser ?
                    (
                        <div ref={menuRef} className="relative">
                            {/* <Link href={`/user/${AuthUser}`} title="profile" className="transition-all delay-75 relative bg-white border border-solid border-zinc-800 w-[40px] h-[40px] text-[20px] rounded-full flex items-center justify-center font-noto_sans font-bold text-zinc-800">
                            <span className="uppercase">{nameLetter}</span>
                            {profilePict && (<Image src={profilePict} width={40} height={40} className="absolute left-0 top-0 w-full h-full rounded-full z-[2]" alt="photo" />)}
                        </Link> */}
                            <button
                                type="button"
                                title="Profile"
                                className="transition-all delay-75 relative bg-white border border-solid border-zinc-800 w-[40px] h-[40px] text-[20px] rounded-full flex items-center justify-center font-noto_sans font-bold text-zinc-800"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <span className="uppercase">{nameLetter}</span>
                                {profilePict && (<Image src={profilePict} width={40} height={40} className="absolute left-0 top-0 w-full h-full rounded-full z-[2]" alt="photo" />)}
                            </button>
                            <ul className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-950 dark:ring-zinc-800 ${isMenuOpen ? 'block' : 'hidden'}`}>
                                <li className="w-full">
                                    <Link
                                        href={`/user/${authUser}`}
                                        title="My Profile"
                                        className="transition-all delay-75 block w-full py-[10px] px-[15px] font-ubuntu text-[16px] text-zinc-900 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex gap-x-[5px] items-center">
                                            <CgProfile size={20} />
                                            <div>
                                                My Profile
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        href={`/user/settings/${authUser}`}
                                        title="Settings"
                                        className="transition-all delay-75 block w-full py-[10px] px-[15px] font-ubuntu text-[16px] text-zinc-900 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex gap-x-[5px] items-center">
                                            <IoSettingsOutline size={20} />
                                            <div>
                                                Settings
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        href={`/logout`}
                                        title="Logout"
                                        className="transition-all delay-75 block w-full py-[10px] px-[15px] font-ubuntu text-[16px] text-red-500 hover:bg-zinc-100 dark:text-red-500 dark:hover:bg-zinc-800"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex gap-x-[5px] items-center">
                                            <IoSettingsOutline size={20} />
                                            <div>
                                                Logout
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )
                    :
                    (
                        <>
                            {/* Desktop Login */}
                            <Link href="/sign-in" title="Login" className="transition-all delay-100 hidden md:inline-block bg-theme-color-1 text-white hover:bg-theme-color-1-hover-dark font-medium text-[16px] md:text-[18px] py-[5px] md:py-[10px] px-[20px] md:px-[35px] rounded-full">
                                Sign In
                            </Link>

                            {/* Mobile Login */}
                            <Link href="/sign-in" title="Login" className="transition-all delay-75 relative bg-white border border-solid border-zinc-800 w-[40px] h-[40px] text-[20px] rounded-full md:hidden flex items-center justify-center font-noto_sans font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-400 dark:hover:text-theme-color-2 dark:hover:border-theme-color-2">
                                <FaRegUser size={15} />
                            </Link>
                        </>
                    )
            }
        </>
    )
}