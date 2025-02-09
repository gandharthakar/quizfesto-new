export type QF_AGetUsersDataType = {
    user_id: string,
    user_name: string,
    user_role: string,
    user_block_status: string
}

export type QF_ADSUsersPayloadType = {
    token: string,
    user_id_list: string[]
}

export type QF_ACreUserDataType = {
    token: string,
    user_full_name: string,
    user_email: string,
    user_password: string,
    user_conf_password: string,
    role: string,
    user_phone: string,
    user_photo: string,
    user_gender: string,
    block_user: string
}

export type QF_AGetSingleUserDataType = {
    user_full_name: string,
    user_email: string,
    user_phone?: string,
    user_photo?: string,
    user_gender?: string,
    role: string,
    block_user: string,
}

export type QF_AGetSingleUserPayloadType = {
    token: string,
    uid: string
}

export type QF_ASetSingleUserPayloadType = {
    token: string,
    uid: string,
    user_full_name: string,
    user_email: string,
    user_password: string,
    user_conf_password: string,
    role: string,
    user_phone: string,
    user_photo: string,
    user_gender: string,
    block_user: string
}