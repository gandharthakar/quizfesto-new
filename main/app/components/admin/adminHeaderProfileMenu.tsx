'use client';

import Image from "next/image";
import Link from "next/link";
import { VscSettingsGear } from "react-icons/vsc";
import { FaPowerOff } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { JWTDecAdmin } from "@/app/types/commonTypes";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";
import { useGetAdminUserInfo } from "@/app/libs/tanstack-query/admin/queries/adminQueries";
import { QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";

function AdminHeaderProfileMenu() {

    const defaultImage = "https://placehold.co/1000x1000/png";

    const token = getCookie(adminAuthUserCookieName);
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [auid, setAuid] = useState<string>("");
    const [profilePhoto, setProfilePhoto] = useState<string>('');
    const [userName, setUserName] = useState('A');

    const handleClick = () => {
        setIsMenuOpen(false);
    }

    const handleLogOut = () => {
        setIsMenuOpen(false);
        deleteCookie("is_admin_user");
        router.push("/admin/login");
    }

    const { data, isSuccess, isError, error } = useGetAdminUserInfo(token ?? "");

    useEffect(() => {

        const menuHandler = (e: MouseEvent) => {
            if (menuRef.current !== null) {
                if (!menuRef.current.contains(e.target as Node)) {
                    setIsMenuOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', menuHandler);

        const gtco = getCookie("is_admin_user");

        let admin_id: JWTDecAdmin = {
            is_admin_user: '',
            exp: 0,
            iat: 0
        };
        if (gtco) {
            admin_id = jwtDecode(gtco);
            setAuid(admin_id.is_admin_user);
        }

        if (isSuccess) {
            if (data.user_photo) setProfilePhoto(data.user_photo);
            if (data.user_full_name) setUserName(data.user_full_name.charAt(0));
        }

        QF_TQ_UEF_CatchErrorCB(isError, error);

    }, [data, isSuccess, isError, error]);

    return (
        <>
            <div ref={menuRef} className="relative">
                <button title="Profile" type="button" className="" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <div className="flex justify-center items-center w-[40px] h-[40px] relative rounded-full bg-zinc-100">
                        <span className="uppercase font-noto_sans text-[16px] text-zinc-900">{userName}</span>
                        <Image src={profilePhoto ? profilePhoto : defaultImage} width={40} height={40} className="absolute left-0 top-0 w-full h-full z-[2] rounded-full" alt="Photo" />
                    </div>
                </button>
                <ul className={`absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-950 dark:ring-zinc-800 ${isMenuOpen ? 'block' : 'hidden'}`}>
                    <li className="w-full">
                        <Link
                            href={`/admin/settings/${auid}`}
                            title="Settings"
                            className="transition-all delay-75 block w-full py-[10px] px-[15px] font-ubuntu text-[16px] text-zinc-900 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            onClick={handleClick}
                        >
                            <div className="flex gap-x-[5px] items-center">
                                <VscSettingsGear size={20} />
                                <div>
                                    Settings
                                </div>
                            </div>
                        </Link>
                    </li>
                    <li className="w-full">
                        <button
                            type="button"
                            title="Logout"
                            className="transition-all delay-75 block w-full py-[10px] px-[15px] font-ubuntu text-[16px] text-red-500 hover:bg-zinc-100 dark:text-red-500 dark:hover:bg-zinc-800"
                            onClick={handleLogOut}
                        >
                            <div className="flex gap-x-[5px] items-center">
                                <FaPowerOff size={20} />
                                <div>
                                    Logout
                                </div>
                            </div>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default AdminHeaderProfileMenu;