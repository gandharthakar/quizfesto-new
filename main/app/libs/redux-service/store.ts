'use client';

import { configureStore } from '@reduxjs/toolkit'

import themeModeReducer from './slices/theme-mode/themeSwitcherSlice';
import userAreaMenuToggleReducer from './slices/user-area/userAreaMenuToggleSlice';
import transferQuizDataReducer from './slices/quiz-playground/transferQuizDataslice';

import adminThemeModeReducer from './slices/admin/theme-mode/adminThemeSwitcherSlice';
import adminAreaMenuToggleReducer from './slices/admin/adminAreaMenuToggleSlice';
import authUserReducer from './slices/user-area/authUserReducer';

const store = configureStore({
    reducer: {
        site_theme_mode: themeModeReducer,
        user_area_menu_toggle: userAreaMenuToggleReducer,
        transfer_quiz_data: transferQuizDataReducer,

        admin_theme_mode: adminThemeModeReducer,
        admin_area_menu_toggle: adminAreaMenuToggleReducer,
        auth_user_id: authUserReducer,
    },
    devTools: false,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;