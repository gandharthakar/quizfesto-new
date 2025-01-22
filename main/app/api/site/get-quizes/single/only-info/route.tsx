import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface QF_Cats_Pub {
    category_id: string,
    category_title: string,
    category_slug: string
}

interface QF_Quiz_Pub {
    quiz_id: string,
    quiz_title: string,
    quiz_summary: string,
    quiz_display_time: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_about_text: string,
    quiz_terms: string[],
    quiz_categories: QF_Cats_Pub[],
    quiz_cover_photo?: string,
}

interface Respo {
    success: boolean,
    message: string
    quiz?: QF_Quiz_Pub
}

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

export async function POST(req: Request) {

    let resp: Respo = {
        success: false,
        message: '',
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { quiz_id } = body;

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