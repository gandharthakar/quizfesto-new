'use client';

import { useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next/client";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { redirectURIAdmin, redirectURISite } from "../constant/datafaker";
import { signOut } from "next-auth/react";

const TokenChecker = (props: { is_admin: boolean }) => {

    const { is_admin } = props;

    const router = useRouter();
    const checkTokenValidity = async () => {
        const baseURI = window.location.origin;
        let glsi;
        if (is_admin) {
            glsi = getCookie('is_admin_user');
        } else {
            glsi = getCookie('is_auth_user');
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
                                deleteCookie('is_admin_user');
                            } else {
                                // router.push(redirectURISite);
                                signOut({ callbackUrl: redirectURISite });
                                deleteCookie('is_auth_user');
                            }
                        }
                    });
                    if (is_admin) {
                        router.push(redirectURIAdmin);
                        deleteCookie('is_admin_user');
                    } else {
                        // router.push(redirectURISite);
                        signOut({ callbackUrl: redirectURISite });
                        deleteCookie('is_auth_user');
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
                        deleteCookie('is_admin_user');
                    } else {
                        // router.push(redirectURISite);
                        signOut({ callbackUrl: redirectURISite });
                        deleteCookie('is_auth_user');
                    }
                }
            });
            if (is_admin) {
                router.push(redirectURIAdmin);
                deleteCookie('is_admin_user');
            } else {
                // router.push(redirectURISite);
                signOut({ callbackUrl: redirectURISite });
                deleteCookie('is_auth_user');
            }
        }
    }

    useEffect(() => {
        checkTokenValidity();
    }, []);
    return null;
};

export default TokenChecker;