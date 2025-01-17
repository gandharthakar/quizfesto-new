'use client';

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    is_admin_area_menu_open: false
}

const adminAreaMenuToggleReducer = createSlice({
    name: "admin_area_menu_toggle",
    initialState,
    reducers: {
        open_admin_area_menu: (state) => {
            state.is_admin_area_menu_open = true;
        },
        close_admin_area_menu: (state) => {
            state.is_admin_area_menu_open = false;
        },
    }
});

export const { open_admin_area_menu, close_admin_area_menu} = adminAreaMenuToggleReducer.actions;

export default adminAreaMenuToggleReducer.reducer;