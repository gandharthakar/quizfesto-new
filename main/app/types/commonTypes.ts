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