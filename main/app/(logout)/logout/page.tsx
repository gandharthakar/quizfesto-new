'use client';

import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Page() {

    const router = useRouter();

    //eslint-disable-next-line
    const handleLogout = () => {
        signOut({callbackUrl: '/'});
        deleteCookie("is_auth_user");
    }

    useEffect(() => {
        handleLogout();
    //eslint-disable-next-line
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