'use client';

import MyParticipationCard from "@/app/components/myParticipationCard";
import SitePagination from "@/app/components/sitePagination";
// import { dump_my_participation } from "@/app/constant/datafaker";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GFG } from "@/app/libs/helpers/helperFunctions";
import { MyParticipationCardDataType } from "@/app/types/pages/website/user-area/userAreaPageTypes";
import TokenChecker from "@/app/libs/tokenChecker";
import AuthChecker from "@/app/libs/authChecker";

export default function Page() {

    const params = useParams<{ user_id: string[] }>();
    const user_id = params.user_id[0];

    const dataPerPage = 5;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [mpData, setMpData] = useState<MyParticipationCardDataType[]>([]);
    const [totalPages, setTotalPages] = useState<number>(Math.ceil(mpData.length / dataPerPage));
    const [mpListData, setMpListData] = useState<MyParticipationCardDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        setMpListData(GFG(mpData, newPage, dataPerPage));
    };

    const getParticipationData = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/auth-user/get-my-participation`, {
            method: "POST",
            body: JSON.stringify({ user_id }),
        });
        const body = await resp.json();
        if (body.success) {
            setIsLoading(false);
            setMpData(body.participation_data);
            setTotalPages(Math.ceil(body.participation_data.length / dataPerPage));
            setMpListData(GFG(body.participation_data, currentPage, dataPerPage));
        } else {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getParticipationData();
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <AuthChecker />
            <TokenChecker is_admin={false} />
            <section className="py-[25px]">
                <div>
                    {
                        mpListData.length > 0 ?
                            (
                                <>
                                    {
                                        mpListData.map((item) => (
                                            <div className="pb-[20px] last:pb-0" key={item.user_participation_id} >
                                                <MyParticipationCard
                                                    quiz_title={item.quiz_title}
                                                    quiz_cover_photo={item.quiz_cover_photo}
                                                    quiz_display_time={item.quiz_display_time}
                                                    quiz_total_question={item.quiz_total_question}
                                                    quiz_total_marks={item.quiz_total_marks}
                                                    quiz_estimated_time={item.quiz_estimated_time}
                                                    quiz_time_taken={item.quiz_time_taken}
                                                    quiz_correct_answers_count={item.quiz_correct_answers_count}
                                                    quiz_total_score={item.quiz_total_score}
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
                                                    No Data Found.
                                                </h1>
                                            )
                                    }
                                </>
                            )
                    }
                </div>

                <SitePagination
                    totalPages={totalPages}
                    dataPerPage={dataPerPage}
                    currentPage={currentPage}
                    parentClassList="pt-[50px]"
                    onPageChange={handlePageChange}
                />
            </section>
        </>
    )
}