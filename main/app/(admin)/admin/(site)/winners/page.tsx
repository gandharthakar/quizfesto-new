'use client';

import WinnersUsersForm from "@/app/components/admin/winnersUsersForm";
import TokenChecker from "@/app/libs/tokenChecker";
import { WinnerUserFormType } from "@/app/types/components/admin/componentsTypes";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";
import { useReadAllAdminWinners } from "@/app/libs/tanstack-query/admin/queries/adminQueries";
import { callbackErrT1S1_ST1, callbackOnErrT1S1_ST1, callbackOnSucT1S1_ST1, QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";
import { useDeleteAllAdminWinners, useFindAllAdminWinners } from "@/app/libs/tanstack-query/admin/mutations/adminWinnersMutations";

function Page() {

    const token = getCookie(adminAuthUserCookieName);
    const [winnersData, setWinnersData] = useState<WinnerUserFormType[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(true);

    const findSinWin = useFindAllAdminWinners({
        token,
        errorCB: (resp) => callbackErrT1S1_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S1_ST1(resp),
        onSuccessCB: (resp) => callbackOnSucT1S1_ST1(resp)
    });

    const getWinners = async () => {
        const tokenSub = getCookie(adminAuthUserCookieName);
        findSinWin.mutate({ token: tokenSub ?? "" });
        if (findSinWin.isSuccess) {
            if (findSinWin.data?.winners) {
                setWinnersData(findSinWin.data?.winners);
            }
        }
    }

    const delSinWin = useDeleteAllAdminWinners({
        token,
        errorCB: (resp) => callbackErrT1S1_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S1_ST1(resp),
        onSuccessCB: (resp) => callbackOnSucT1S1_ST1(resp)
    });

    const deleteWinners = async () => {
        const conf = confirm("Are you sure want to remove all winners ?");

        if (conf) {
            const tokenDel = getCookie(adminAuthUserCookieName);
            delSinWin.mutate({ token: tokenDel ?? "" });
        }
    }

    const { data, isError, error, isSuccess, isLoading } = useReadAllAdminWinners(token ?? "");

    useEffect(() => {

        if (isSuccess) {
            if (data.winners && data.winners.length) {
                setWinnersData(data.winners);
            } else {
                setWinnersData([]);
            }
        }

        QF_TQ_UEF_CatchErrorCB(isError, error);
    }, [data, isSuccess, isError, error, setWinnersData]);

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
                                            (isLoading || (delSinWin.isPending || findSinWin.isPending)) ?
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