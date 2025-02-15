'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { RootState } from "@/app/libs/redux-service/store";
// import { useSelector } from "react-redux";
import { JWTDec } from "../types/commonTypes";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next/client";
import { useEffect, useState } from "react";

export default function UserAreaSettingsTabs() {

    const pathName = usePathname();
    const [AuthUser, setAuthUser] = useState<string>('');
    // const AuthUser = useSelector((state: RootState) => state.auth_user_id.auth_user_id);
    // let AuthUser: string = '';

    useEffect(() => {
        const gau = getCookie('is_auth_user');
        if (gau) {
            const user_id_ck: JWTDec = jwtDecode(gau);
            setAuthUser(user_id_ck.is_auth_user);
        } else {
            setAuthUser("");
        }
    }, []);

    return (
        <>
            <ul className="user-area-set-nav flex flex-wrap flex-row lg:flex-col">
                <li>
                    <Link
                        href={`/user/settings/${AuthUser}`}
                        title="General"
                        className={`${pathName === '/user/settings/' + AuthUser ? 'active' : ''}`}
                    >
                        General
                    </Link>
                </li>
                <li>
                    <Link
                        href={`/user/settings/password/${AuthUser}`}
                        title="Password"
                        className={`${pathName === '/user/settings/password/' + AuthUser ? 'active' : ''}`}
                    >
                        Password
                    </Link>
                </li>
                <li>
                    <Link
                        href={`/user/settings/phone/${AuthUser}`}
                        title="Phone"
                        className={`${pathName === '/user/settings/phone/' + AuthUser ? 'active' : ''}`}
                    >
                        Phone
                    </Link>
                </li>
                <li>
                    <Link
                        href={`/user/settings/profle-photo/${AuthUser}`}
                        title="Profile Photo"
                        className={`${pathName === '/user/settings/profle-photo/' + AuthUser ? 'active' : ''}`}
                    >
                        Profile Photo
                    </Link>
                </li>
            </ul>
        </>
    )
}