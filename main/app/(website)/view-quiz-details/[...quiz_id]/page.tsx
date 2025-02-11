'use client';

import QuizPrizes from "@/app/components/quizPrizes";
// import { dump_quizzes_list } from "@/app/constant/datafaker";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RiQuestionFill } from "react-icons/ri";
import { MdBlock, MdOutlineAccessTimeFilled } from "react-icons/md";
import copy from "copy-to-clipboard";
import Swal from 'sweetalert2';
import QuizCard from "@/app/components/quizCard";
import { PiExamFill } from "react-icons/pi";
import { FaLock } from "react-icons/fa6";
import parse from 'html-react-parser';
import { RootState } from "@/app/libs/redux-service/store";
import { useSelector } from "react-redux";
import { QuizCardPropsType, quizCategoriesType } from "@/app/types/pages/website/viewQuizDetailsPageTypes";
import { useGetPublicSingleQuizzesOnlyInfo } from "@/app/libs/tanstack-query/website/queries/websiteQueries";
import { QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";

export default function Page() {

    const params = useParams<{ quiz_id: string[] }>();
    const qz_id = params.quiz_id[0];

    const defaultImage = "https://placehold.co/1000x700/png";

    const [win, setWin] = useState<string>('');
    const [quizCats, setQuizCats] = useState<quizCategoriesType[]>([]);
    const [quizTitle, setQuizTitle] = useState<string>('');
    const [quizSummary, setQuizSummary] = useState<string>('');
    const [quizCover, setQuizCover] = useState<string>('');
    const [quizNOQ, setQuizNOQ] = useState<number>(0);
    const [quizTotMks, setQuizTotMks] = useState<number>(0);
    const [quizDuration, setQuizDuration] = useState<string>('');
    const [quizDescription, setQuizDescription] = useState<string>('');
    const [quizTerms, setQuizTerms] = useState<string[]>([]);
    const [relatedQuizes, setRelatedQuizes] = useState<QuizCardPropsType[]>([]);
    const [alreadyPlayedByUser, setAlreadyPlayedByUser] = useState<boolean>(true);
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoading0, setIsLoading0] = useState<boolean>(true);
    const [isAdminBlockedYou, setIsAdminBlockedYou] = useState<boolean>(false);

    const AuthUser = useSelector((state: RootState) => state.auth_user_id);
    const AuthUserCh = useSelector((state: RootState) => state.auth_user_id.auth_user_id);
    const userID = AuthUser.auth_user_id ? AuthUser.auth_user_id : '1';
    // const prtLink = userID !== '1' ? `/play-quiz/${qz_id}/${userID}` : '/sign-in';

    useEffect(() => {
        const win = typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';
        setWin(win);
    }, [setWin]);

    const share_uri = `${win}/view-quiz-details/${qz_id}`;
    const copyURI = () => {
        copy(share_uri);
        Swal.fire({
            title: "Success!",
            text: "Link Copied Successfully!",
            icon: "success",
            timer: 4000
        });
    }

    const getRelatedQuizes = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/get-quizes/bulk-list/related-quizes?quiz_id=${qz_id}`, {
            method: "GET",
            // body: JSON.stringify({ quiz_id: qz_id }),
        });
        const body = await resp.json();
        if (body.success) {
            // setIsLoading(false);
            setRelatedQuizes(body.quizes);
        } else {
            // setIsLoading(false);
        }
    }

    const checkQuiz = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/check-quiz`, {
            method: "POST",
            body: JSON.stringify({ quiz_id: qz_id, user_id: userID }),
        });
        const body = await resp.json();
        if (body.success) {
            setAlreadyPlayedByUser(true);
            setIsLoading0(false);
        } else {
            setAlreadyPlayedByUser(false);
            setIsLoading0(false);
        }
    }

    const checkIfBlock = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/check-block-status`, {
            method: "POST",
            body: JSON.stringify({ user_id: userID }),
        });
        const body = await resp.json();
        if (body.success) {
            if (body.user_block_status == "true") {
                setIsAdminBlockedYou(true);
            } else {
                setIsAdminBlockedYou(false);
            }
            setIsLoading0(false);
        } else {
            Swal.fire({
                title: "Error!",
                text: body.message,
                icon: "error",
                timer: 4000
            });
            setIsLoading0(false);
        }
    }

    const { data, isError, error, isSuccess, isLoading } = useGetPublicSingleQuizzesOnlyInfo(qz_id ?? "");

    useEffect(() => {
        if (isSuccess) {
            if (data.quiz) {
                setQuizCats(data.quiz.quiz_categories);
                setQuizTitle(data.quiz.quiz_title);
                setQuizSummary(data.quiz.quiz_summary);
                setQuizCover(data.quiz.quiz_cover_photo ?? "");
                setQuizNOQ(data.quiz.quiz_total_question);
                setQuizTotMks(data.quiz.quiz_total_marks);
                setQuizDuration(data.quiz.quiz_display_time);
                setQuizDescription(data.quiz.quiz_about_text);
                setQuizTerms(data.quiz.quiz_terms ?? []);
            }
        }

        QF_TQ_UEF_CatchErrorCB(isError, error);
    }, [data, isSuccess, isError, error]);

    useEffect(() => {
        if (AuthUserCh) {
            checkQuiz();
            checkIfBlock();
        } else {
            setIsLoading0(false);
            setAlreadyPlayedByUser(false);
        }
        //eslint-disable-next-line
    }, [AuthUserCh]);

    useEffect(() => {
        getRelatedQuizes();
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <section className="transition-all delay-75 px-[15px] pt-[80px] pb-[30px] lg:pt-[180px] lg:pb-[50px] bg-zinc-100 dark:bg-zinc-900">
                <div className="site-container">
                    <div className="flex gap-x-[35px] flex-col lg:flex-row">
                        <div className="w-full lg:flex-1">
                            {
                                quizCats.length ?
                                    (
                                        <>
                                            <div className="pb-[15px]">
                                                <ul className="flex flex-wrap gap-x-[10px] gap-y-[10px]">
                                                    {
                                                        quizCats.map((cat) => (
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
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <div className="pb-[15px]">
                                                <div className="transition-all delay-75 inline-block concard text-white font-semibold font-ubuntu text-[12px] md:text-[16px] px-[10px] py-[4px] md:px-[15px] md:py-[6px] rounded-full">
                                                    Uncategorized
                                                </div>
                                            </div>
                                        </>
                                    )
                            }
                            <div className="pb-[5px]">
                                <h1 className="transition-all delay-75 font-noto_sans font-bold text-[20px] md:text-[25px] text-zinc-800 dark:text-zinc-200">
                                    {quizTitle}
                                </h1>
                            </div>
                            <div className="pb-[15px]">
                                <p className="transition-all delay-75 font-noto_sans text-[16px] md:text-[20px] text-zinc-700 dark:text-zinc-400">
                                    {quizSummary}
                                </p>
                            </div>
                            <div className="pb-[15px] lg:hidden">
                                <div className="flex flex-wrap gap-y-[5px] gap-x-[15px] items-center">
                                    <div className="flex gap-x-[5px] md:gap-x-[10px] items-center">
                                        <MdOutlineAccessTimeFilled size={30} className="transition-all delay-75 w-[20px] h-[20px] md:w-[30px] md:h-[30px] text-zinc-600 dark:text-zinc-300" />
                                        <h2 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[25px] text-zinc-600 dark:text-zinc-300">
                                            {quizDuration}
                                        </h2>
                                    </div>
                                    <div className="flex gap-x-[5px] md:gap-x-[10px] items-center">
                                        <RiQuestionFill size={30} className="transition-all delay-75 w-[20px] h-[20px] md:w-[30px] md:h-[30px] text-zinc-600 dark:text-zinc-300" />
                                        <h2 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[25px] text-zinc-600 dark:text-zinc-300">
                                            {quizNOQ} {Number(quizNOQ) > 1 || ![1, 0].includes(quizNOQ) ? ('Questions') : ("question")}
                                        </h2>
                                    </div>
                                    <div className="flex gap-x-[5px] md:gap-x-[10px] items-center">
                                        <PiExamFill size={30} className="transition-all delay-75 w-[20px] h-[20px] md:w-[30px] md:h-[30px] text-zinc-600 dark:text-zinc-300" />
                                        <h2 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[25px] text-zinc-600 dark:text-zinc-300">
                                            Total Marks Is 50
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="pb-[25px] lg:hidden">
                                <div className="pb-[5px]">
                                    <h4 className="transition-all delay-75 font-noto_sans text-[20px] md:text-[25px] font-bold text-zinc-800 dark:text-zinc-200">
                                        Share This Quiz
                                    </h4>
                                </div>
                                <ul className="flex gap-x-[15px]">
                                    <li>
                                        <Link href={`https://www.facebook.com/sharer/sharer.php?u=${share_uri}`} title="Share on Facebook" target="_blank">
                                            <svg width="100" height="100" className="w-[35px] h-[35px] md:w-[40px] md:h-[40px]" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.5 0.5H2.5C1.12125 0.5 0 1.62125 0 3V18C0 19.3788 1.12125 20.5 2.5 20.5H17.5C18.8788 20.5 20 19.3788 20 18V3C20 1.62125 18.8788 0.5 17.5 0.5Z" fill="url(#paint0_linear_1042_49945)" />
                                                <path d="M14.375 10.5H11.5625V8C11.5625 7.31 12.435 7.375 13.125 7.375H14.375V4.25H11.875C9.80375 4.25 8.125 5.92875 8.125 8V10.5H5.82031V13.625H8.125V20.5H11.5625V13.625H13.8867L14.375 10.5Z" fill="#FAFAFA" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_1042_49945" x1="10" y1="0.5" x2="10" y2="16.8086" gradientUnits="userSpaceOnUse">
                                                        <stop stopColor="#4FAEF8" />
                                                        <stop offset="1" stopColor="#306EF7" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`https://api.whatsapp.com/send?text=${share_uri}`} title="Share on WhatsApp" target="_blank">
                                            <svg width="100" height="100" className="w-[35px] h-[35px] md:w-[40px] md:h-[40px]" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19.9992 15.4443C19.9992 15.5538 19.9959 15.7913 19.9893 15.9748C19.9732 16.4237 19.9376 17.0029 19.8838 17.2668C19.8029 17.6634 19.6809 18.0377 19.5217 18.3493C19.3333 18.7179 19.0931 19.048 18.8076 19.333C18.5228 19.6174 18.193 19.8567 17.8249 20.0442C17.5117 20.2038 17.135 20.326 16.7362 20.4065C16.4749 20.4593 15.9 20.4942 15.454 20.51C15.2704 20.5166 15.0328 20.5199 14.9237 20.5199L5.07555 20.5183C4.96603 20.5183 4.72857 20.515 4.54512 20.5084C4.09623 20.4923 3.51701 20.4567 3.25309 20.4029C2.85648 20.322 2.48213 20.1999 2.17057 20.0408C1.80197 19.8524 1.47184 19.6122 1.18689 19.3267C0.90252 19.0419 0.663223 18.712 0.475664 18.344C0.316016 18.0308 0.193867 17.6541 0.11334 17.2553C0.0606055 16.994 0.0257031 16.4191 0.00982422 15.973C0.00330078 15.7894 0 15.5519 0 15.4428L0.0015625 5.59461C0.0015625 5.4851 0.00490234 5.24762 0.0114844 5.06416C0.0275977 4.61527 0.0631641 4.03605 0.116973 3.77215C0.197852 3.37555 0.319922 3.00119 0.479121 2.68961C0.667461 2.32104 0.907715 1.99088 1.19316 1.70594C1.47801 1.42158 1.80785 1.18227 2.17588 0.994687C2.4891 0.835078 2.8658 0.71293 3.26465 0.632402C3.52592 0.579648 4.10082 0.544746 4.54684 0.528887C4.73047 0.522344 4.96803 0.519043 5.07709 0.519043L14.9253 0.520625C15.0348 0.520625 15.2723 0.523965 15.4557 0.530547C15.9046 0.54666 16.4838 0.582227 16.7478 0.636035C17.1443 0.716914 17.5187 0.838984 17.8303 0.998184C18.1988 1.18652 18.529 1.42678 18.8139 1.71223C19.0983 1.99707 19.3376 2.32689 19.5252 2.69494C19.6848 3.00816 19.807 3.38484 19.8875 3.78369C19.9402 4.04498 19.9751 4.61986 19.991 5.0659C19.9975 5.24953 20.0008 5.48707 20.0008 5.59617L19.9992 15.4443V15.4443Z" fill="url(#paint0_linear_1042_49966)" />
                                                <path d="M15.298 5.25113C13.9439 3.89592 12.1431 3.1492 10.2245 3.14844C6.27131 3.14844 3.05391 6.36461 3.05232 10.3178C3.05182 11.5815 3.38207 12.815 4.00969 13.9022L2.99219 17.6176L6.79424 16.6206C7.84182 17.1918 9.02123 17.4928 10.2216 17.4933H10.2246C14.1773 17.4933 17.395 14.2768 17.3966 10.3235C17.3974 8.40775 16.6521 6.60635 15.298 5.25113ZM10.2246 16.2824H10.2221C9.15246 16.282 8.10332 15.9947 7.18807 15.4518L6.97037 15.3226L4.71418 15.9143L5.31641 13.7152L5.17463 13.4897C4.57791 12.5409 4.26275 11.4443 4.26322 10.3183C4.26451 7.03256 6.93871 4.35938 10.2269 4.35938C11.8191 4.35998 13.3158 4.98068 14.4413 6.10707C15.5668 7.23346 16.1863 8.73074 16.1857 10.3231C16.1844 13.6091 13.5102 16.2824 10.2246 16.2824ZM13.4944 11.8192C13.3152 11.7296 12.4341 11.2961 12.2698 11.2363C12.1056 11.1765 11.9861 11.1467 11.8666 11.326C11.7472 11.5054 11.4038 11.9089 11.2992 12.0285C11.1946 12.148 11.0901 12.163 10.9109 12.0733C10.7317 11.9836 10.1543 11.7945 9.46979 11.1841C8.93707 10.7091 8.57738 10.1224 8.47285 9.94305C8.36832 9.76369 8.46174 9.66676 8.55145 9.57742C8.63205 9.49717 8.73065 9.36818 8.82025 9.26357C8.90984 9.15898 8.93973 9.08422 8.99945 8.96467C9.0592 8.8451 9.02932 8.74047 8.98451 8.6508C8.93973 8.56113 8.58131 7.67934 8.43197 7.32064C8.28652 6.97131 8.13875 7.01857 8.02875 7.01309C7.92434 7.00789 7.80475 7.0068 7.68529 7.0068C7.56584 7.0068 7.37168 7.05162 7.20742 7.23098C7.04316 7.41033 6.58022 7.84375 6.58022 8.72553C6.58022 9.6073 7.22234 10.4592 7.31195 10.5788C7.40156 10.6983 8.57561 12.5079 10.3733 13.2839C10.8009 13.4684 11.1347 13.5787 11.3949 13.6612C11.8242 13.7976 12.2149 13.7783 12.5237 13.7322C12.868 13.6808 13.5839 13.2988 13.7333 12.8804C13.8827 12.4619 13.8827 12.1032 13.8379 12.0285C13.793 11.9537 13.6736 11.9089 13.4944 11.8192Z" fill="white" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_1042_49966" x1="10.0004" y1="0.519043" x2="10.0004" y2="20.5199" gradientUnits="userSpaceOnUse">
                                                        <stop stopColor="#61FD7D" />
                                                        <stop offset="1" stopColor="#2BB826" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`https://twitter.com/intent/tweet?text=${quizTitle}&url=${share_uri}`} title="Share on WhatsApp" target="_blank">
                                            <svg width="100" height="100" className="w-[35px] h-[35px] md:w-[40px] md:h-[40px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_3957_92)">
                                                    <path d="M17.5 0H2.5C1.12125 0 0 1.12125 0 2.5V17.5C0 18.8787 1.12125 20 2.5 20H17.5C18.8787 20 20 18.8787 20 17.5V2.5C20 1.12125 18.8787 0 17.5 0Z" fill="black"></path>
                                                    <path d="M13.9025 3.90625H15.97L11.4531 9.06875L16.7669 16.0938H12.6063L9.3475 11.8331L5.61875 16.0938H3.55L8.38125 10.5719L3.28375 3.90625H7.55L10.4956 7.80062L13.9025 3.90625ZM13.1769 14.8563H14.3225L6.9275 5.07875H5.69813L13.1769 14.8563Z" fill="white"></path>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_3957_92">
                                                        <rect width="20" height="20" fill="white"></rect>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </Link>
                                    </li>
                                    <li>
                                        <button type="button" title="Copy Link" onClick={copyURI}>
                                            <svg width="100" height="100" className="w-[35px] h-[35px] md:w-[40px] md:h-[40px]" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_2009_9688)">
                                                    <path fill="red" className="transition-all delay-75 fill-zinc-800 dark:fill-zinc-200" d="M5.83333 5.49984V2.99984C5.83333 2.77882 5.92113 2.56686 6.07741 2.41058C6.23369 2.2543 6.44565 2.1665 6.66667 2.1665H16.6667C16.8877 2.1665 17.0996 2.2543 17.2559 2.41058C17.4122 2.56686 17.5 2.77882 17.5 2.99984V14.6665C17.5 14.8875 17.4122 15.0995 17.2559 15.2558C17.0996 15.412 16.8877 15.4998 16.6667 15.4998H14.1667V17.9998C14.1667 18.4598 13.7917 18.8332 13.3275 18.8332H3.33917C3.22927 18.8338 3.12033 18.8128 3.0186 18.7712C2.91687 18.7296 2.82436 18.6684 2.74638 18.5909C2.6684 18.5135 2.60649 18.4214 2.56421 18.32C2.52193 18.2185 2.50011 18.1097 2.5 17.9998L2.5025 6.33317C2.5025 5.87317 2.8775 5.49984 3.34167 5.49984H5.83333ZM4.16917 7.1665L4.16667 17.1665H12.5V7.1665H4.16917ZM7.5 5.49984H14.1667V13.8332H15.8333V3.83317H7.5V5.49984Z" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2009_9688">
                                                        <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="pb-[25px]">
                                <Image src={quizCover ? quizCover : defaultImage} width={1000} height={700} className="w-full h-auto" alt="photo" priority={true} />
                            </div>
                            <div className="pb-[25px]">
                                <div className="pb-[3px] md:pb-[5px]">
                                    <h2 className="transition-all delay-75 font-noto_sans text-[20px] md:text-[25px] font-bold text-zinc-800 dark:text-zinc-200">
                                        About The Quiz
                                    </h2>
                                </div>
                                <div>
                                    <div className="transition-all delay-75 font-noto_sans text-[16px] md:text-[20px] text-zinc-600 dark:text-zinc-400">
                                        {parse(quizDescription)}
                                    </div>
                                </div>
                            </div>
                            <div className="pb-[25px] lg:pb-[0]">
                                <div className="pb-[15px]">
                                    <h2 className="transition-all delay-75 font-noto_sans text-[20px] md:text-[25px] font-bold text-zinc-800 dark:text-zinc-200">
                                        Quiz Terms & Conditions
                                    </h2>
                                </div>
                                <div>
                                    {
                                        quizTerms.length ?
                                            (
                                                <>
                                                    <ul className="flex flex-col gap-y-[15px] list-disc pl-[22px] md:pl-[25px]">
                                                        {
                                                            quizTerms.map((trm, idx) => (
                                                                <li key={idx} className="transition-all delay-75 font-noto_sans text-[16px] md:text-[20px] text-zinc-600 dark:text-zinc-400">
                                                                    {trm}
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                </>
                                            )
                                            :
                                            ('')
                                    }
                                </div>
                            </div>
                            <div className="block lg:hidden">
                                {
                                    isLoading0 ?
                                        (<div className="spinner size-1"></div>)
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
                                                                        You Are Blocked By Admin.
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )
                                                        :
                                                        (
                                                            <>
                                                                {
                                                                    alreadyPlayedByUser ?
                                                                        (
                                                                            <div className="flex gap-x-[7px] md:gap-x-[10px] items-center justify-center">
                                                                                <FaLock size={24} className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] text-theme-color-2" />
                                                                                <div className="transition-all delay-75 font-noto_sans text-[16px] md:text-[20px] text-zinc-700 dark:text-zinc-300">
                                                                                    Locked
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                        :
                                                                        (
                                                                            // <Link href={prtLink} title="Participate" className="transition-all delay-75 block w-full text-center px-[15px] py-[8px] md:px-[25px] md:py-[10px] font-ubuntu text-[18px] md:text-[20px] text-white bg-theme-color-1 hover:bg-theme-color-1-hover-dark"></Link>
                                                                            <Link href={`/play-quiz/${qz_id}/${userID}`} title="Participate" className="transition-all delay-75 block w-full text-center px-[15px] py-[8px] md:px-[25px] md:py-[10px] font-ubuntu text-[18px] md:text-[20px] text-white bg-theme-color-1 hover:bg-theme-color-1-hover-dark">
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
                        <div className="w-full lg:w-[350px] hidden lg:block">
                            <div className="lg:sticky lg:top-[87px]">
                                <div className="transition-all delay-75 bg-white border-[2px] border-solid border-zinc-700 p-[20px] dark:bg-zinc-800 dark:border-zinc-700">
                                    <div className="hidden lg:block pb-[15px]">
                                        <div className="pb-[5px]">
                                            <h4 className="transition-all delay-75 font-noto_sans text-[20px] md:text-[25px] font-bold text-zinc-800 dark:text-zinc-200">
                                                Share This Quiz
                                            </h4>
                                        </div>
                                        <ul className="flex gap-x-[15px]">
                                            <li>
                                                <Link href={`https://www.facebook.com/sharer/sharer.php?u=${share_uri}`} title="Share on Facebook" target="_blank">
                                                    <svg width="100" height="100" className="w-[35px] h-[35px] md:w-[40px] md:h-[40px]" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M17.5 0.5H2.5C1.12125 0.5 0 1.62125 0 3V18C0 19.3788 1.12125 20.5 2.5 20.5H17.5C18.8788 20.5 20 19.3788 20 18V3C20 1.62125 18.8788 0.5 17.5 0.5Z" fill="url(#paint0_linear_1042_49932)" />
                                                        <path d="M14.375 10.5H11.5625V8C11.5625 7.31 12.435 7.375 13.125 7.375H14.375V4.25H11.875C9.80375 4.25 8.125 5.92875 8.125 8V10.5H5.82031V13.625H8.125V20.5H11.5625V13.625H13.8867L14.375 10.5Z" fill="#FAFAFA" />
                                                        <defs>
                                                            <linearGradient id="paint0_linear_1042_49932" x1="10" y1="0.5" x2="10" y2="16.8086" gradientUnits="userSpaceOnUse">
                                                                <stop stopColor="#4FAEF8" />
                                                                <stop offset="1" stopColor="#306EF7" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={`https://api.whatsapp.com/send?text=${share_uri}`} title="Share on WhatsApp" target="_blank">
                                                    <svg width="100" height="100" className="w-[35px] h-[35px] md:w-[40px] md:h-[40px]" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19.9992 15.4443C19.9992 15.5538 19.9959 15.7913 19.9893 15.9748C19.9732 16.4237 19.9376 17.0029 19.8838 17.2668C19.8029 17.6634 19.6809 18.0377 19.5217 18.3493C19.3333 18.7179 19.0931 19.048 18.8076 19.333C18.5228 19.6174 18.193 19.8567 17.8249 20.0442C17.5117 20.2038 17.135 20.326 16.7362 20.4065C16.4749 20.4593 15.9 20.4942 15.454 20.51C15.2704 20.5166 15.0328 20.5199 14.9237 20.5199L5.07555 20.5183C4.96603 20.5183 4.72857 20.515 4.54512 20.5084C4.09623 20.4923 3.51701 20.4567 3.25309 20.4029C2.85648 20.322 2.48213 20.1999 2.17057 20.0408C1.80197 19.8524 1.47184 19.6122 1.18689 19.3267C0.90252 19.0419 0.663223 18.712 0.475664 18.344C0.316016 18.0308 0.193867 17.6541 0.11334 17.2553C0.0606055 16.994 0.0257031 16.4191 0.00982422 15.973C0.00330078 15.7894 0 15.5519 0 15.4428L0.0015625 5.59461C0.0015625 5.4851 0.00490234 5.24762 0.0114844 5.06416C0.0275977 4.61527 0.0631641 4.03605 0.116973 3.77215C0.197852 3.37555 0.319922 3.00119 0.479121 2.68961C0.667461 2.32104 0.907715 1.99088 1.19316 1.70594C1.47801 1.42158 1.80785 1.18227 2.17588 0.994687C2.4891 0.835078 2.8658 0.71293 3.26465 0.632402C3.52592 0.579648 4.10082 0.544746 4.54684 0.528887C4.73047 0.522344 4.96803 0.519043 5.07709 0.519043L14.9253 0.520625C15.0348 0.520625 15.2723 0.523965 15.4557 0.530547C15.9046 0.54666 16.4838 0.582227 16.7478 0.636035C17.1443 0.716914 17.5187 0.838984 17.8303 0.998184C18.1988 1.18652 18.529 1.42678 18.8139 1.71223C19.0983 1.99707 19.3376 2.32689 19.5252 2.69494C19.6848 3.00816 19.807 3.38484 19.8875 3.78369C19.9402 4.04498 19.9751 4.61986 19.991 5.0659C19.9975 5.24953 20.0008 5.48707 20.0008 5.59617L19.9992 15.4443V15.4443Z" fill="url(#paint0_linear_1042_49922)" />
                                                        <path d="M15.298 5.25113C13.9439 3.89592 12.1431 3.1492 10.2245 3.14844C6.27131 3.14844 3.05391 6.36461 3.05232 10.3178C3.05182 11.5815 3.38207 12.815 4.00969 13.9022L2.99219 17.6176L6.79424 16.6206C7.84182 17.1918 9.02123 17.4928 10.2216 17.4933H10.2246C14.1773 17.4933 17.395 14.2768 17.3966 10.3235C17.3974 8.40775 16.6521 6.60635 15.298 5.25113ZM10.2246 16.2824H10.2221C9.15246 16.282 8.10332 15.9947 7.18807 15.4518L6.97037 15.3226L4.71418 15.9143L5.31641 13.7152L5.17463 13.4897C4.57791 12.5409 4.26275 11.4443 4.26322 10.3183C4.26451 7.03256 6.93871 4.35938 10.2269 4.35938C11.8191 4.35998 13.3158 4.98068 14.4413 6.10707C15.5668 7.23346 16.1863 8.73074 16.1857 10.3231C16.1844 13.6091 13.5102 16.2824 10.2246 16.2824ZM13.4944 11.8192C13.3152 11.7296 12.4341 11.2961 12.2698 11.2363C12.1056 11.1765 11.9861 11.1467 11.8666 11.326C11.7472 11.5054 11.4038 11.9089 11.2992 12.0285C11.1946 12.148 11.0901 12.163 10.9109 12.0733C10.7317 11.9836 10.1543 11.7945 9.46979 11.1841C8.93707 10.7091 8.57738 10.1224 8.47285 9.94305C8.36832 9.76369 8.46174 9.66676 8.55145 9.57742C8.63205 9.49717 8.73065 9.36818 8.82025 9.26357C8.90984 9.15898 8.93973 9.08422 8.99945 8.96467C9.0592 8.8451 9.02932 8.74047 8.98451 8.6508C8.93973 8.56113 8.58131 7.67934 8.43197 7.32064C8.28652 6.97131 8.13875 7.01857 8.02875 7.01309C7.92434 7.00789 7.80475 7.0068 7.68529 7.0068C7.56584 7.0068 7.37168 7.05162 7.20742 7.23098C7.04316 7.41033 6.58022 7.84375 6.58022 8.72553C6.58022 9.6073 7.22234 10.4592 7.31195 10.5788C7.40156 10.6983 8.57561 12.5079 10.3733 13.2839C10.8009 13.4684 11.1347 13.5787 11.3949 13.6612C11.8242 13.7976 12.2149 13.7783 12.5237 13.7322C12.868 13.6808 13.5839 13.2988 13.7333 12.8804C13.8827 12.4619 13.8827 12.1032 13.8379 12.0285C13.793 11.9537 13.6736 11.9089 13.4944 11.8192Z" fill="white" />
                                                        <defs>
                                                            <linearGradient id="paint0_linear_1042_49922" x1="10.0004" y1="0.519043" x2="10.0004" y2="20.5199" gradientUnits="userSpaceOnUse">
                                                                <stop stopColor="#61FD7D" />
                                                                <stop offset="1" stopColor="#2BB826" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={`https://twitter.com/intent/tweet?text=${quizTitle}&url=${share_uri}`} title="Share on WhatsApp" target="_blank">
                                                    <svg width="100" height="100" className="w-[35px] h-[35px] md:w-[40px] md:h-[40px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clipPath="url(#clip0_3957_92)">
                                                            <path d="M17.5 0H2.5C1.12125 0 0 1.12125 0 2.5V17.5C0 18.8787 1.12125 20 2.5 20H17.5C18.8787 20 20 18.8787 20 17.5V2.5C20 1.12125 18.8787 0 17.5 0Z" fill="black"></path>
                                                            <path d="M13.9025 3.90625H15.97L11.4531 9.06875L16.7669 16.0938H12.6063L9.3475 11.8331L5.61875 16.0938H3.55L8.38125 10.5719L3.28375 3.90625H7.55L10.4956 7.80062L13.9025 3.90625ZM13.1769 14.8563H14.3225L6.9275 5.07875H5.69813L13.1769 14.8563Z" fill="white"></path>
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_3957_92">
                                                                <rect width="20" height="20" fill="white"></rect>
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </Link>
                                            </li>
                                            <li>
                                                <button type="button" title="Copy Link" onClick={copyURI}>
                                                    <svg width="100" height="100" className="w-[35px] h-[35px] md:w-[40px] md:h-[40px]" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clipPath="url(#clip0_2009_9688)">
                                                            <path fill="red" className="transition-all delay-75 fill-zinc-800 dark:fill-zinc-200" d="M5.83333 5.49984V2.99984C5.83333 2.77882 5.92113 2.56686 6.07741 2.41058C6.23369 2.2543 6.44565 2.1665 6.66667 2.1665H16.6667C16.8877 2.1665 17.0996 2.2543 17.2559 2.41058C17.4122 2.56686 17.5 2.77882 17.5 2.99984V14.6665C17.5 14.8875 17.4122 15.0995 17.2559 15.2558C17.0996 15.412 16.8877 15.4998 16.6667 15.4998H14.1667V17.9998C14.1667 18.4598 13.7917 18.8332 13.3275 18.8332H3.33917C3.22927 18.8338 3.12033 18.8128 3.0186 18.7712C2.91687 18.7296 2.82436 18.6684 2.74638 18.5909C2.6684 18.5135 2.60649 18.4214 2.56421 18.32C2.52193 18.2185 2.50011 18.1097 2.5 17.9998L2.5025 6.33317C2.5025 5.87317 2.8775 5.49984 3.34167 5.49984H5.83333ZM4.16917 7.1665L4.16667 17.1665H12.5V7.1665H4.16917ZM7.5 5.49984H14.1667V13.8332H15.8333V3.83317H7.5V5.49984Z" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_2009_9688">
                                                                <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="hidden lg:block pb-[5px]">
                                        <div className="flex gap-x-[5px] md:gap-x-[10px] items-center">
                                            <MdOutlineAccessTimeFilled size={30} className="transition-all delay-75 w-[20px] h-[20px] md:w-[30px] md:h-[30px] text-zinc-600 dark:text-zinc-300" />
                                            <h2 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[25px] text-zinc-600 dark:text-zinc-300">
                                                {quizDuration}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="hidden lg:block pb-[5px]">
                                        <div className="flex gap-x-[5px] md:gap-x-[10px] items-center">
                                            <RiQuestionFill size={30} className="transition-all delay-75 w-[20px] h-[20px] md:w-[30px] md:h-[30px] text-zinc-600 dark:text-zinc-300" />
                                            <h2 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[25px] text-zinc-600 dark:text-zinc-300">
                                                {quizNOQ} {quizNOQ > 1 || ![1, 0].includes(quizNOQ) ? ('Questions') : ("question")}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="hidden lg:block pb-[20px]">
                                        <div className="flex gap-x-[5px] md:gap-x-[10px] items-center">
                                            <PiExamFill size={30} className="transition-all delay-75 w-[20px] h-[20px] md:w-[30px] md:h-[30px] text-zinc-600 dark:text-zinc-300" />
                                            <h2 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[25px] text-zinc-600 dark:text-zinc-300">
                                                {quizTotMks} Total Marks
                                            </h2>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            isLoading0 ?
                                                (<div className="spinner size-1"></div>)
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
                                                                                You Are Blocked By Admin.
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )
                                                                :
                                                                (
                                                                    <>
                                                                        {
                                                                            alreadyPlayedByUser ?
                                                                                (
                                                                                    <div className="flex gap-x-[7px] md:gap-x-[10px] items-center justify-center">
                                                                                        <FaLock size={24} className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] text-theme-color-2" />
                                                                                        <div className="transition-all delay-75 font-noto_sans text-[16px] md:text-[20px] text-zinc-700 dark:text-zinc-300">
                                                                                            Locked
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                                :
                                                                                (
                                                                                    // <Link href={prtLink} title="Participate" className="transition-all delay-75 block w-full text-center px-[15px] py-[8px] md:px-[25px] md:py-[10px] font-ubuntu text-[18px] md:text-[20px] text-white bg-theme-color-1 hover:bg-theme-color-1-hover-dark"></Link>
                                                                                    <Link href={`/play-quiz/${qz_id}/${userID}`} title="Participate" className="transition-all delay-75 block w-full text-center px-[15px] py-[8px] md:px-[25px] md:py-[10px] font-ubuntu text-[18px] md:text-[20px] text-white bg-theme-color-1 hover:bg-theme-color-1-hover-dark">
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
                </div>
            </section>

            <QuizPrizes />

            <div className="transition-all delay-75 px-[15px] py-[100px] bg-zinc-100 dark:bg-zinc-900">
                <div className="site-container">
                    <div className="pb-[50px] md:pb-[50px]">
                        <h3 className="transition-all delay-75 font-noto_sans text-[25px] md:text-[30px] text-zinc-800 font-semibold dark:text-zinc-200">
                            Other Quizzes
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                        {
                            relatedQuizes.length > 0 ?
                                (
                                    <>
                                        {
                                            relatedQuizes.map((item) => (
                                                <QuizCard
                                                    key={item.quiz_id}
                                                    quiz_id={item.quiz_id}
                                                    quiz_title={item.quiz_title}
                                                    quiz_cover_photo={item.quiz_cover_photo}
                                                    quiz_categories={item.quiz_categories}
                                                    quiz_summary={item.quiz_summary}
                                                    quiz_total_question={item.quiz_total_question}
                                                    quiz_total_marks={item.quiz_total_marks}
                                                    quiz_display_time={item.quiz_display_time}
                                                    quiz_terms={item.quiz_terms}
                                                />
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
                                                        No Quizes Found.
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