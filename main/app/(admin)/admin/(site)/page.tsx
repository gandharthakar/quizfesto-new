'use client';

import { FiMessageSquare } from "react-icons/fi";
import { FaRegQuestionCircle } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { MdOutlineCategory } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { useEffect, useState } from "react";
import { AdminStatsDataCardType } from "@/app/types/components/admin/componentsTypes";

function Page() {

    const [stats, setStats] = useState<AdminStatsDataCardType>({
        total_quizes: 0,
        total_questions: 0,
        total_options: 0,
        total_categories: 0,
        total_users: 0,
        total_winners: 0
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getStats = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/admin/stats`, {
            method: "GET"
        });
        const body = await resp.json();
        if (body.success) {
            setStats(body.stats);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getStats();
    }, []);

    return (
        <>
            <div className="py-[25px]">
                <div className="pb-[20px]">
                    <h1 className="transition-all delay-75 text-zinc-900 text-[16px] md:text-[20px] font-ubuntu font-semibold dark:text-zinc-200">
                        !Welcome To, QuizFesto Admin Dashboard.
                    </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl-s1:grid-cols-3 gap-[20px]">
                    <div className="bg-theme-color-1 relative px-[20px] py-[10px] md:px-[30px] md:py-[20px] rounded-[10px]">
                        <FiMessageSquare size={100} className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] absolute right-[10px] top-1/2 z-[1] text-white opacity-20 translate-y-[-50%]" />
                        {
                            isLoading ?
                                (<div className="spinner size-3"></div>)
                                :
                                (
                                    <h1 className="text-[28px] md:text-[50px] font-ubuntu font-light text-white relative z-[5]">
                                        {stats.total_quizes}
                                    </h1>
                                )
                        }
                        <h1 className="text-[18px] md:text-[26px] font-ubuntu font-medium text-white relative z-[5]">
                            Quizes
                        </h1>
                    </div>
                    <div className="bg-theme-color-1 relative px-[20px] py-[10px] md:px-[30px] md:py-[20px] rounded-[10px]">
                        <FaRegQuestionCircle size={100} className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] absolute right-[10px] top-1/2 z-[1] text-white opacity-20 translate-y-[-50%]" />
                        {
                            isLoading ?
                                (<div className="spinner size-3"></div>)
                                :
                                (
                                    <h1 className="text-[28px] md:text-[50px] font-ubuntu font-light text-white relative z-[5]">
                                        {stats.total_questions}
                                    </h1>
                                )
                        }
                        <h1 className="text-[18px] md:text-[26px] font-ubuntu font-medium text-white relative z-[5]">
                            Questions
                        </h1>
                    </div>
                    <div className="bg-theme-color-1 relative px-[20px] py-[10px] md:px-[30px] md:py-[20px] rounded-[10px]">
                        <BiCategoryAlt size={100} className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] absolute right-[10px] top-1/2 z-[1] text-white opacity-20 translate-y-[-50%]" />
                        {
                            isLoading ?
                                (<div className="spinner size-3"></div>)
                                :
                                (
                                    <h1 className="text-[28px] md:text-[50px] font-ubuntu font-light text-white relative z-[5]">
                                        {stats.total_options}
                                    </h1>
                                )
                        }
                        <h1 className="text-[18px] md:text-[26px] font-ubuntu font-medium text-white relative z-[5]">
                            Options
                        </h1>
                    </div>
                    <div className="bg-theme-color-1 relative px-[20px] py-[10px] md:px-[30px] md:py-[20px] rounded-[10px]">
                        <MdOutlineCategory size={100} className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] absolute right-[10px] top-1/2 z-[1] text-white opacity-20 translate-y-[-50%]" />
                        {
                            isLoading ?
                                (<div className="spinner size-3"></div>)
                                :
                                (
                                    <h1 className="text-[28px] md:text-[50px] font-ubuntu font-light text-white relative z-[5]">
                                        {stats.total_categories}
                                    </h1>
                                )
                        }
                        <h1 className="text-[18px] md:text-[26px] font-ubuntu font-medium text-white relative z-[5]">
                            Categories
                        </h1>
                    </div>
                    <div className="bg-theme-color-1 relative px-[20px] py-[10px] md:px-[30px] md:py-[20px] rounded-[10px]">
                        <FaRegUser size={100} className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] absolute right-[10px] top-1/2 z-[1] text-white opacity-20 translate-y-[-50%]" />
                        {
                            isLoading ?
                                (<div className="spinner size-3"></div>)
                                :
                                (
                                    <h1 className="text-[28px] md:text-[50px] font-ubuntu font-light text-white relative z-[5]">
                                        {stats.total_users}
                                    </h1>
                                )
                        }
                        <h1 className="text-[18px] md:text-[26px] font-ubuntu font-medium text-white relative z-[5]">
                            Users
                        </h1>
                    </div>
                    <div className="bg-theme-color-1 relative px-[20px] py-[10px] md:px-[30px] md:py-[20px] rounded-[10px]">
                        <GoTrophy size={100} className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] absolute right-[10px] top-1/2 z-[1] text-white opacity-20 translate-y-[-50%]" />
                        {
                            isLoading ?
                                (<div className="spinner size-3"></div>)
                                :
                                (
                                    <h1 className="text-[28px] md:text-[50px] font-ubuntu font-light text-white relative z-[5]">
                                        {stats.total_winners}
                                    </h1>
                                )
                        }
                        <h1 className="text-[18px] md:text-[26px] font-ubuntu font-medium text-white relative z-[5]">
                            Winners
                        </h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page;