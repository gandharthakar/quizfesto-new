import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface MyPartCrd {
    user_participation_id: string,
    quiz_title: string,
    quiz_cover_photo: string,
    quiz_display_time: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_estimated_time: string,
    quiz_time_taken: string,
    quiz_correct_answers_count: number,
    quiz_total_score: number
}

interface Respo {
    success: boolean,
    message: string,
    participation_data?: MyPartCrd[]
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { user_id } = body;

        if (user_id) {
            const usrPart = await prisma.qF_User_Participation.findMany({
                where: {
                    user_id
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (usrPart.length > 0) {
                sts = 200;
                resp = {
                    success: true,
                    message: "Data Found!",
                    participation_data: usrPart.map((item) => {
                        return {
                            user_participation_id: item.user_participation_id,
                            quiz_title: item.quiz_title,
                            quiz_cover_photo: item.quiz_cover_photo ?? "",
                            quiz_display_time: item.quiz_display_time,
                            quiz_total_question: item.quiz_total_question,
                            quiz_total_marks: item.quiz_total_marks,
                            quiz_estimated_time: item.quiz_estimated_time,
                            quiz_time_taken: item.quiz_time_taken,
                            quiz_correct_answers_count: item.quiz_correct_answers_count,
                            quiz_total_score: item.quiz_total_score
                        }
                    })
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Data Not Found!",
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