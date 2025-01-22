import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface Respo {
    success: boolean,
    message: string
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { question_id, quiz_id, question_title, question_marks } = body;

        if (question_id && quiz_id && question_title && question_marks) {
            const existingQuestion = await prisma.qF_Question.findFirst({
                where: {
                    question_id
                }
            });

            if (existingQuestion !== null) {
                await prisma.qF_Question.update({
                    where: {
                        question_id
                    },
                    data: {
                        quizid: quiz_id,
                        question_title,
                        question_marks
                    }
                });
                sts = 200;
                resp = {
                    success: true,
                    message: "Question Updated Successfully!"
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Question Not Found!",
                }
            }
        } else {
            sts = 400;
            resp = {
                success: false,
                message: "Missing Required Fields!"
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