import prisma from "@/app/libs/db";
import { sanitize } from "@/app/libs/sanitize";
import { CommonAPIResponse } from "@/app/types/commonTypes";
import { QF_MasterCategoriesDataType, QF_MasterQuizDataType } from "@/app/types/libs/tanstack-query/website/websiteCommonTypes";
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
    let resp: (CommonAPIResponse & {
        quizes?: QF_MasterQuizDataType[],
        category?: QF_MasterCategoriesDataType
    }) = {
        success: false,
        message: '',
    }

    let sts: number = 200;

    try {

        const searchParams = req.nextUrl.searchParams;
        const category_slug = sanitize(searchParams.get('category_slug'));

        if (category_slug) {

            const cat_id = await prisma.qF_Quiz_Category.findFirst({
                where: {
                    category_slug
                }
            });

            const data = await prisma.qF_Quiz.findMany({
                where: {
                    AND: [
                        {
                            quiz_status: "published"
                        },
                        {
                            quiz_categories: {
                                has: cat_id?.category_id
                            }
                        }
                    ]
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
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
                    quizes: arr,
                    category: {
                        category_id: cat_id?.category_id ?? "",
                        category_title: cat_id?.category_title ?? "",
                        category_slug: cat_id?.category_slug ?? ""
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