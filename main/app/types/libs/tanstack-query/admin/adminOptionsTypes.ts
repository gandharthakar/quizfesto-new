export type QF_ADSOptsPayloadTypes = {
    token: string,
    options_id_list: string[]
}

export type QF_ARAOptsDataType = {
    option_id: string,
    options: string[],
    question_text: string,
    search_tems: string[]
}

export type QF_ACreOptionsPayloadType = {
    token: string,
    options: string[],
    correct_option: string,
    question_id: string
}

export type QF_AUpdOptionsPayloadType = {
    token: string,
    option_id: string,
    options: string[],
    correct_option: string,
    question_id: string
}

export type QF_ADelOptionsPayloadType = {
    token: string,
    option_id: string,
}

export type QF_AGetOptionsDataType = {
    option_id: string,
    options: string[],
    correct_option: string,
    questionid: string,
}