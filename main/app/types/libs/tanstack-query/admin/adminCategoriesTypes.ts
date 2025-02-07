export type QF_ADSCatsPayloadType = {
    token: string,
    category_id_list: string[]
}

export type QF_ACreCatPayloadType = {
    token: string,
    category_title: string,
    category_slug: string
}

export type QF_AUpdCatPayloadType = {
    token: string,
    category_id: string,
    category_title: string,
    category_slug: string
}

export type QF_AGetSingleCatPayloadType = {
    token: string,
    category_id: string
}