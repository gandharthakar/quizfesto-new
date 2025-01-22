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
    quizes?: QF_Quiz_Pub[]
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

export async function GET() {

    let resp: Respo = {
        success: false,
        message: '',
        quizes: []
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

        const arr: QF_Quiz_Pub[] = [];

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
            quizes: []
        }
        return NextResponse.json(resp, { status: sts });
    }
}