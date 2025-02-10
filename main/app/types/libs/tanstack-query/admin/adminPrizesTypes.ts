export type QF_ACreUpdPrizesPayloadType = {
    token: string,
    prize_type: number,
    prize_photo: string,
    prize_description: string,
    winning_score_limit: number
}

export type QF_ADelPrizePayloadType = {
    token: string,
    prize_type: number,
}

export type QF_AGetPrizeDataType = {
    prize_type?: number,
    prize_description?: string,
    prize_cover_photo?: string,
    winning_score_limit?: number
}

export type QF_AGetPrizePayloadType = {
    token: string,
    prize_type: string,
}