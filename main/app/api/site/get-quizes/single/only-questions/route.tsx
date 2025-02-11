import prisma from "@/app/libs/db";
import { CommonAPIResponse } from "@/app/types/commonTypes";
import { QF_pUBGetQuizQuesDataType, QF_PUBQuessDataType } from "@/app/types/libs/tanstack-query/website/websiteCommonTypes";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import { sanitize } from "@/app/libs/sanitize";

const getOptions = async (qid: string) => {
    const qdata = await prisma.qF_Option.findFirst({
        where: {
            questionid: qid
        },
        select: {
            options: true
        }
    });
    return qdata?.options.join(", ");
}

export async function GET(req: NextRequest) {
    let resp: (CommonAPIResponse & { quiz?: QF_pUBGetQuizQuesDataType }) = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        const searchParams = req.nextUrl.searchParams;
        const quiz_id = sanitize(searchParams.get('quiz_id'));
        // const body = await req.json();
        // const { quiz_id } = body;

        if (quiz_id) {

            const data = await prisma.qF_Quiz.findFirst({
                where: {
                    quiz_id
                }
            });

            if (data !== null) {
                const ques_ids = await prisma.qF_Question.findMany({
                    where: {
                        quizid: quiz_id
                    }
                });

                const qArrData: QF_PUBQuessDataType[] = [];

                for (let i = 0; i < ques_ids.length; i++) {
                    const obj = {
                        question_id: ques_ids[i].question_id,
                        question_title: ques_ids[i].question_title,
                        question_marks: ques_ids[i].question_marks,
                        question_options: await getOptions(ques_ids[i].question_id) ?? ""
                    }
                    qArrData.push(obj);
                }
                sts = 200;
                resp = {
                    success: true,
                    message: "Quiz Found!",
                    quiz: {
                        quiz_id: data.quiz_id,
                        quiz_title: data.quiz_title,
                        quiz_display_time: data.quiz_display_time,
                        quiz_estimated_time: data.quiz_estimated_time,
                        quiz_total_marks: data.quiz_total_marks,
                        quiz_total_question: data.quiz_total_question,
                        questions: qArrData,
                        quiz_cover_photo: data.quiz_cover_photo ?? "",
                        negative_marking_score: data.negative_marking_score
                    }
                }
                // console.log(await getQuestions([]));
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Quiz Not Found!",
                }
            }

        } else {
            sts = 400;
            resp = {
                success: false,
                message: "Missing required fields.",
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message
        }
        return NextResponse.json(resp, { status: sts });
    }
}