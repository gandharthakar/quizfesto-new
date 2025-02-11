export type QF_PUBPrizesDataType = {
    prize_id: string;
    prize_type: number;
    prize_description: string;
    prize_cover_photo: string | null;
    winning_score_limit: number;
    createdAt: Date;
    updatedAt: Date;
}

export type QF_MasterCategoriesDataType = {
    category_id: string,
    category_title: string,
    category_slug: string
}

export type QF_MasterQuizDataType = {
    quiz_id: string,
    quiz_title: string,
    quiz_summary: string,
    quiz_display_time: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_about_text: string,
    quiz_terms?: string[],
    quiz_categories: QF_MasterCategoriesDataType[],
    quiz_cover_photo?: string,
}

export type QF_PUBQuessDataType = {
    question_id: string,
    question_title: string,
    question_marks: number,
    question_options: string
}

export type QF_pUBGetQuizQuesDataType = {
    quiz_id: string,
    quiz_title: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_estimated_time: string,
    quiz_display_time: string,
    quiz_cover_photo: string,
    questions?: QF_PUBQuessDataType[],
    negative_marking_score: number
}


export type QuizGivenAns = {
    question_id: string,
    user_choosen_option: string,
    question_marks: number
}

export type QuizQues = {
    question_id: string,
    correct_option: string
}

export type QF_PUBGetScoreDataType = {
    quiz_coorect_answers_count?: number,
    quiz_total_score?: number
}