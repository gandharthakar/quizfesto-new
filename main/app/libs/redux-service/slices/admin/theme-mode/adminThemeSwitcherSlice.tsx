'use client';

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin_dark_theme_mode: false
}

const adminThemeModeReducer = createSlice({
    name: "admin_theme_mode",
    initialState,
    reducers: {
        set_admin_dark_mode: (state) => {
            const docHTML = document.querySelector('html');
            docHTML?.classList.add('dark');
            localStorage.setItem('admin-dark-mode', JSON.stringify(true));
            state.admin_dark_theme_mode = true;
        },
        unset_admin_dark_mode: (state) => {
            const docHTML = document.querySelector('html');
            docHTML?.classList.remove('dark');
            localStorage.setItem('admin-dark-mode', JSON.stringify(false));
            state.admin_dark_theme_mode = false;
        },
    }
});

export const { set_admin_dark_mode, unset_admin_dark_mode } = adminThemeModeReducer.actions;

export default adminThemeModeReducer.reducer;