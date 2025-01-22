import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface QF_Quiz_Pub_Quess {
    question_id: string,
    question_title: string,
    question_marks: number,
    question_options: string
}

interface QF_Quiz_Pub_QA {
    quiz_id: string,
    quiz_title: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_estimated_time: string,
    quiz_display_time: string,
    quiz_cover_photo: string,
    questions?: QF_Quiz_Pub_Quess[],
    negative_marking_score: number
}

interface Respo {
    success: boolean,
    message: string,
    quiz?: QF_Quiz_Pub_QA
}

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

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { quiz_id } = body;

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

                const qArrData: QF_Quiz_Pub_Quess[] = [];

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