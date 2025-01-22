'use client';

import { deleteCookie } from "cookies-next/client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

function Page() {

    const handleLogout = () => {
        signOut({ callbackUrl: '/' });
        deleteCookie("is_auth_user");
    }

    useEffect(() => {
        handleLogout();
    }, []);

    return (
        <>
            <section className="flex items-center justify-center min-h-screen p-[20px]">
                <h1 className="transition-all delay-75 font-ubuntu font-thin text-zinc-900 text-[25px] md:text-[30px]">
                    Logging out ...
                </h1>
            </section>
        </>
    )
}

export default Page;