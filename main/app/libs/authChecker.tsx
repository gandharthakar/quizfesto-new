'use client';

import { deleteCookie, getCookie } from "cookies-next/client";
import { useParams } from "next/navigation";
// import { useRouter } from "next/router";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { JWTDec } from "@/app/types/commonTypes";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";
import { redirectURISite } from "../constant/datafaker";

const AuthChecker = () => {

    // const router = useRouter();
    const params = useParams<{ user_id: string[] }>();
    const user_id = params.user_id[0];

    useEffect(() => {
        const gau = getCookie('is_auth_user');
        if (gau) {
            const user_id_ck: JWTDec = jwtDecode(gau);
            const fin_uid = user_id_ck.is_auth_user;
            if (user_id !== fin_uid || fin_uid !== user_id) {
                //eslint-disable-next-line
                let st: any;

                Swal.fire({
                    title: "Error!",
                    text: "Your session is ended. Please sign in again to continue.",
                    icon: "error",
                    timer: 4000
                }).then((result) => {
                    if (result.isConfirmed) {
                        signOut({ callbackUrl: redirectURISite });
                        deleteCookie('is_auth_user');
                        clearTimeout(st);
                    }
                });

                st = setTimeout(() => {
                    signOut({ callbackUrl: redirectURISite });
                    deleteCookie('is_auth_user');
                }, 4000);
            }
        }
    }, [user_id]);

    return null;
};

export default AuthChecker;