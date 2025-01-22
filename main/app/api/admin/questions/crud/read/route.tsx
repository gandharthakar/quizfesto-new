import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface QF_Ques {
    question_id: string,
    question_title: string,
    question_marks: number,
    quiz_id: string
}

interface Respo {
    success: boolean,
    message: string,
    question: QF_Ques
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: '',
        question: {
            question_id: '',
            question_title: '',
            question_marks: 0,
            quiz_id: ''
        }
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { question_id } = body;

        if (question_id) {
            const existingQuestion = await prisma.qF_Question.findFirst({
                where: {
                    question_id
                }
            });
            if (existingQuestion !== null) {
                sts = 200;
                resp = {
                    success: true,
                    message: "Question Found!",
                    question: {
                        question_id: existingQuestion.question_id,
                        question_title: existingQuestion.question_title,
                        question_marks: existingQuestion.question_marks,
                        quiz_id: existingQuestion.quizid
                    }
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Question Not Found!",
                    question: {
                        question_id: '',
                        question_title: '',
                        question_marks: 0,
                        quiz_id: ''
                    }
                }
            }

        } else {
            sts = 400;
            resp = {
                success: false,
                message: "Missing Required Fields!",
                question: {
                    question_id: '',
                    question_title: '',
                    question_marks: 0,
                    quiz_id: ''
                }
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message,
            question: {
                question_id: '',
                question_title: '',
                question_marks: 0,
                quiz_id: ''
            }
        }
        return NextResponse.json(resp, { status: sts });
    }
}