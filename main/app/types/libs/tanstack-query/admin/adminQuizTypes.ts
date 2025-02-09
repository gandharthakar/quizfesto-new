export type QF_ARAQuizesDataType = {
    quiz_id: string,
    quiz_title: string,
    quiz_status: string,
    total_questions: number,
}

export type QF_ADSQuizesPayloadType = {
    token: string,
    quiz_id_list: string[]
}

export type QF_ACreateQuizPayloadType = {
    token: string,
    quiz_id?: string,
    quiz_title: string,
    quiz_summary: string,
    quiz_display_time: string,
    quiz_estimated_time: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_status: string,
    quiz_about_text: string,
    quiz_terms: string[],
    quiz_categories: string[],
    quiz_cover_photo: string,
    negative_marking_score: number
}

export type QF_AUpdateQuizPayloadType = Omit<QF_ACreateQuizPayloadType, 'quiz_categories'>

export type QF_AGetQuizDataType = {
    quiz_id: string,
    quiz_title: string,
    quiz_summary: string,
    quiz_display_time: string,
    quiz_estimated_time: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_status: string,
    quiz_about_text: string,
    quiz_terms: string[],
    // quiz_categories: RTSPkgSelectType[],
    quiz_cover_photo: string,
    negative_marking_score: number
}

export type QF_AGetQuizPayloadType = {
    token: string,
    quiz_id: string
}