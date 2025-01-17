'use client';

import { createSlice } from "@reduxjs/toolkit";
import { deleteCookie } from "cookies-next";

interface AuthUserID {
    auth_user_id: string
}

const initialState: AuthUserID = {
    auth_user_id: ''
}

const AuthUserReducer = createSlice({
    name: 'auth_user_id',
    initialState,
    reducers: {
        set_auth_user_id: (state, actions) => {
            state.auth_user_id = actions.payload;
        },
        unset_auth_user_id: (state) => {
            deleteCookie('is_auth_user');
            state.auth_user_id = '';
        }
    },
});

export const { set_auth_user_id, unset_auth_user_id } = AuthUserReducer.actions;

export default AuthUserReducer.reducer;