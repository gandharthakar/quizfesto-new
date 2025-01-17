export type QuizAns = {
    question_id: string,
    user_choosen_option: string,
    question_marks: number
}


export type AnswObj = {
    quiz_id: string,
    quiz_title: string,
    quiz_cover_photo: string,
    quiz_total_question: number,
    time_taken: string,
    attempted_data: QuizAns[],
    quiz_total_marks: number,
    quiz_estimated_time: string,
    quiz_display_time: string,
    negative_marking_score: number
}
