
import React, { Dispatch, SetStateAction } from 'react';

export type CommonModalPropsType = {
    open_modal_on_page_load?: boolean,
    openState?: boolean,
    setOpenState?: Dispatch<SetStateAction<boolean>>,
    modal_heading: string,
    backdrop?: boolean,
    hide_modal_on_backdrop_click?: boolean,
    modal_max_width?: number,
    children?: React.ReactNode
    callBackAfterModalClose?: () => void,
}

export type CategoriesType = {
    category_id: string,
    category_title: string,
    category_slug: string
}

export type FAQComponentType = {
    ques_text: string,
    children: React.ReactNode,
    show_icon?: boolean,
    is_open?: boolean,
    onClick: () => void
}

export type PaginationType = {
    totalPages: number,
    dataPerPage: number,
    currentPage: number,
    parentClassList: string,
    onPageChange?: (pageNumber: number) => void
}


export type QuizInfoModalComponentType = {
    open_modal_on_page_load?: boolean,
    openState?: boolean,
    setOpenState?: Dispatch<SetStateAction<boolean>>,
    modal_heading: string,
    backdrop?: boolean,
    hide_modal_on_backdrop_click?: boolean,
    modal_max_width?: number,
    children: React.ReactNode
    callBackAfterModalClose?: () => void,
}

export type MyParticipationCardType = {
    quiz_title: string,
    quiz_cover_photo: string,
    quiz_display_time: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_estimated_time: string,
    quiz_time_taken: string,
    quiz_correct_answers_count: number,
    quiz_total_score: number
}

export type UserAreaWinnerCardType = {
    winning_type: number,
    winning_position_text: string,
    winning_description: string,
    winning_date: string,
}
