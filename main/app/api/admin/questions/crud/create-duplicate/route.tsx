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
        const { question_id } = body;

        if (question_id) {
            const existingQues = await prisma.qF_Question.findFirst({
                where: {
                    question_id
                }
            });
            if (existingQues !== null) {
                await prisma.qF_Question.create({
                    data: {
                        quizid: existingQues.quizid,
                        question_title: existingQues.question_title,
                        question_marks: existingQues.question_marks
                    }
                });
                sts = 201;
                resp = {
                    success: true,
                    message: "Duplicate Question Created Successfully!"
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Question Not Exist!"
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