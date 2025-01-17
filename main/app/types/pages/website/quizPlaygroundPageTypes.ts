export type UserQuizGivenAns = {
    question_id: string,
    user_choosen_option: string,
    question_marks: number
}


export type QuizQuestionType = {
    question_id: string,
    question_title: string,
    question_marks: number,
    question_options?: any
}

export type QuizQAType = {
    quiz_id: string,
    quiz_title: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_estimated_time: string,
    quiz_display_time: string,
    quiz_cover_photo: string,
    questions: QuizQuestionType[]
}
