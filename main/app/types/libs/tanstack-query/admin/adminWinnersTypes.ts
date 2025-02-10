export type QF_ARAWinnersDataType = {
    winner_id: string,
    winner_type: number,
    winning_position_text: string,
    user_id?: string,
    winner_date: string,
    user_full_name: string,
    winner_description: string,
    user_profile_picture?: string
}

export type QF_ADelSingleWinnerPayloadType = {
    token: string,
    winner_type: number
}

export type QF_AUpdSingleWinnerPayloadType = {
    token: string,
    winner_type: number,
    winner_description: string
}