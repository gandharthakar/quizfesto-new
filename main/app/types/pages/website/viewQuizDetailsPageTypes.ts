
export type quizCategoriesType = {
    category_id: string,
    category_title: string,
    category_slug: string,
}

export type QuizCardPropsType = {
    quiz_id: string,
    quiz_cover_photo?: string,
    quiz_title: string,
    quiz_categories?: quizCategoriesType[],
    quiz_summary: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_display_time: string,
    quiz_terms?: string[],
}