'use client';

import WinnersUsersForm from "@/app/components/admin/winnersUsersForm";
import TokenChecker from "@/app/libs/tokenChecker";
import { WinnerUserFormType } from "@/app/types/components/admin/componentsTypes";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";

function Page() {

    const [winnersData, setWinnersData] = useState<WinnerUserFormType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getWinners = async () => {
        setIsLoading(true);
        setWinnersData([]);
        const baseURI = window.location.origin;
        const token = getCookie(adminAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/admin/winners/crud/find?token=${token}`, {
                method: "GET",
            });
            if (!resp.ok) {
                setIsLoading(false);
            }
            const body = await resp.json();
            if (body.success) {
                setIsLoading(false);
                setWinnersData(body.winners);
            } else {
                setIsLoading(false);
            }
            //eslint-disable-next-line
        } catch (error: any) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
                timer: 4000
            });
        }
    }

    const readWinners = async () => {
        const baseURI = window.location.origin;
        const token = getCookie(adminAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/admin/winners/bulk-actions/read-all?token=${token}`, {
                method: "GET",
            });
            if (!resp.ok) {
                setIsLoading(false);
            }
            const body = await resp.json();
            if (body.success) {
                setIsLoading(false);
                setWinnersData(body.winners);
            } else {
                setIsLoading(false);
            }
            //eslint-disable-next-line
        } catch (error: any) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
                timer: 4000
            });
        }
    }

    const deleteWinners = async () => {
        const conf = confirm("Are you sure want to remove all winners ?");

        if (conf) {
            const baseURI = window.location.origin;
            const token = getCookie(adminAuthUserCookieName);
            try {
                const resp = await fetch(`${baseURI}/api/admin/winners/bulk-actions/remove-all?token=${token}`, {
                    method: "DELETE"
                });

                const body = await resp.json();
                if (body.success) {
                    Swal.fire({
                        title: "Success!",
                        text: body.message,
                        icon: "success",
                        timer: 3000
                    });
                    const set = setTimeout(() => {
                        window.location.reload();
                        clearTimeout(set);
                    }, 3000);
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: body.message,
                        icon: "error",
                        timer: 3000
                    });
                }
                //eslint-disable-next-line
            } catch (error: any) {
                Swal.fire({
                    title: "Error!",
                    text: error.message,
                    icon: "error",
                    timer: 4000
                });
            }
        }
    }

    useEffect(() => {
        readWinners();
    }, []);

    return (
        <>
            <TokenChecker is_admin={true} />
            <div className="py-[25px]">
                <div className="pb-[25px] flex items-center gap-[15px]">
                    <button
                        type="button"
                        title="Find Winner"
                        className="transition-all delay-75 inline-block py-[8px] md:py-[10px] px-[15px] md:px-[25px] text-[16px] md:text-[18px] font-ubuntu font-semibold bg-theme-color-1 text-zinc-100"
                        onClick={getWinners}
                    >
                        Find Winners
                    </button>
                    <button
                        type="button"
                        title="Remove All"
                        className="transition-all delay-75 inline-block py-[8px] md:py-[10px] px-[15px] md:px-[25px] text-[16px] md:text-[18px] font-ubuntu font-semibold bg-red-600 text-zinc-100 hover:bg-red-700"
                        onClick={deleteWinners}
                    >
                        Remove All
                    </button>
                </div>

                <div>
                    <div className="pb-[20px]">

                        {
                            winnersData.length > 0 ?
                                (
                                    <>
                                        {
                                            winnersData.map((item) => (
                                                <div key={item.winner_id} className="pb-[20px] last:pb-0">
                                                    <WinnersUsersForm
                                                        winner_type={item.winner_type}
                                                        winning_position_text={item.winning_position_text}
                                                        user_id={item.user_id}
                                                        winner_date={item.winner_date}
                                                        user_full_name={item.user_full_name}
                                                        winner_description={item.winner_description}
                                                        user_profile_picture={item.user_profile_picture}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </>
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
                                                        No Winners Found.
                                                    </h1>
                                                )
                                        }
                                    </>
                                )
                        }

                    </div>

                </div>
            </div>
        </>
    )
}

export default Page;