'use client';

import { useDispatch } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/app/libs/redux-service/store";
import { useEffect } from "react";
import { set_dark_mode, unset_dark_mode } from "@/app/libs/redux-service/slices/theme-mode/themeSwitcherSlice";

const ThemeCheckerSingle = () => {
    // let isDarkMode:boolean = false;
    const dispatch = useDispatch();
    // const ThemeMode = useSelector((state: RootState) => state.site_theme_mode.dark_theme_mode);

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

    return null;
};

export default ThemeCheckerSingle;