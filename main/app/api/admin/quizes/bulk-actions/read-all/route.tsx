import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface qF_Quiz {
    quiz_id: string,
    quiz_title: string,
    quiz_status: string,
    total_questions: number,
}

interface Respo {
    success: boolean,
    message: string,
    quizes: qF_Quiz[]
}

export async function GET() {
    let resp: Respo = {
        success: false,
        message: '',
        quizes: []
    }

    let sts: number = 400;

    try {

        const data = await prisma.qF_Quiz.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (data.length > 0) {
            sts = 200;
            resp = {
                success: true,
                message: "Quizes Deleted Successfully!",
                quizes: data.map((item) => {
                    return {
                        quiz_id: item.quiz_id,
                        quiz_title: item.quiz_title,
                        quiz_status: item.quiz_status,
                        total_questions: item.quiz_total_question
                    }
                })
            }
        } else {
            sts = 200;
            resp = {
                success: false,
                message: "No Quizes Found!",
                quizes: []
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message,
            quizes: []
        }
        return NextResponse.json(resp, { status: sts });
    }
}