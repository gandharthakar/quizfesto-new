import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface Cats {
    value: string,
    label: string
}

interface qF_Quiz {
    quiz_id: string,
    quiz_title: string,
    quiz_summary: string,
    quiz_display_time: string,
    quiz_estimated_time: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_status: string,
    quiz_about_text: string,
    quiz_terms: string[],
    quiz_cover_photo: string,
    quiz_categories: Cats[],
    negative_marking_score: number
}

interface Respo {
    success: boolean,
    message: string,
    quiz: qF_Quiz
}

const getCatsLabel = async (id_list: string[]) => {
    const data = await prisma.qF_Quiz_Category.findMany({
        where: {
            category_id: {
                in: id_list
            }
        }
    });

    const cts: Cats[] = [];

    for (let i = 0; i < data.length; i++) {
        const obj = {
            value: data[i].category_id,
            label: data[i].category_title
        }
        cts.push(obj);
    }
    return cts;
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: '',
        quiz: {
            quiz_id: '',
            quiz_title: '',
            quiz_summary: '',
            quiz_display_time: '',
            quiz_estimated_time: '',
            quiz_total_question: 0,
            quiz_total_marks: 0,
            quiz_status: '',
            quiz_about_text: '',
            quiz_terms: [],
            quiz_cover_photo: '',
            quiz_categories: [],
            negative_marking_score: 0
        }
    }
    let sts: number = 400;

    try {

        const body = await req.json();
        const { quiz_id } = body;
        if (quiz_id) {
            const alreadQuizExited = await prisma.qF_Quiz.findFirst({
                where: {
                    quiz_id
                }
            });

            if (alreadQuizExited) {
                sts = 200;
                resp = {
                    success: true,
                    message: "Quiz Exist!",
                    quiz: {
                        quiz_id: alreadQuizExited.quiz_id,
                        quiz_title: alreadQuizExited.quiz_title,
                        quiz_summary: alreadQuizExited.quiz_summary,
                        quiz_display_time: alreadQuizExited.quiz_display_time,
                        quiz_estimated_time: alreadQuizExited.quiz_estimated_time,
                        quiz_total_question: alreadQuizExited.quiz_total_question,
                        quiz_total_marks: alreadQuizExited.quiz_total_marks,
                        quiz_status: alreadQuizExited.quiz_status,
                        quiz_about_text: alreadQuizExited.quiz_about_text ?? "",
                        quiz_terms: alreadQuizExited.quiz_terms,
                        quiz_cover_photo: alreadQuizExited.quiz_cover_photo ?? "",
                        quiz_categories: await getCatsLabel(alreadQuizExited.quiz_categories),
                        negative_marking_score: alreadQuizExited.negative_marking_score
                    }
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Quiz Not Exist!",
                    quiz: {
                        quiz_id: '',
                        quiz_title: '',
                        quiz_summary: '',
                        quiz_display_time: '',
                        quiz_estimated_time: '',
                        quiz_total_question: 0,
                        quiz_total_marks: 0,
                        quiz_status: '',
                        quiz_about_text: '',
                        quiz_terms: [],
                        quiz_cover_photo: '',
                        quiz_categories: [],
                        negative_marking_score: 0
                    }
                }
            }
        } else {
            sts = 400;
            resp = {
                success: false,
                message: "Missing Required Fields!",
                quiz: {
                    quiz_id: '',
                    quiz_title: '',
                    quiz_summary: '',
                    quiz_display_time: '',
                    quiz_estimated_time: '',
                    quiz_total_question: 0,
                    quiz_total_marks: 0,
                    quiz_status: '',
                    quiz_about_text: '',
                    quiz_terms: [],
                    quiz_cover_photo: '',
                    quiz_categories: [],
                    negative_marking_score: 0
                }
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message,
            quiz: {
                quiz_id: '',
                quiz_title: '',
                quiz_summary: '',
                quiz_display_time: '',
                quiz_estimated_time: '',
                quiz_total_question: 0,
                quiz_total_marks: 0,
                quiz_status: '',
                quiz_about_text: '',
                quiz_terms: [],
                quiz_cover_photo: '',
                quiz_categories: [],
                negative_marking_score: 0
            }
        }
        return NextResponse.json(resp, { status: sts });
    }
}