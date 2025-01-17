'use client';

import Image from "next/image";
import Link from "next/link";
import { RiQuestionFill } from "react-icons/ri";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { RootState } from "@/app/libs/redux-service/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PiExamFill } from "react-icons/pi";
import Swal from "sweetalert2";
import { MdBlock } from "react-icons/md";
import { QuizCardPropsType } from "@/app/types/pages/website/viewQuizDetailsPageTypes";

export default function QuizCard(props: QuizCardPropsType) {

    const {
        quiz_id,
        quiz_cover_photo = "",
        quiz_title,
        quiz_categories,
        quiz_summary,
        quiz_total_question,
        quiz_total_marks,
        quiz_display_time,
        quiz_terms,
    } = props;

    const defaultImage = "https://placehold.co/1000x700/png";
    // const user_id = "1";`/play-quiz/${quiz_id}/${userID}`
    const AuthUser = useSelector((state: RootState) => state.auth_user_id.auth_user_id);
    const userID = AuthUser !== '' ? AuthUser : '1';
    const prtLink = userID !== '1' ? `/play-quiz/${quiz_id}/${userID}` : '/sign-in';

    const [haveTerms, setHaveTerms] = useState<boolean>(quiz_terms && quiz_terms.length ? true : false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [qapbu, setQapbu] = useState<boolean>(false);
    const [isAdminBlockedYou, setIsAdminBlockedYou] = useState<boolean>(false);

    const checkQuiz = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/check-quiz`, {
            method: "POST",
            body: JSON.stringify({ quiz_id, user_id: AuthUser }),
            cache: 'no-store',
            next: { revalidate: 60 }
        });
        const body = await resp.json();
        if (body.success) {
            setQapbu(true);
            setIsLoading(false);
        } else {
            setQapbu(false);
            setIsLoading(false);
        }
    }

    const checkIfBlock = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/check-block-status`, {
            method: "POST",
            body: JSON.stringify({ user_id: userID }),
            cache: 'no-store',
            next: { revalidate: 60 }
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
        if (AuthUser) {
            checkQuiz();
            checkIfBlock();
        } else {
            setIsLoading(false);
        }
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="transition-all delay-75 border-[2px] border-solid p-[15px] border-zinc-300 bg-white hover:border-zinc-600 dark:bg-zinc-800 dark:border-zinc-600 dark:hover:border-zinc-400">
                <div className="flex flex-col gap-y-[15px] min-h-[100%]">
                    <div className="w-full">
                        <div className="pb-[20px]">
                            <Link href={`/view-quiz-details/${quiz_id}`} title={quiz_title}>
                                <Image src={quiz_cover_photo ? quiz_cover_photo : defaultImage} alt="photo" width={1000} height={700} className="w-full h-auto" priority={true} />
                            </Link>
                        </div>
                        {
                            quiz_categories?.length ?
                                (
                                    <div className="pb-[10px]">
                                        <ul className="flex flex-wrap gap-x-[10px] gap-y-[10px]">
                                            {
                                                quiz_categories.map((cat) => (
                                                    <li key={cat.category_id}>
                                                        <Link
                                                            href={`/view-category/${cat.category_slug}`}
                                                            title={cat.category_title}
                                                            className="transition-all delay-75 inline-block concard text-white font-semibold font-ubuntu text-[12px] md:text-[16px] px-[10px] md:px-[15px] py-[4px] md:py-[6px] rounded-full"
                                                        >
                                                            {cat.category_title}
                                                        </Link>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                )
                                :
                                (
                                    <>
                                        <div className="pb-[10px]">
                                            <div className="transition-all delay-75 inline-block concard text-white font-semibold font-ubuntu text-[12px] md:text-[16px] px-[10px] py-[4px] md:px-[15px] md:py-[6px] rounded-full">
                                                Uncategorized
                                            </div>
                                        </div>
                                    </>
                                )
                        }
                        <div className="pb-[5px]">
                            <h1 className="transition-all delay-75 font-noto_sans font-bold text-[20px] md:text-[22px] text-zinc-800 dark:text-zinc-200">
                                <Link href={`/view-quiz-details/${quiz_id}`} title={quiz_title}>
                                    {quiz_title}
                                </Link>
                            </h1>
                        </div>
                        <div className="pb-[15px]">
                            <p className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] font-normal text-zinc-800 dark:text-zinc-300">
                                {quiz_summary}
                            </p>
                        </div>
                        <div className="pb-[15px]">
                            <div className="flex flex-wrap gap-y-[5px] gap-x-[15px] items-center">
                                <div className="flex gap-x-[5px] items-center">
                                    <MdOutlineAccessTimeFilled size={20} className="transition-all delay-75 w-[15px] h-[15px] md:w-[20px] md:h-[20px] text-zinc-600 dark:text-zinc-300" />
                                    <h2 className="transition-all delay-75 font-ubuntu text-[12] md:text-[14] text-zinc-600 dark:text-zinc-300">
                                        {quiz_display_time}
                                    </h2>
                                </div>
                                <div className="flex gap-x-[5px] items-center">
                                    <RiQuestionFill size={20} className="transition-all delay-75 w-[15px] h-[15px] md:w-[20px] md:h-[20px] text-zinc-600 dark:text-zinc-300" />
                                    <h2 className="transition-all delay-75 font-ubuntu text-[12] md:text-[14] text-zinc-600 dark:text-zinc-300">
                                        {quiz_total_question} {Number(quiz_total_question) > 1 || !["1", "0"].includes(quiz_total_question.toString()) ? ('Questions') : ("question")}
                                    </h2>
                                </div>
                                <div className="flex gap-x-[5px] items-center">
                                    <PiExamFill size={20} className="transition-all delay-75 w-[15px] h-[15px] md:w-[20px] md:h-[20px] text-zinc-600 dark:text-zinc-300" />
                                    <h2 className="transition-all delay-75 font-ubuntu text-[12] md:text-[14] text-zinc-600 dark:text-zinc-300">
                                        {quiz_total_marks} Total Marks
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto w-full">
                        <div className="flex gap-x-[15px] justify-between items-center">
                            {
                                haveTerms ?
                                    (
                                        <div className="transition-all delay-75 font-noto_sans text-[12px] md:text-[12px] text-zinc-400">
                                            T & C Applied.
                                        </div>
                                    )
                                    :
                                    (
                                        <div></div>
                                    )
                            }
                            <div>
                                {
                                    isLoading ?
                                        (<div className="spinner size-4"></div>)
                                        :
                                        (
                                            <>
                                                {
                                                    isAdminBlockedYou ?
                                                        (
                                                            <>
                                                                <div className="flex items-center gap-x-[5px] text-red-600">
                                                                    <MdBlock size={18} className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
                                                                    <div className="font-ubuntu text-[16px] md:text-[18px] font-semibold">
                                                                        Blocked
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )
                                                        :
                                                        (
                                                            <>
                                                                {
                                                                    qapbu ?
                                                                        (
                                                                            <div className="flex gap-x-[5px] items-center">
                                                                                <FaLock size={18} className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-theme-color-2" />
                                                                                <div className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-700 dark:text-zinc-300">
                                                                                    Locked
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                        :
                                                                        (
                                                                            <Link href={prtLink} title="Participate" className="transition-all delay-75 inline-block px-[15px] py-[6px] md:px-[25px] md:py-[8px] font-ubuntu text-[16px] md:text-[18px] text-white bg-theme-color-1 hover:bg-theme-color-1-hover-dark">
                                                                                Participate
                                                                            </Link>
                                                                        )
                                                                }
                                                            </>
                                                        )
                                                }
                                            </>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}