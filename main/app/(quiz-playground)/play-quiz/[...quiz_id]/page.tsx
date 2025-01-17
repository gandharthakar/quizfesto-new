'use client';

import { set_dark_mode, unset_dark_mode } from "@/app/libs/redux-service/slices/theme-mode/themeSwitcherSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useStopwatch } from "react-timer-hook";
import { FaClock } from "react-icons/fa6";
// import { IoIosCheckmarkCircle } from "react-icons/io";
import QuizInfoModal from "@/app/components/quizInfomodal";
import { useRouter, useParams } from "next/navigation";
// import { dump_quiz_data } from "@/app/constant/datafaker";
// import { clear_tqd, set_tqd } from "@/app/redux-service/slices/quiz-playground/transferQuizDataslice";
import Image from "next/image";
import Swal from "sweetalert2";
import Link from "next/link";
import { IoIosWarning } from "react-icons/io";
import { QuizQAType, QuizQuestionType, UserQuizGivenAns } from "@/app/types/pages/website/quizPlaygroundPageTypes";
import { shuffle_array } from "@/app/libs/helpers/helperFunctions";
// import { RootState } from "@/app/redux-service/store";
// import { useSelector } from "react-redux";

/* eslint-disable no-unused-vars */
let currentQuestionIndex: number = 0;
//eslint-disable-next-line
let atm_data: UserQuizGivenAns[] = [];

export default function Page() {

    // console.log("comp re-render.");
    const router = useRouter();
    const params = useParams<{ quiz_id: string[] }>();
    const quiz_id = params.quiz_id[0];
    const user_id = params.quiz_id[1];
    const dispatch = useDispatch();
    const { hours, minutes, seconds, start, pause } = useStopwatch({ autoStart: false })
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

    const [currentQuestionCount, setCurrentQuestionCount] = useState<number>(1);
    // const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [totalMarks, setTotalMarks] = useState<number>(0);
    const [quizEstTime, setQuizEstTime] = useState<string>("00:00:00");
    const [quizDispTime, setQuizDispTime] = useState<string>("");
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [isFinishing, setIsFinishing] = useState<boolean>(false);

    const [quesData, setQuesData] = useState<QuizQAType>({
        quiz_id: '',
        quiz_title: '',
        quiz_cover_photo: '',
        quiz_display_time: '',
        quiz_estimated_time: '',
        quiz_total_marks: 0,
        quiz_total_question: 0,
        questions: []
    });
    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestionType>({
        question_id: '',
        question_title: '',
        question_marks: 0,
    });
    const [currentQuestionMarks, setCurrentQuestionMarks] = useState<number>(0);
    const [currentQuestionOptions, setCurrentQuestionOptions] = useState<string[]>([]);
    const [timing, setTiming] = useState<string>('');
    const [negScore, setNegScore] = useState<number>();
    const [isAdminBlockedYou, setIsAdminBlockedYou] = useState<boolean>(false);

    // Submit Score
    const [showScoreUI, setShowScoreUI] = useState<boolean>(false);

    const [usrAnsw_ss, setUserAnsw_ss] = useState<UserQuizGivenAns[]>([]);

    const [qzId_ss, setQzId_ss] = useState<string>("");
    const [qzTitla_ss, setQzTitle_ss] = useState<string>("");
    const [qzCP_ss, setQzCP_ss] = useState<string>("");

    const [timeTaken_ss, setTimeTaken_ss] = useState<string>("00:00:00");
    const [estTime_ss, setEstTime_ss] = useState<string>("00:00:00");
    const [qdt_ss, setQdt_ss] = useState<string>('');
    const [totalMarks_ss, setTotalMarks_ss] = useState<number>(0);
    const [totalQues_ss, setTotalQues_ss] = useState<number>(0);

    const [correctAnswers_ss, setCorectAnswers_ss] = useState<number>(0);
    const [totalScore_ss, setTotalScore_ss] = useState<number>(0);

    const [isLoading_ss, setIsLoading_ss] = useState<boolean>(true);
    // const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
    const [isSubmited, setIsSubmited] = useState<boolean>(false);
    const [negScore_ss, setNegScore_ss] = useState<number>(0);

    const CreateRadioButton = (opt_id: string, opt_txt: string, sa: string, ch: any) => {
        return (
            <>
                <input
                    type="radio"
                    name="answer_option"
                    id={opt_id}
                    className="radio-btn"
                    value={opt_txt}
                    checked={sa === opt_txt}
                    onChange={ch}
                />
                <label htmlFor={opt_id} role="button" title="Option 1" className="option-btn">
                    <div className="check-round">
                        {/* <IoIosCheckmarkCircle size={20} className="tick-icon" /> */}
                        <div className="tick-icon"></div>
                    </div>
                    <div>
                        {opt_txt}
                    </div>
                </label>
            </>
        )
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAnswer(event.target.value);
        setIsError(false);
    };

    const Radio = useMemo(() => {
        return currentQuestionOptions.map((itm, idx) => (<li key={idx}>{CreateRadioButton(idx.toString(), itm, selectedAnswer, handleChange)}</li>));
    }, [currentQuestionOptions, selectedAnswer]);

    const handleScoreSubmissionClick = async (data: any, cac: number, ts: number) => {
        setIsLoading_ss(true);
        const prepData = {
            quiz_id: data.quiz_id,
            quiz_title: data.quiz_title,
            quiz_cover_photo: data.quiz_cover_photo,

            quiz_total_question: data.quiz_total_question,
            quiz_total_marks: data.quiz_total_marks,
            quiz_estimated_time: data.quiz_estimated_time,
            quiz_display_time: data.quiz_display_time,
            quiz_time_taken: data.quiz_time_taken,

            quiz_correct_answers_count: cac,
            quiz_total_score: ts,
            user_id: data.user_id
        }
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/submit-score`, {
            method: "POST",
            body: JSON.stringify(prepData)
        });
        const body = await resp.json();
        if (body.success) {
            setIsSubmited(true);
            setIsLoading_ss(false);
            Swal.fire({
                title: "Success!",
                text: body.message,
                icon: "success",
                timer: 3000
            });
        } else {
            setIsSubmited(true);
            setIsLoading_ss(false);
            Swal.fire({
                title: "Error!",
                text: body.message,
                icon: "error",
                timer: 3000
            });
        }
    }

    const handleClick = async (e: any) => {
        e.preventDefault();

        /* eslint-disable no-unused-vars */
        let isValidForm: boolean = false;
        setIsError(true);

        if (selectedAnswer == '') {
            isValidForm = false;
        } else {
            isValidForm = true;
        }

        if (isValidForm) {
            setIsError(false);
            if (currentQuestionIndex < (totalQuestions - 1)) {
                // setCurrentQuestionIndex((prevCount) => prevCount === 0 ? 1 : prevCount + 1);
                currentQuestionIndex++;
            }

            setCurrentQuestionCount((itm) => {
                return itm < totalQuestions ? itm + 1 : itm;
            });
            setCurrentQuestion(() => {
                return {
                    question_id: quesData.questions[currentQuestionIndex].question_id,
                    question_title: quesData.questions[currentQuestionIndex].question_title,
                    question_marks: quesData.questions[currentQuestionIndex].question_marks,
                }
            });
            setCurrentQuestionMarks(quesData.questions[currentQuestionIndex].question_marks);
            setCurrentQuestionOptions(shuffle_array(quesData.questions[currentQuestionIndex].question_options.split(", ") ?? []));

            const obj = {
                question_id: currentQuestion.question_id,
                user_choosen_option: selectedAnswer,
                question_marks: currentQuestion.question_marks
            }
            atm_data.push(obj);

            if (currentQuestionCount === totalQuestions) {
                pause();
                // router.push(`/submit-score/${quiz_id}/${user_id}`);
                setIsFinishing(true);
                const prepData = {
                    quiz_id: quiz_id,
                    quiz_title: quesData.quiz_title,
                    quiz_cover_photo: quesData.quiz_cover_photo,

                    quiz_total_question: quesData.quiz_total_question,
                    quiz_total_marks: totalMarks,
                    quiz_estimated_time: quizEstTime,
                    quiz_display_time: quizDispTime,
                    quiz_time_taken: timing,

                    user_id
                    //negative_marking_score: negScore,

                    //attempted_data: atm_data,
                }

                setUserAnsw_ss(atm_data);
                setQzId_ss(quiz_id);
                setQzTitle_ss(quesData.quiz_title);
                setQzCP_ss(quesData.quiz_cover_photo);

                setTimeTaken_ss(timing);
                setEstTime_ss(quizEstTime);
                setQdt_ss(quizDispTime);
                setTotalMarks_ss(totalMarks);
                setTotalQues_ss(quesData.quiz_total_question);

                setShowScoreUI(true);
                // let temp_ls_dt = localStorage.getItem('transfer_quiz_data');
                // if(temp_ls_dt) {
                //     localStorage.removeItem('transfer_quiz_data');
                //     localStorage.setItem('transfer_quiz_data', JSON.stringify(prepData));
                // } else {
                //     localStorage.setItem('transfer_quiz_data', JSON.stringify(prepData));
                // }
                // dispatch(clear_tqd());
                // dispatch(set_tqd(prepData));

                const baseURI = window.location.origin;
                const resp = await fetch(`${baseURI}/api/site/get-score`, {
                    method: "POST",
                    body: JSON.stringify({ attempted_data: atm_data, quiz_id }),
                    cache: 'no-store',
                    next: { revalidate: 60 }
                });
                const body = await resp.json();
                if (body.success) {
                    setCorectAnswers_ss(body.quiz_coorect_answers_count);
                    if (timing > quizEstTime) {
                        if (negScore_ss) {
                            const totScore = body.quiz_total_score - negScore_ss;
                            const dinScore = totScore == -100 ? 0 : totScore;
                            setTotalScore_ss(dinScore);
                            await handleScoreSubmissionClick(prepData, body.quiz_coorect_answers_count, dinScore);
                        }
                    } else {
                        setTotalScore_ss(body.quiz_total_score);
                        await handleScoreSubmissionClick(prepData, body.quiz_coorect_answers_count, body.quiz_total_score);
                    }
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: body.message,
                        icon: "error",
                        timer: 3000
                    });
                }
            } else {
                // Reset Radio Buttons.
                setSelectedAnswer('');
            }
        }
    }

    const hideModalOnClick = () => {
        setShowInfoModal(false);
        start();
    }

    const getQuizQuestions = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/get-quizes/single/only-questions`, {
            method: "POST",
            body: JSON.stringify({ quiz_id }),
        });
        const body = await resp.json();
        if (body.success) {
            setIsLoading(false);
            setTotalQuestions(body.quiz.quiz_total_question);
            setTotalMarks(body.quiz.quiz_total_marks);
            setQuizEstTime(body.quiz.quiz_estimated_time);
            setQuizDispTime(body.quiz.quiz_display_time);
            setQuesData(body.quiz);
            setNegScore(body.quiz.negative_marking_score);
            setNegScore_ss(body.quiz.negative_marking_score);
            const ques = shuffle_array(body.quiz.questions);
            setCurrentQuestion(() => {
                return {
                    question_id: ques[currentQuestionIndex].question_id ?? "",
                    question_title: ques[currentQuestionIndex].question_title ?? "",
                    question_marks: ques[currentQuestionIndex].question_marks ?? 0
                }
            })
            setCurrentQuestionMarks(ques[currentQuestionIndex].question_marks ?? 0);
            setCurrentQuestionOptions(shuffle_array(ques[currentQuestionIndex].question_options.split(", ") ?? []));
        } else {
            setIsLoading(false);
        }
    }

    const checkIfBlock = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/check-block-status`, {
            method: "POST",
            body: JSON.stringify({ user_id }),
        });
        const body = await resp.json();
        if (body.success) {
            if (body.user_block_status == "true") {
                setIsAdminBlockedYou(true);
            } else {
                getQuizQuestions();
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
        checkIfBlock();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        const glsi = localStorage.getItem('site-dark-mode');
        const checkDM = glsi ? JSON.parse(glsi) : '';
        if (checkDM) {
            dispatch(set_dark_mode());
        } else {
            dispatch(unset_dark_mode());
        }

        // let temp_ls_dt = localStorage.getItem('transfer_quiz_data');
        // if(!temp_ls_dt) {
        //     localStorage.setItem('transfer_quiz_data', JSON.stringify({}));
        // }

        setTiming(`${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`);


    }, [hours, minutes, seconds, setTiming, dispatch]);

    // const AuthUser = useSelector((state: RootState) => state.auth_user_id);
    // useEffect(() => {
    //     if(!AuthUser) {

    //     } else {
    //         router.push("/sign-in");
    //     }
    // //eslint-disable-next-line
    // }, []);

    return (
        <>
            {
                isAdminBlockedYou ?
                    (
                        <>
                            <div className="flex flex-col items-center justify-center px-[20px] py-[50px] min-h-screen">
                                <div className="pb-[10px]">
                                    <div className="flex items-center gap-x-[10px]">
                                        <IoIosWarning size={30} className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-red-600" />
                                        <div className="transition-all delay-75 font-noto_sans text-[18px] md:text-[20px] text-red-600 font-semibold">Alert</div>
                                        <IoIosWarning size={30} className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-red-600" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h1 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[18px] font-semibold text-red-600">
                                        Admin Blocked you for participating in quizes
                                    </h1>
                                </div>
                            </div>
                        </>
                    )
                    :
                    (
                        <>
                            <QuizInfoModal
                                open_modal_on_page_load={true}
                                modal_heading="Quiz Instructions"
                                backdrop={true}
                                hide_modal_on_backdrop_click={true}
                                modal_max_width={400}
                                openState={showInfoModal}
                                setOpenState={setShowInfoModal}
                                callBackAfterModalClose={start}
                            >
                                <div className="px-[20px] md:px-[25px] py-[20px]">
                                    <ul className="flex flex-col gap-y-[15px] list-disc pl-[15px] md:pl-[20px]">
                                        <li className="transition-all delay-75 w-full font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-300">
                                            Do not refresh page while opting / playing quiz because if you refresh the page you will loose everything and quiz will start from begin.
                                        </li>
                                        <li className="transition-all delay-75 w-full font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-300">
                                            Do not press back button while opting / playing quiz because if you press the back button then you will loose everything and quiz will start from begin.
                                        </li>
                                        <li className="transition-all delay-75 w-full font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-300">
                                            Just opt / play full quiz without hesitating about score you will get score at the end of the quiz.
                                        </li>
                                    </ul>

                                    <div className="pt-[20px]">
                                        <button
                                            type="button"
                                            title="Ok I Understood"
                                            className="transition-all delay-75 w-full py-[10px] px-[15px] font-noto_sans text-[16px] font-semibold text-white bg-theme-color-1 hover:bg-theme-color-1-hover-dark"
                                            onClick={hideModalOnClick}
                                        >
                                            Ok I Understood
                                        </button>
                                    </div>
                                </div>
                            </QuizInfoModal>
                            {
                                !showScoreUI ?
                                    (
                                        <div className="transition-all delay-75 px-[15px] py-[50px] min-h-screen bg-white dark:bg-zinc-950">
                                            <form onSubmit={handleClick}>
                                                <div className="relative flex flex-col justify-center items-start border-[1px] border-solid border-zinc-400 w-full min-h-[calc(100vh-100px)] max-w-[800px] mx-auto dark:border-zinc-600">
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
                                                    <div className="py-[10px] md:py-[25px] px-[15px] md:px-[30px] flex justify-between items-center gap-x-[20px] border-b-[1px] border-solid border-zinc-400 bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-600 w-full">
                                                        <h1 className="transition-all delay-75 font-noto_sans text-[16px] md:text-[25px] text-zinc-800 font-bold dark:text-zinc-300">
                                                            Quiz Playground
                                                        </h1>
                                                        <div>
                                                            <div className="transition-all delay-75 flex gap-x-[8px] items-center font-noto_sans text-zinc-800 text-[14px] md:text-[16px] font-semibold bg-white py-[5px] px-[8px] dark:bg-zinc-950 dark:text-zinc-300">
                                                                <FaClock size={20} className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] text-theme-color-2" />
                                                                <div>
                                                                    {`${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`}
                                                                </div>
                                                            </div>
                                                            <input type="hidden" value={`${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`} />
                                                        </div>
                                                    </div>
                                                    <div className="h-[4px] concard" style={{ width: `${(currentQuestionCount / totalQuestions) * 100}%` }}></div>
                                                    <div className="py-[25px] md:py-[50px] px-[15px] md:px-[30px] w-full">
                                                        <div className="pb-[15px] md:pb-[25px]">
                                                            <h2 className="transition-all delay-75 font-noto_sans text-[20px] md:text-[25px] text-zinc-800 font-semibold dark:text-zinc-300">
                                                                {currentQuestion.question_title}
                                                            </h2>
                                                        </div>
                                                        <div className="pb-[15px]">
                                                            <ul className="quizques-options-list">
                                                                {Radio}
                                                                {/* {
                                                            currentQuestionOptions.map((itm, idx) => (
                                                                // <li key={idx}>
                                                                //     <input type="radio" id={idx.toString()} value={itm} />
                                                                //     <label htmlFor={idx.toString()}>itm</label>
                                                                // </li>
                                                                <li key={idx}>
                                                                    <input 
                                                                        type="radio" 
                                                                        name="answer_option" 
                                                                        id={idx.toString()} 
                                                                        className="radio-btn" 
                                                                        value={itm} 
                                                                        checked={selectedAnswer === itm}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <label htmlFor={idx.toString()} role="button" title="Option 1" className="option-btn">
                                                                        <div className="check-round">
                                                                            <IoIosCheckmarkCircle size={20} className="tick-icon" />
                                                                        </div>
                                                                        <div>
                                                                            {itm}
                                                                        </div>
                                                                    </label>
                                                                </li>
                                                            ))
                                                        } */}
                                                                {/* <li>
                                                            <input type="radio" name="answer_option" id="opt2" className="radio-btn" value={`Option 2`} />
                                                            <label htmlFor="opt2" role="button" title="Option 2" className="option-btn">
                                                                <div className="check-round">
                                                                    <IoIosCheckmarkCircle size={20} className="tick-icon" />
                                                                </div>
                                                                <div>
                                                                    Option 2
                                                                </div>
                                                            </label>
                                                        </li>
                                                        <li>
                                                            <input type="radio" name="answer_option" id="opt3" className="radio-btn" value={`Option 3`} />
                                                            <label htmlFor="opt3" role="button" title="Option 3" className="option-btn">
                                                                <div className="check-round">
                                                                    <IoIosCheckmarkCircle size={20} className="tick-icon" />
                                                                </div>
                                                                <div>
                                                                    Option 3
                                                                </div>
                                                            </label>
                                                        </li>
                                                        <li>
                                                            <input type="radio" name="answer_option" id="opt4" className="radio-btn" value={`Option 4`} />
                                                            <label htmlFor="opt4" role="button" title="Option 4" className="option-btn">
                                                                <div className="check-round">
                                                                    <IoIosCheckmarkCircle size={20} className="tick-icon" />
                                                                </div>
                                                                <div>
                                                                    Option 4
                                                                </div>
                                                            </label>
                                                        </li> */}
                                                            </ul>
                                                        </div>
                                                        <div className="pb-[10px]">
                                                            <p className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-300">
                                                                Marks : {currentQuestionMarks}
                                                            </p>
                                                        </div>
                                                        {isError && (<div className="ws-input-error">Please Select One Option.</div>)}
                                                    </div>
                                                    <div className="mt-auto py-[15px] md:py-[25px] px-[15px] md:px-[30px] flex justify-between items-center gap-x-[20px] border-t-[1px] border-solid border-zinc-400 bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-600 w-full">
                                                        <h6 className="transition-all delay-75 font-noto_sans text-[16px] md:text-[18px] text-zinc-800 font-semibold dark:text-zinc-300">
                                                            {currentQuestionCount} / {totalQuestions}
                                                        </h6>

                                                        <div className="">
                                                            {
                                                                isFinishing ?
                                                                    (
                                                                        <div className="transition-all delay-75 inline-block font-noto_sans text-[14px] md:text-[16px] text-zinc-600 dark:text-zinc-400">Finishing ...</div>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button
                                                                            title="Next"
                                                                            type="submit"
                                                                            className="transition-all delay-75 font-noto_sans font-semibold text-[16px] md:text-[18px] bg-theme-color-1 hover:bg-theme-color-1 text-white px-[15px] md:px-[15px] py-[8px] md:py-[10px]"
                                                                        >
                                                                            {currentQuestionIndex === (totalQuestions - 1) ? 'Finish' : 'Next'}
                                                                        </button>
                                                                    )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )
                                    :
                                    (
                                        <div className="transition-all delay-75 flex flex-col justify-center items-center px-[15px] py-[50px] min-h-screen bg-white dark:bg-zinc-950">
                                            <div className="w-full pb-[20px]">
                                                <div className="text-center">
                                                    <Image src="/images/quizfesto-logo-final.svg" width={130} height={28} className="inline-block w-[130px] h-[28px]" alt="logo" />
                                                </div>
                                            </div>
                                            <div className="w-full pb-[15px]">
                                                <div className="w-full relative max-w-[800px] mx-auto py-[20px] px-[15px] border-[1px] border-solid border-zinc-400 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900">

                                                    {
                                                        isLoading_ss ?
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
                                                            {totalScore_ss} / {totalMarks}
                                                        </h2>
                                                    </div>
                                                    <div className="pb-[10px] text-center">
                                                        <h3 className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-900 dark:text-zinc-200">
                                                            Time Taken : <span className={`${timeTaken_ss > estTime_ss ? 'text-red-500' : 'text-green-500'}`}>{timeTaken_ss}</span> / <span>{estTime_ss}</span>
                                                        </h3>
                                                    </div>

                                                    <div className="pb-[0px] text-center">
                                                        <h4 className="transition-all delay-75 font-noto_sans text-[18px] md:text-[20px] font-semibold text-zinc-600 dark:text-zinc-400">
                                                            You Answered <span>{correctAnswers_ss}</span> questions correctly.
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
                                                            isSubmited ?
                                                                (
                                                                    <Link href="/all-quizzes" title="Play Another Quiz" className="inline-block transition-all delay-75 border-[2px] border-solid border-theme-color-2 text-theme-color-2 py-[8px] md:py-[10px] px-[20px] md:px-[25px] rounded-full font-ubuntu font-semibold text-[16px] md:text-[18px] hover:bg-theme-color-2 hover:text-white">
                                                                        Play Another Quiz
                                                                    </Link>
                                                                )
                                                                :
                                                                ("")
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                            }
                        </>
                    )
            }
        </>
    )
}