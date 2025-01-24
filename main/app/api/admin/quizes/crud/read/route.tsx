import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";

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
    quiz?: qF_Quiz
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

export async function GET(req: NextRequest) {
    let resp: Respo = {
        success: false,
        message: '',
    }
    let sts: number = 200;
    let isTrueAdminUser: boolean = false;

    try {

        const searchParams = req.nextUrl.searchParams;
        const token = searchParams.get('token');
        const quiz_id = searchParams.get('quiz_id');
        const res = jwt.verify(token as string, process.env.JWT_SECRET ?? "") as { is_admin_user: string };
        if (token && quiz_id) {

            if (res) {

                const user_id = res.is_admin_user;

                const fu__in__usrtblmdl = await prisma.qF_User.findFirst({
                    where: {
                        AND: [
                            {
                                user_id
                            },
                            {
                                role: "Admin"
                            }
                        ]
                    }
                });
                const fu__in__admntblmdl = await prisma.qF_Admin_User.findFirst({
                    where: {
                        admin_user_id: user_id,
                    }
                });

                if (fu__in__usrtblmdl) {
                    isTrueAdminUser = true;
                } else {
                    if (fu__in__admntblmdl) {
                        isTrueAdminUser = true;
                    } else {
                        isTrueAdminUser = false;
                    }
                }

                if (isTrueAdminUser) {
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
                        }
                    }
                } else {
                    resp = {
                        success: false,
                        message: 'User Not Found.',
                    }
                    sts = 200;
                }
            }
        } else {
            sts = 400;
            resp = {
                success: false,
                message: "Missing Required Fields!",
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        // sts = 500;
        // resp = {
        //     success: false,
        //     message: error.message,
        // }
        if (error.message == "jwt expired") {
            resp = {
                success: false,
                message: "Your session is expired, Please login again."
            }
        } else if (error.message == "jwt malformed" || error.message == "jwt must be a string") {
            resp = {
                success: false,
                message: "Wrong information provided."
            }
        } else if (error.message == "invalid signature" || error.message == "invalid token") {
            resp = {
                success: false,
                message: "Invalid information provided."
            }
        } else if (error.message == "jwt must be provided") {
            sts = 400;
            resp = {
                success: false,
                message: "Missing required fields."
            }
        } else {
            resp = {
                success: false,
                message: error.message
            }
        }
        return NextResponse.json(resp, { status: sts });
    }
}