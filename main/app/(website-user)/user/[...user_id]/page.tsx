'use client';

import { FaTrophy } from "react-icons/fa6";
import { IoChatboxEllipses } from "react-icons/io5";
import { FaFlag } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import Swal from "sweetalert2";
import { CheckWinnerType, UserStatsType } from "@/app/types/pages/website/user-area/userAreaPageTypes";
import TokenChecker from "@/app/libs/tokenChecker";
import AuthChecker from "@/app/libs/authChecker";

export default function Page() {

    const params = useParams<{ user_id: string[] }>();
    const user_id = params.user_id[0];

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userStats, setUserStats] = useState<UserStatsType>({
        user_score: 0,
        user_participation: 0,
        user_winnings: 0
    });
    const [checkWinner, setCheckWinner] = useState<CheckWinnerType>();
    const [isAdminBlockedYou, setIsAdminBlockedYou] = useState<boolean>(false);

    const getUserStats = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/auth-user/get-user-stats`, {
            method: "POST",
            body: JSON.stringify({ user_id }),
        });
        const body = await resp.json();
        if (body.success) {
            setUserStats(body.user_stats);
            setIsLoading(false);
        } else {
            Swal.fire({
                title: "Error!",
                text: body.message,
                icon: "error",
                timer: 4000
            });
            setIsLoading(false);
        }
    }

    const checkIfWinner = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/auth-user/check-winner-status`, {
            method: "POST",
            body: JSON.stringify({ user_id }),
        });
        const body = await resp.json();
        if (body.success) {
            setCheckWinner(body.winner);
        }
    }

    const checkIfBlock = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/auth-user/check-block-status`, {
            method: "POST",
            body: JSON.stringify({ user_id }),
        });
        const body = await resp.json();
        if (body.success) {
            if (body.user_block_status == "true") {
                setIsAdminBlockedYou(true);
            } else {
                setIsAdminBlockedYou(false);
            }
        } else {
            Swal.fire({
                title: "Error!",
                text: body.message,
                icon: "error",
                timer: 4000
            });
        }
    }

    useEffect(() => {
        getUserStats();
        checkIfWinner();
        checkIfBlock();
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <AuthChecker />
            <TokenChecker is_admin={false} />
            <div className="py-[25px]">

                {
                    isAdminBlockedYou &&
                    (
                        <div className="pb-[20px]">
                            <div className="transition-all delay-75 p-[15px] md:p-[20px] relative overflow-hidden border-[2px] border-solid border-red-600 bg-white dark:bg-zinc-800">
                                <div className="w-[400px] h-[400px] absolute left-0 bottom-0 bg-red-600 blur-[70px] opacity-[0.15] z-[1] rounded-full"></div>

                                <div className="relative z-[3]">
                                    <div className="pb-[10px]">
                                        <div className="flex items-center gap-x-[10px]">
                                            <IoIosWarning size={30} className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-red-600" />
                                            <div className="transition-all delay-75 font-noto_sans text-[18px] md:text-[20px] text-red-600 font-semibold">Alert</div>
                                            <IoIosWarning size={30} className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-red-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[18px] font-semibold text-red-600">
                                            Admin Blocked you for participating in quizes
                                        </h1>
                                        <p className="transition-all delay-75 font-ubuntu text-[14px] md:text-[16px] text-zinc-900 dark:text-zinc-300">
                                            As per our &quot;Privacy Policy&quot; & &quot;Terms & Conditions&quot;, Admin have full rights to block you and suspend you from participating quizes for serveral reasons.
                                            Some of the common reasons like illict or illigal activities like manipulation score etc.
                                            <br /><br />
                                            Please note that due to blockage you are unable to participate in any quizzes. You can feel free to contact us or admin on this below given email ID for request for unblock.
                                            <br /><br />
                                            Contact us on : <Link
                                                href="mailto:support@quizefesto.com"
                                                className="font-semibold text-blue-500 underline"
                                            >
                                                support@quizefesto.com
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    checkWinner ?
                        (
                            <div className="pb-[20px]">
                                <div className="concard p-[2px] md:p-[3px]">
                                    <div className="transition-all delay-75 p-[20px] bg-white dark:bg-zinc-800 relative overflow-hidden">
                                        {/* <div className="w-[400px] h-[400px] absolute right-0 bottom-[-155px] bg-theme-color-1 blur-[70px] opacity-[0.20] dark:opacity-[0.2] z-[1] rounded-full hidden md:block"></div> */}
                                        <div className="w-[400px] h-[400px] absolute left-0 bottom-0 bg-theme-color-2 blur-[70px] opacity-[0.15] z-[1] rounded-full"></div>

                                        <div className="pb-[5px] md:pb-[10px]">
                                            <Image src="/images/bouquet-icon.png" width={50} height={50} className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]" priority={true} alt="Bouquet Image" />
                                        </div>
                                        <div>
                                            <h1 className="transition-all delay-75 font-noto_sans text-[16px] md:text-[18px] text-zinc-400">
                                                <span className="font-bold text-theme-color-2">!Congratulations</span>
                                            </h1>
                                            <p className="transition-all delay-75 font-ubuntu text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-200">
                                                You scored {checkWinner.winning_score} and you won {checkWinner.winner_type}<sup>{checkWinner.winning_position_text}</sup> prize.
                                            </p>
                                            <Link
                                                href={`/user/my-winnings/${user_id}`}
                                                title="Check Now"
                                                className="transition-all delay-75 font-ubuntu text-[14px] md:text-[16px] font-semibold text-blue-700"
                                            >
                                                <div className="flex items-center gap-x-[5px]">
                                                    <span className="relative top-[-2px]">
                                                        Check Now
                                                    </span>
                                                    <FaLongArrowAltRight size={14} />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        ('')
                }

                <div className="grid gap-[25px] grid-cols-1 lg-1:grid-cols-2 xl-1:grid-cols-3">
                    <div className="transition-all delay-75 bg-white dark:bg-zinc-800 px-[25px] py-[25px] border-[2px] border-solid p-[15px] border-zinc-300 hover:border-zinc-600 dark:border-zinc-600 dark:hover:border-zinc-400">
                        <div className="flex flex-row-reverse gap-x-[20px] items-center">
                            <div className="w-auto ml-auto">
                                <div className="flex items-center justify-center w-[50px] h-[50px] concard">
                                    <FaFlag size={23} className="w-[23px] h-[23px] text-white" />
                                </div>
                            </div>
                            <div className="pb-0">
                                <h2 className="transition-all delay-75 block font-ubuntu text-[18px] md:text-[25px] text-zinc-900 dark:text-zinc-400 leading-[30px] md:leading-[35px]">
                                    Your Score
                                </h2>
                                <div>
                                    <h2 className="transition-all delay-75 block font-ubuntu text-[30px] md:text-[40px] font-semibold text-zinc-900 dark:text-zinc-200 leading-[30px] md:leading-[45px]">
                                        {
                                            isLoading ?
                                                (<div className="spinner size-4"></div>)
                                                :
                                                (<>{userStats.user_score}</>)
                                        }
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="transition-all delay-75 bg-white dark:bg-zinc-800 px-[25px] py-[25px] border-[2px] border-solid p-[15px] border-zinc-300 hover:border-zinc-600 dark:border-zinc-600 dark:hover:border-zinc-400">
                        <div className="flex flex-row-reverse gap-x-[20px] items-center">
                            <div className="w-auto ml-auto">
                                <div className="flex items-center justify-center w-[50px] h-[50px] concard">
                                    <FaTrophy size={25} className="w-[25px] h-[25px] text-white" />
                                </div>
                            </div>
                            <div className="pb-0">
                                <h2 className="transition-all delay-75 block font-ubuntu text-[18px] md:text-[25px] text-zinc-900 dark:text-zinc-400 leading-[30px] md:leading-[35px]">
                                    Your Winnings
                                </h2>
                                <div>
                                    <h2 className="transition-all delay-75 block font-ubuntu text-[30px] md:text-[40px] font-semibold text-zinc-900 dark:text-zinc-200 leading-[30px] md:leading-[45px]">
                                        {
                                            isLoading ?
                                                (<div className="spinner size-4"></div>)
                                                :
                                                (<>{userStats.user_winnings}</>)
                                        }
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="transition-all delay-75 lg-1:col-span-2 xl-1:col-auto bg-white dark:bg-zinc-800 px-[25px] py-[25px] border-[2px] border-solid p-[15px] border-zinc-300 hover:border-zinc-600 dark:border-zinc-600 dark:hover:border-zinc-400">
                        <div className="flex flex-row-reverse gap-x-[20px] items-center">
                            <div className="w-auto ml-auto">
                                <div className="flex items-center justify-center w-[50px] h-[50px] concard">
                                    <IoChatboxEllipses size={25} className="w-[25px] h-[25px] text-white" />
                                </div>
                            </div>
                            <div className="pb-0">
                                <h2 className="transition-all delay-75 block font-ubuntu text-[18px] md:text-[25px] text-zinc-900 dark:text-zinc-400 leading-[30px] md:leading-[35px]">
                                    Your Participation
                                </h2>
                                <div>
                                    <h2 className="transition-all delay-75 block font-ubuntu text-[30px] md:text-[40px] font-semibold text-zinc-900 dark:text-zinc-200 leading-[30px] md:leading-[45px]">
                                        {
                                            isLoading ?
                                                (<div className="spinner size-4"></div>)
                                                :
                                                (<>{userStats.user_participation}</>)
                                        }
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}