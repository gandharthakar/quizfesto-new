'use client';
import { MdSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/libs/redux-service/store";
import { useEffect } from "react";
import { set_dark_mode, unset_dark_mode } from "@/app/libs/redux-service/slices/theme-mode/themeSwitcherSlice";

export default function ThemeSwitchUserAreaTopHeader() {

    const dispatch = useDispatch();
    const ThemeMode = useSelector((state: RootState) => state.site_theme_mode.dark_theme_mode);

    useEffect(() => {
        // Automatically Check and Set Dark Mode.
        // const detectMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Manually Toggle and Save Dark Mode.
        const glsi = localStorage.getItem('site-dark-mode');
        const checkDM = glsi ? JSON.parse(glsi) : '';
        if (checkDM) {
            dispatch(set_dark_mode());
        } else {
            dispatch(unset_dark_mode());
        }
    });

    const toggleTheme = () => {
        if (!ThemeMode) {
            dispatch(set_dark_mode());
        } else {
            dispatch(unset_dark_mode());
        }
    }

    return (
        <>
            <button type="button" title="Change Theme" className="transition-all delay-75 text-zinc-700 hover:text-theme-color-2 dark:text-zinc-300 dark:hover:text-theme-color-2" onClick={toggleTheme}>
                {
                    ThemeMode ? (<IoMdMoon size={25} />) : (<MdSunny size={25} />)
                }
            </button>
        </>
    )
}