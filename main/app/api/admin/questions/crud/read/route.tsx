import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { CommonAPIResponse } from "@/app/types/commonTypes";
import { QF_AGetQuestionDataType } from "@/app/types/libs/tanstack-query/admin/adminQuestionType";

export async function GET(req: NextRequest) {
    let resp: (CommonAPIResponse & { question?: QF_AGetQuestionDataType }) = {
        success: false,
        message: '',
    }

    let sts: number = 200;
    let isTrueAdminUser: boolean = false;

    try {

        const searchParams = req.nextUrl.searchParams;
        const token = sanitize(searchParams.get('token'));
        const question_id = sanitize(searchParams.get('question_id'));

        if (token && question_id) {
            const res = jwt.verify(token as string, process.env.JWT_SECRET ?? "") as { is_admin_user: string };

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
                    const existingQuestion = await prisma.qF_Question.findFirst({
                        where: {
                            question_id
                        }
                    });
                    if (existingQuestion !== null) {
                        sts = 200;
                        resp = {
                            success: true,
                            message: "Question Found!",
                            question: {
                                question_id: existingQuestion.question_id,
                                question_title: existingQuestion.question_title,
                                question_marks: existingQuestion.question_marks,
                                quiz_id: existingQuestion.quizid
                            }
                        }
                    } else {
                        sts = 200;
                        resp = {
                            success: false,
                            message: "Question Not Found!",
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