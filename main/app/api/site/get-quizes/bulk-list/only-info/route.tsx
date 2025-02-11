import prisma from "@/app/libs/db";
import { CommonAPIResponse } from "@/app/types/commonTypes";
import { QF_MasterQuizDataType } from "@/app/types/libs/tanstack-query/website/websiteCommonTypes";
import { NextResponse } from "next/server";

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

export async function GET() {

    let resp: (CommonAPIResponse & { quizes?: QF_MasterQuizDataType[] }) = {
        success: false,
        message: '',
    }

    let sts: number = 400;

    try {

        const data = await prisma.qF_Quiz.findMany({
            where: {
                quiz_status: "published"
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

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
            message: "Quizes Found!",
            quizes: arr
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