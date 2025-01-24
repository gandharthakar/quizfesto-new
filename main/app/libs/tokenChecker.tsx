'use client';

import { useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next/client";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { adminAuthUserCookieName, redirectURIAdmin, redirectURISite, siteAuthUserCookieName } from "@/app/constant/datafaker";
import { signOut } from "next-auth/react";

const TokenChecker = (props: { is_admin: boolean }) => {

    const { is_admin } = props;

    const router = useRouter();
    const checkTokenValidity = async () => {
        const baseURI = window.location.origin;
        let glsi;
        if (is_admin) {
            glsi = getCookie(adminAuthUserCookieName);
        } else {
            glsi = getCookie(siteAuthUserCookieName);
        }

        if (glsi) {

            try {
                const resp = await fetch(`${baseURI}/api/auth/token-checker`, {
                    method: "POST",
                    body: JSON.stringify({ token: glsi })
                })
                // if (!resp.ok) {
                //     throw new Error("Failed to check token validity.");
                // }
                const body = await resp.json();
                if (!body.success) {
                    Swal.fire({
                        title: "Error!",
                        text: body.message,
                        icon: "error",
                        timer: 4000
                    }).then((result) => {
                        if (result.isConfirmed) {
                            if (is_admin) {
                                router.push(redirectURIAdmin);
                                deleteCookie(adminAuthUserCookieName);
                            } else {
                                // router.push(redirectURISite);
                                signOut({ callbackUrl: redirectURISite });
                                deleteCookie(siteAuthUserCookieName);
                            }
                        }
                    });
                    if (is_admin) {
                        router.push(redirectURIAdmin);
                        deleteCookie(adminAuthUserCookieName);
                    } else {
                        // router.push(redirectURISite);
                        signOut({ callbackUrl: redirectURISite });
                        deleteCookie(siteAuthUserCookieName);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            Swal.fire({
                title: "Error!",
                text: "Your session is ended. Please sign in again to continue.",
                icon: "error",
                timer: 4000
            }).then((result) => {
                if (result.isConfirmed) {
                    if (is_admin) {
                        router.push(redirectURIAdmin);
                        deleteCookie(adminAuthUserCookieName);
                    } else {
                        // router.push(redirectURISite);
                        signOut({ callbackUrl: redirectURISite });
                        deleteCookie(siteAuthUserCookieName);
                    }
                }
            });
            if (is_admin) {
                router.push(redirectURIAdmin);
                deleteCookie(adminAuthUserCookieName);
            } else {
                // router.push(redirectURISite);
                signOut({ callbackUrl: redirectURISite });
                deleteCookie(siteAuthUserCookieName);
            }
        }
    }

    useEffect(() => {
        checkTokenValidity();
        //eslint-disable-next-line
    }, []);
    return null;
};

export default TokenChecker;