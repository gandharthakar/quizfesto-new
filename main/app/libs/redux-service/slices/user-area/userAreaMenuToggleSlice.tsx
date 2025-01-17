'use client';

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    is_user_area_menu_open: false
}

const userAreaMenuToggleReducer = createSlice({
    name: "user_area_menu_toggle",
    initialState,
    reducers: {
        open_user_area_menu: (state) => {
            state.is_user_area_menu_open = true;
        },
        close_user_area_menu: (state) => {
            state.is_user_area_menu_open = false;
        },
    }
});

export const { open_user_area_menu, close_user_area_menu} = userAreaMenuToggleReducer.actions;

export default userAreaMenuToggleReducer.reducer;