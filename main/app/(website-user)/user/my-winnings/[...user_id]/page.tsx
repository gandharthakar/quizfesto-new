'use client';

import UserAreaWinningCard from "@/app/components/userAreaWinningCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { WinnerUserDataType } from "@/app/types/pages/website/user-area/userAreaPageTypes";
import TokenChecker from "@/app/libs/tokenChecker";
import AuthChecker from "@/app/libs/authChecker";

export default function Page() {

    const params = useParams<{ user_id: string[] }>();
    const user_id = params.user_id[0];

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
            <AuthChecker />
            <TokenChecker is_admin={false} />
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