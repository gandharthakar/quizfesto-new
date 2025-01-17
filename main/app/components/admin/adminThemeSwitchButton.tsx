'use client';

import { set_admin_dark_mode, unset_admin_dark_mode } from "@/app/libs/redux-service/slices/admin/theme-mode/adminThemeSwitcherSlice";
import { RootState } from "@/app/libs/redux-service/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiSun } from "react-icons/fi";
import { FiMoon } from "react-icons/fi";

function AdminThemeSwitchButton() {

    const dispatch = useDispatch();
    const ThemeMode = useSelector((state: RootState) => state.admin_theme_mode.admin_dark_theme_mode);

    useEffect(() => {
        const glsi = localStorage.getItem('admin-dark-mode');
        const checkDM = glsi ? JSON.parse(glsi) : '';
        if (checkDM) {
            dispatch(set_admin_dark_mode());
        } else {
            dispatch(unset_admin_dark_mode());
        }
    });

    const toggleTheme = () => {
        if (!ThemeMode) {
            dispatch(set_admin_dark_mode());
        } else {
            dispatch(unset_admin_dark_mode());
        }
    }

    return (
        <>
            <div className="transition-all delay-75 bg-zinc-100 relative flex gap-x-[5px] rounded-full p-[2px] dark:bg-zinc-800">
                <div className={`transition-all delay-75 w-[30px] h-[30px] rounded-full bg-theme-color-1 absolute top-[2px] z-[1] ${ThemeMode ? 'left-[37px]' : 'left-[2px]'}`}></div>
                <button
                    type="button"
                    className={`w-[30px] h-[30px] rounded-full flex items-center justify-center relative z-[4] ${!ThemeMode ? 'text-zinc-200' : 'text-zinc-700'} dark:text-zinc-200`}
                    onClick={() => dispatch(unset_admin_dark_mode())}
                >
                    <FiSun size={20} />
                </button>
                <button
                    type="button"
                    className={`w-[30px] h-[30px] rounded-full flex items-center justify-center relative z-[4] text-zinc-700 dark:text-zinc-200`}
                    onClick={() => dispatch(set_admin_dark_mode())}
                >
                    <FiMoon size={20} />
                </button>
            </div>
        </>
    )
}

export default AdminThemeSwitchButton;