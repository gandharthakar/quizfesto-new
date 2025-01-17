'use client';

import { AnswObj, QuizAns } from "@/app/types/reduxTypes";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AnswObj = {
    quiz_id: '',
    quiz_title: '',
    quiz_cover_photo: '',
    quiz_total_question: 0,
    time_taken: '',
    attempted_data: [],
    quiz_total_marks: 0,
    quiz_estimated_time: '',
    quiz_display_time: '',
    negative_marking_score: 0
};

const transferQuizDataReducer = createSlice({
    name: "transfer_quiz_data",
    initialState,
    reducers: {
        set_tqd: (state, actions) => {
            state = actions.payload;
            return state;
        },
        clear_tqd: (state) => {
            //eslint-disable-next-line
            let arr: QuizAns[] = [];

            state = {
                quiz_id: '',
                quiz_title: '',
                quiz_cover_photo: '',
                quiz_total_question: 0,
                time_taken: '',
                attempted_data: arr,
                quiz_total_marks: 0,
                quiz_estimated_time: '',
                quiz_display_time: '',
                negative_marking_score: 0
            };
            return state;
        },
    }
});

export const { set_tqd, clear_tqd } = transferQuizDataReducer.actions;

export default transferQuizDataReducer.reducer;