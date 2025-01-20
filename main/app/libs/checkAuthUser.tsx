'use client';

import { getCookie } from "cookies-next/client";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { set_auth_user_id, unset_auth_user_id } from "@/app/libs/redux-service/slices/user-area/authUserReducer";
import { JWTDec } from "@/app/types/commonTypes";

function CheckAuthUser({ children }: { children: React.ReactNode }) {

    const dispatch = useDispatch();
    // const UserID = useSelector((state: RootState) => state.auth_user_id);

    useEffect(() => {
        const authid = getCookie('is_auth_user');
        let user_id: JWTDec = {
            is_auth_user: '',
            exp: 0,
            iat: 0
        };
        if (authid) {
            user_id = jwtDecode(authid);
            dispatch(set_auth_user_id(user_id.is_auth_user))
        } else {
            dispatch(unset_auth_user_id());
        }
    });

    return (
        <>{children}</>
    )
}

export default CheckAuthUser;