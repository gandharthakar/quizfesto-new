export type QF_WebsiteGetUserInfoDataType = {
    user_id: string,
    user_full_name: string,
    user_email: string,
    user_phone: string,
    user_photo: string,
    user_gender: string
}

export type QF_WebsiteGetUserStatsDataType = {
    user_score: number,
    user_participation: number,
    user_winnings: number
}

export type QF_SetWebAuthUserGenSetPayloadType = {
    token: string,
    user_full_name: string,
    user_email: string,
    user_gender: string
}

export type QF_SetWebAuthUserphnSetPayloadType = {
    token: string,
    user_phone: string
}

export type QF_SetWebAuthUserPhtSetPayloadType = {
    token: string,
    user_photo: string
}