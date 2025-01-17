'use client';

import UserAreaWinningCard from "@/app/components/userAreaWinningCard";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import { jwtDecode } from "jwt-decode";
import { JWTDec } from "@/app/types/commonTypes";
import { WinnerUserDataType } from "@/app/types/pages/website/user-area/userAreaPageTypes";

export default function Page() {

    const router = useRouter();
    const params = useParams<{ user_id: string }>();
    const user_id = params.user_id;

    const gau = getCookie('is_auth_user');
    if (gau) {
        const user_id_ck: JWTDec = jwtDecode(gau);
        const fin_uid = user_id_ck.is_auth_user;
        if (user_id !== fin_uid) {
            router.push('/logout');
        }
    }

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [winData, setWindata] = useState<WinnerUserDataType>();

    const checkIfWinner = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/auth-user/get-my-winning`, {
            method: "POST",
            body: JSON.stringify({ user_id }),
        });
        const body = await resp.json();
        if (body.success) {
            setWindata(body.winner);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        checkIfWinner();
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="py-[25px]">
                <div className="grid gap-[20px] grid-cols-1 md:grid-cols-2 xl-s1:grid-cols-3">
                    {
                        winData ?
                            (
                                <UserAreaWinningCard
                                    winning_type={winData.winning_type}
                                    winning_position_text={winData.winning_position_text}
                                    winning_description={winData.winning_description}
                                    winning_date={winData.winning_date}
                                />
                            )
                            :
                            (
                                <>
                                    {
                                        isLoading ?
                                            (<div className="spinner size-1"></div>)
                                            :
                                            (
                                                <h1 className="transition-all delay-75 text-[16px] md:text-[18px] font-semibold text-zinc-800 dark:text-zinc-300">
                                                    No Record Found.
                                                </h1>
                                            )
                                    }
                                </>
                            )
                    }
                </div>
            </div>
        </>
    )
}