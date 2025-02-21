'use client';

import Image from "next/image";
import Link from "next/link";
import AdminAreaMenuToggleButton from "./adminAreaMenuToggleButton";
import AdminHeaderProfileMenu from "./adminHeaderProfileMenu";
import AdminThemeSwitchButton from "./adminThemeSwitchButton";
import { RootState } from "@/app/libs/redux-service/store";
import { useSelector } from "react-redux";

function AdminAreaTopHeader() {

    const isDarkTheme = useSelector((state: RootState) => state.admin_theme_mode.admin_dark_theme_mode);

    return (
        <>
            <header className="transition-all delay-75 bg-white border border-solid border-zinc-300 dark:bg-zinc-950 dark:border-zinc-700">
                <div className="px-[15px] py-[10px] flex items-center gap-x-[20px]">
                    <div className="mr-auto lg:invisible">
                        <Link href="/admin" title="Admin Home">
                            {
                                isDarkTheme ?
                                    (<Image src="/images/qf-admin-og-black-bg-final.svg" width={120} height={26} className="w-[120px] h-auto" alt="Logo" priority={true} />)
                                    :
                                    (<Image src="/images/qf-admin-og-white-bg-final.svg" width={120} height={26} className="w-[120px] h-auto" alt="Logo" priority={true} />)
                            }
                        </Link>
                    </div>

                    <div className="flex items-center gap-x-[15px]">
                        <div className="hidden md:block">
                            <AdminThemeSwitchButton />
                        </div>
                        <div className="h-[40px]">
                            <AdminHeaderProfileMenu />
                        </div>
                        <div className="lg:hidden h-[25px]">
                            <AdminAreaMenuToggleButton />
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default AdminAreaTopHeader;