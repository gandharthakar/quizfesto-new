
export type WinnerUserDataType = {
    winner_id: string,
    winning_type: number,
    winning_position_text: string,
    winning_description: string,
    winning_date: string
}


export type MyParticipationCardDataType = {
    user_participation_id: string,
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


export type UserStatsType = {
    user_score: number,
    user_participation: number,
    user_winnings: number
}

export type CheckWinnerType = {
    winner_type: number,
    winning_position_text: string,
    winning_score: number
}
