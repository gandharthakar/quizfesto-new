import prisma from "@/app/libs/db";
import { sanitize } from "@/app/libs/sanitize";
import { CommonAPIResponse } from "@/app/types/commonTypes";
import { QF_MasterQuizDataType } from "@/app/types/libs/tanstack-query/website/websiteCommonTypes";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';

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

    let resp: (CommonAPIResponse & { quizes?: QF_MasterQuizDataType[] }) = {
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

            //eslint-disable-next-line
            const data: any[] = await prisma.$queryRaw`
                SELECT * FROM "QF_Quiz"
                WHERE "quiz_id" != ${quiz_id}
                ORDER BY RANDOM()
                LIMIT 3;
            `;

            if (data.length > 0) {

                const arr: QF_MasterQuizDataType[] = [];

                for (let i = 0; i < data.length; i++) {
                    const obj = {
                        quiz_id: data[i].quiz_id,
                        quiz_title: data[i].quiz_title,
                        quiz_summary: data[i].quiz_summary,
                        quiz_about_text: data[i].quiz_about_text ?? "",
                        quiz_display_time: data[i].quiz_display_time,
                        quiz_terms: data[i].quiz_terms,
                        quiz_total_marks: data[i].quiz_total_marks,
                        quiz_total_question: data[i].quiz_total_question,
                        quiz_categories: await getCats(data[i].quiz_categories),
                        quiz_cover_photo: data[i].quiz_cover_photo ?? "",
                    }
                    arr.push(obj);
                }
                sts = 200;
                resp = {
                    success: true,
                    message: "Quiz Found!",
                    quizes: arr
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