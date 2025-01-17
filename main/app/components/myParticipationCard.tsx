'use client';

import Image from "next/image";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { PiExamFill } from "react-icons/pi";
import { RiQuestionFill } from "react-icons/ri";
import { MyParticipationCardType } from "@/app/types/components/website/componentsTypes";
import { getClassOfTimeTaken } from "@/app/libs/helpers/helperFunctions";

function MyParticipationCard(props: MyParticipationCardType) {

    const {
        quiz_title,
        quiz_cover_photo,
        quiz_display_time,
        quiz_total_question,
        quiz_total_marks,
        quiz_estimated_time,
        quiz_time_taken,
        quiz_correct_answers_count,
        quiz_total_score,
    } = props;

    const defaultImage = "https://placehold.co/1000x700/png";

    return (
        <>
            <div className="transition-all delay-75 border-[2px] border-solid p-[15px] border-zinc-300 bg-white hover:border-zinc-600 dark:bg-zinc-800 dark:border-zinc-600 dark:hover:border-zinc-400">
                <div className="flex gap-x-[20px] gap-y-[10px] items-center flex-col md:flex-row">
                    <div className="w-full md:max-w-[200px]">
                        <Image src={quiz_cover_photo ? quiz_cover_photo : defaultImage} width={1000} height={700} className="w-full h-auto" alt="Photo" priority={true} />
                    </div>
                    <div className="md:mr-auto w-full md:w-auto">
                        <div className="pb-[5px] md:pb-[2px]">
                            <h1 className="transition-all delay-75 font-ubuntu text-[20px] md:text-[22px] font-semibold text-zinc-700 dark:text-zinc-200">
                                {quiz_title}
                            </h1>
                        </div>
                        <div className="pb-[5px]">
                            <div className="flex flex-wrap gap-y-[5px] gap-x-[15px] items-center">
                                <div className="flex gap-x-[2px] md:gap-x-[3px] items-center">
                                    <MdOutlineAccessTimeFilled size={20} className="transition-all delay-75 w-[18px] h-[18px] md:w-[20px] md:h-[20px] text-zinc-600 dark:text-zinc-300" />
                                    <h2 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[18px] text-zinc-600 dark:text-zinc-300">
                                        {quiz_display_time}
                                    </h2>
                                </div>
                                <div className="flex gap-x-[2px] md:gap-x-[3px] items-center">
                                    <RiQuestionFill size={20} className="transition-all delay-75 w-[18px] h-[18px] md:w-[20px] md:h-[20px] text-zinc-600 dark:text-zinc-300" />
                                    <h4 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[18px] text-zinc-600 dark:text-zinc-300">
                                        {quiz_total_question} Questions
                                    </h4>
                                </div>
                                <div className="flex gap-x-[2px] md:gap-x-[3px] items-center">
                                    <PiExamFill size={20} className="transition-all delay-75 w-[18px] h-[18px] md:w-[20px] md:h-[20px] text-zinc-600 dark:text-zinc-300" />
                                    <h5 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[18px] text-zinc-600 dark:text-zinc-300">
                                        Total Marks Is {quiz_total_marks}
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className="pb-[5px]">
                            <div className="flex gap-x-[2px] md:gap-x-[3px] items-center">
                                <MdOutlineAccessTimeFilled size={20} className="transition-all delay-75 w-[18px] h-[18px] md:w-[20px] md:h-[20px] text-zinc-600 dark:text-zinc-300" />
                                <h3 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[18px] text-zinc-600 dark:text-zinc-300">
                                    Time Taken : <span className={`${getClassOfTimeTaken(quiz_estimated_time, quiz_time_taken)}`}>{quiz_time_taken}</span> / {quiz_estimated_time}
                                </h3>
                            </div>
                        </div>
                        <div className="">
                            <h3 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[18px] text-zinc-600 dark:text-zinc-300">
                                You Answered <span className="font-semibold">{quiz_correct_answers_count}</span> questions correctly.
                            </h3>
                        </div>
                    </div>
                    <div className="md:min-w-[120px] w-full md:w-auto">
                        <div className="md:text-center">
                            <h5 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[18px] text-zinc-900 dark:text-zinc-400">
                                Your Score
                            </h5>
                        </div>
                        <div className="md:text-center">
                            <h5 className="transition-all delay-75 font-ubuntu text-[18px] md:text-[22px] font-semibold text-zinc-900 dark:text-zinc-200">
                                {quiz_total_score} / {quiz_total_marks}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyParticipationCard;