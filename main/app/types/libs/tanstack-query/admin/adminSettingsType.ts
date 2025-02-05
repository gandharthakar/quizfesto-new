export type QF_AGenSetGetDataType = {
    user_full_name: string,
    user_email: string,
    user_gender: string,
    success?: boolean
}

export type QF_AGenSetSetPayloadType = {
    token: string,
    user_full_name: string,
    user_email: string,
    user_gender: string
}

export type QF_APhnSetGetDataType = {
    user_phone: string,
    success?: boolean
}

export type QF_APhnSetSetPayloadType = {
    token: string,
    user_phone: string
}

export type QF_GetUserInfoDataType = {
    user_full_name: string,
    user_photo: string,
    success?: boolean
}

export type QF_GetAdminProfilePhotoType = {
    user_photo: string,
    success?: boolean,
    message: string
}

export type QF_setAdminProfilePhotoPayloadType = {
    token: string,
    user_photo: string
}

export type QF_GetAdminStatsDataType = {
    total_quizes: number,
    total_questions: number,
    total_options: number,
    total_categories: number,
    total_users: number,
    total_winners: number
}