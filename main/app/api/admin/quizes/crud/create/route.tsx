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
        const {
            quiz_title,
            quiz_summary,
            quiz_display_time,
            quiz_estimated_time,
            quiz_total_question,
            quiz_total_marks,
            quiz_status,
            quiz_about_text,
            quiz_terms,
            quiz_categories,
            quiz_cover_photo,
            negative_marking_score
        } = body;

        if (quiz_title && quiz_summary && quiz_display_time && quiz_estimated_time && quiz_total_question && quiz_total_marks && quiz_status) {
            await prisma.qF_Quiz.create({
                data: {
                    quiz_title,
                    quiz_summary,
                    quiz_display_time,
                    quiz_estimated_time,
                    quiz_total_question,
                    quiz_total_marks,
                    quiz_status,
                    quiz_about_text,
                    quiz_terms,
                    quiz_categories,
                    quiz_cover_photo,
                    negative_marking_score
                }
            });
            sts = 201;
            resp = {
                success: true,
                message: "Quiz Created Successfully!"
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