'use client';

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_dark_mode, unset_dark_mode } from "@/app/libs/redux-service/slices/theme-mode/themeSwitcherSlice";
import Link from "next/link";
import Image from "next/image";
import { RootState } from "@/app/libs/redux-service/store";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { UserQuizGivenAns } from "@/app/types/pages/website/quizPlaygroundPageTypes";

export default function Page() {

    const params = useParams<{ quiz_id: string[] }>();
    const quiz_id = params.quiz_id[0];
    const user_id = params.quiz_id[1];
    const dispatch = useDispatch();
    const trqzdt = useSelector((state: RootState) => state.transfer_quiz_data);

    const [usrAnsw, setUserAnsw] = useState<UserQuizGivenAns[]>([]);

    const [qzId, setQzId] = useState<string>("");
    const [qzTitla, setQzTitle] = useState<string>("");
    const [qzCP, setQzCP] = useState<string>("");

    const [timeTaken, setTimeTaken] = useState<string>("00:00:00");
    const [estTime, setEstTime] = useState<string>("00:00:00");
    const [qdt, setQdt] = useState<string>('');
    const [totalMarks, setTotalMarks] = useState<number>(0);
    const [totalQues, setTotalQues] = useState<number>(0);

    const [correctAnswers, setCorectAnswers] = useState<number>(0);
    const [totalScore, setTotalScore] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
    const [isSubmited, setIsSubmited] = useState<boolean>(false);
    const [negScore, setNegScore] = useState<number>();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleScoreSubmissionClick = async () => {
        setIsSubmiting(true);
        const prepData = {
            quiz_id: qzId,
            quiz_title: qzTitla,
            quiz_cover_photo: qzCP,

            quiz_total_question: totalQues,
            quiz_total_marks: totalMarks,
            quiz_estimated_time: estTime,
            quiz_display_time: qdt,
            quiz_time_taken: timeTaken,

            quiz_correct_answers_count: correctAnswers,
            quiz_total_score: totalScore,
            user_id
        }
        if (trqzdt.attempted_data.length > 0) {

            const baseURI = window.location.origin;
            const resp = await fetch(`${baseURI}/api/site/submit-score`, {
                method: "POST",
                body: JSON.stringify(prepData)
            });
            const body = await resp.json();
            if (body.success) {
                setIsSubmited(true);
                Swal.fire({
                    title: "Success!",
                    text: body.message,
                    icon: "success",
                    timer: 3000
                });
            } else {
                setIsSubmiting(false);
                setIsSubmited(false);
                setIsLoading(false);
                Swal.fire({
                    title: "Error!",
                    text: body.message,
                    icon: "error",
                    timer: 3000
                });
            }
        } else {
            Swal.fire({
                title: "Error!",
                text: "No Data Found.",
                icon: "error",
                timer: 3000
            });
        }
    }

    const fireEvent = (el: any, eventName: string) => {
        const event = new Event(eventName, { bubbles: true });
        el.dispatchEvent(event);
    };

    const getScore = async (ugadtArr: UserQuizGivenAns[]) => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/get-score`, {
            method: "POST",
            body: JSON.stringify({ attempted_data: ugadtArr, quiz_id }),
        });
        const body = await resp.json();
        if (body.success) {
            setCorectAnswers(body.quiz_coorect_answers_count);
            console.log(negScore);
            if (timeTaken > estTime) {
                console.log("Going in If Before.");
                if (negScore) {
                    console.log("Going in If After.");
                    setTotalScore(body.quiz_total_score - negScore);
                    // handleScoreSubmissionClick();
                    const st = setTimeout(() => {
                        // handleScoreSubmissionClick();
                        fireEvent(buttonRef.current, "click");
                        clearTimeout(st);
                    }, 500);
                }
            } else {
                console.log("Going in else.");
                setTotalScore(body.quiz_total_score);
                // handleScoreSubmissionClick();
                const st = setTimeout(() => {
                    // handleScoreSubmissionClick();
                    fireEvent(buttonRef.current, "click");
                    clearTimeout(st);
                }, 500);
            }
            setIsLoading(false);

        }
    }

    useEffect(() => {

        const glsi = localStorage.getItem('site-dark-mode');
        const checkDM = glsi ? JSON.parse(glsi) : '';
        if (checkDM) {
            dispatch(set_dark_mode());
        } else {
            dispatch(unset_dark_mode());
        }

        // const ls_fiqdata = localStorage.getItem('transfer_quiz_data');
        // const prsfid = ls_fiqdata ? JSON.parse(ls_fiqdata) : '';
        // if(prsfid) {

        //     setQzId(prsfid.quiz_id);
        //     setQzCP(prsfid.quiz_cover_photo);
        //     setQzTitle(prsfid.quiz_title);

        //     setTotalQues(prsfid.quiz_total_question);
        //     setTimeTaken(prsfid.time_taken);
        //     setEstTime(prsfid.quiz_estimated_time);
        //     setQdt(prsfid.quiz_display_time);
        //     setTotalMarks(prsfid.quiz_total_marks);
        //     setNegScore(prsfid.negative_marking_score);

        //     setUserAnsw(prsfid.attempted_data);

        //     // setCorectAnswers(countCorrectAnswers(corrQAArr, usrAnsw).correct_answers);
        //     // setTotalScore(countCorrectAnswers(corrQAArr, usrAnsw).total_mark);
        // }

        if (trqzdt.attempted_data.length > 0) {
            setQzId(trqzdt.quiz_id);
            setQzCP(trqzdt.quiz_cover_photo);
            setQzTitle(trqzdt.quiz_title);

            setTotalQues(trqzdt.quiz_total_question);
            setTimeTaken(trqzdt.time_taken);
            setEstTime(trqzdt.quiz_estimated_time);
            setQdt(trqzdt.quiz_display_time);
            setTotalMarks(trqzdt.quiz_total_marks);
            setNegScore(trqzdt.negative_marking_score);

            setUserAnsw(trqzdt.attempted_data);
            // getScore(trqzdt.attempted_data);
        }

        if (trqzdt.attempted_data.length === 0) {
            const st = setTimeout(() => {

                setIsLoading(false);
                clearTimeout(st);
            }, 200);
        }

        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (trqzdt.attempted_data.length > 0) {
            // let st_22 = setTimeout(() => {
            getScore(trqzdt.attempted_data);
            // clearTimeout(st_22);
            // }, 1000);
        }
        // }, [qzTitla]);
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="transition-all delay-75 flex flex-col justify-center items-center px-[15px] py-[50px] min-h-screen bg-white dark:bg-zinc-950">
                <div className="w-full pb-[20px]">
                    <div className="text-center">
                        <Image src="/images/quizfesto-logo-final.svg" width={130} height={28} className="inline-block w-[130px] h-[28px]" alt="logo" />
                    </div>
                </div>
                <div className="w-full pb-[15px]">
                    <div className="w-full relative max-w-[800px] mx-auto py-[20px] px-[15px] border-[1px] border-solid border-zinc-400 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900">

                        {
                            isLoading ?
                                (
                                    <div className={`transition-all delay-75 absolute left-0 top-0 z-[5] bg-[rgba(255,255,255,0.90)] w-full h-full dark:bg-[rgba(9,9,11,0.95)] justify-center items-center flex`}>
                                        <div className="spinner"></div>
                                    </div>
                                )
                                :
                                ('')
                        }

                        <div className="pb-[0px] text-center">
                            <h1 className="transition-all delay-75 font-noto_sans text-[18px] md:text-[20px] font-semibold text-zinc-800 dark:text-zinc-300">
                                Your Score
                            </h1>
                        </div>
                        <div className="pb-[0px] text-center">
                            <h2 className="transition-all delay-75 font-noto_sans text-[30px] md:text-[40px] font-semibold text-zinc-900 dark:text-zinc-200">
                                {totalScore} / {totalMarks}
                            </h2>
                        </div>
                        <div className="pb-[10px] text-center">
                            <h3 className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-900 dark:text-zinc-200">
                                Time Taken : <span className={`${timeTaken > estTime ? 'text-red-500' : 'text-green-500'}`}>{timeTaken}</span> / <span>{estTime}</span>
                            </h3>
                        </div>

                        <div className="pb-[0px] text-center">
                            <h4 className="transition-all delay-75 font-noto_sans text-[18px] md:text-[20px] font-semibold text-zinc-600 dark:text-zinc-400">
                                You Answered <span>{correctAnswers}</span> questions correctly.
                            </h4>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="w-full max-w-[800px] mx-auto py-[20px] px-[15px]">
                        <div className="pb-[15px] text-center">
                            <p className="transition-all delay-75 font-ubuntu text-[14px] md:text-[16px] text-[#ff0000] font-bold">
                                {`Don't refresh or press back button of this page otherwise you will loose quiz data played by you.`}
                            </p>
                        </div>
                        <div className="pb-[15px] text-center">
                            <h5 className="transition-all delay-75 font-ubuntu text-[12px] font-semibold md:text-[14px] text-zinc-500 dark:text-zinc-500">
                                Your Score Will Be Saved Automatically.
                            </h5>
                        </div>

                        <div className="flex flex-wrap gap-[15px] justify-center">
                            {
                                isSubmiting ?
                                    (
                                        <>
                                            {
                                                isSubmited ?
                                                    ("")
                                                    :
                                                    (
                                                        <div>
                                                            <div className="spinner"></div>
                                                        </div>
                                                    )
                                            }
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            {
                                                trqzdt.attempted_data.length > 0 && isLoading === false ?
                                                    (
                                                        <div className="hidden">
                                                            <button
                                                                type="button"
                                                                title="Submit Score"
                                                                className="inline-block transition-all delay-75 border-[2px] border-solid border-theme-color-1 text-white bg-theme-color-1 py-[8px] md:py-[10px] px-[20px] md:px-[25px] rounded-full font-ubuntu font-semibold text-[16px] md:text-[18px] hover:bg-theme-color-1-hover-dark hover:text-white"
                                                                ref={buttonRef}
                                                                onClick={handleScoreSubmissionClick}
                                                            >
                                                                Submit Score
                                                            </button>
                                                        </div>
                                                    )
                                                    :
                                                    ('')
                                            }
                                        </>
                                    )
                            }
                            <div>
                                <Link href="/all-quizzes" title="Play Another Quiz" className="inline-block transition-all delay-75 border-[2px] border-solid border-theme-color-2 text-theme-color-2 py-[8px] md:py-[10px] px-[20px] md:px-[25px] rounded-full font-ubuntu font-semibold text-[16px] md:text-[18px] hover:bg-theme-color-2 hover:text-white">
                                    Play Another Quiz
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}