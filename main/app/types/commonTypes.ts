export type JWTDec = {
    is_auth_user: string,
    exp: number,
    iat: number
}

export type JWTDecAdmin = {
    is_admin_user: string,
    exp: number,
    iat: number
}

export type zodIssuesMyType = {
    message: string,
    field: string
}

export type CommonAPIResponse = {
    success: boolean,
    message: string
}

export type CommonAPIResponseWithZodError = {
    errors?: zodIssuesMyType[]
    token?: string,
} & CommonAPIResponse

export type TQ_CBtype = {
    onSuccessCB?: (resp?: (CommonAPIResponse | CommonAPIResponseWithZodError | undefined), cb?: () => void) => void,
    errorCB?: (resp?: (CommonAPIResponse | CommonAPIResponseWithZodError | undefined), cb?: () => void) => void,
    onErrorCB?: (resp?: (CommonAPIResponse | CommonAPIResponseWithZodError | undefined), cb?: () => void) => void,
    token?: string,
    quiz_id?: string,
    question_id?: string,
    option_id?: string,
    category_id?: string,
    uid?: string,
    prize_type?: string
}