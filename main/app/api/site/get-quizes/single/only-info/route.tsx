import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import { sanitize } from "@/app/libs/sanitize";
import { CommonAPIResponse } from "@/app/types/commonTypes";
import { QF_MasterQuizDataType } from "@/app/types/libs/tanstack-query/website/websiteCommonTypes";

const getCats = async (ids: string[]) => {
    const cats = await prisma.qF_Quiz_Category.findMany({
        where: {
            category_id: {
                in: ids
            }
        }
    });

    return cats;
}

export async function GET(req: NextRequest) {

    let resp: (CommonAPIResponse & { quiz?: QF_MasterQuizDataType }) = {
        success: false,
        message: '',
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
                    AND: [
                        {
                            quiz_status: "published"
                        },
                        {
                            quiz_id
                        }
                    ]
                }
            });
            if (data !== null) {
                sts = 200;
                resp = {
                    success: true,
                    message: "Quiz Found!",
                    quiz: {
                        quiz_id: data.quiz_id,
                        quiz_title: data.quiz_title,
                        quiz_summary: data.quiz_summary,
                        quiz_about_text: data.quiz_about_text ?? "",
                        quiz_display_time: data.quiz_display_time,
                        quiz_terms: data.quiz_terms,
                        quiz_total_marks: data.quiz_total_marks,
                        quiz_total_question: data.quiz_total_question,
                        quiz_cover_photo: data.quiz_cover_photo ?? "",
                        quiz_categories: await getCats(data.quiz_categories)
                    }
                }
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
            message: error.message,
        }
        return NextResponse.json(resp, { status: sts });
    }
}