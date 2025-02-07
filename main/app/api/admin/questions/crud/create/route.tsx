import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { AdminQuestionsValidationSchema } from "@/app/libs/zod/schemas/adminValidationSchemas";
import { CommonAPIResponseWithZodError } from "@/app/types/commonTypes";

export async function POST(req: Request) {
    let resp: CommonAPIResponseWithZodError = {
        success: false,
        message: ''
    }

    let sts: number = 200;
    let isTrueAdminUser: boolean = false;

    try {

        const body = await req.json();

        const token = sanitize(body.token);
        const quiz_id = sanitize(body.quiz_id);
        const question_title = sanitize(body.question_title);
        const s1 = sanitize(JSON.stringify(body.question_marks));
        const question_marks = Number(JSON.parse(s1));

        // const { token, quiz_id, question_title, question_marks } = body;

        if (token && quiz_id && question_title && question_marks) {
            const valResult = AdminQuestionsValidationSchema.safeParse({
                quiz_id,
                question_text: question_title,
                question_marks
            });
            if (valResult.success) {
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
                        await prisma.qF_Question.create({
                            data: {
                                quizid: quiz_id,
                                question_title,
                                question_marks: question_marks
                            }
                        });
                        sts = 201;
                        resp = {
                            success: true,
                            message: "Question Created Successfully!"
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
                sts = 200;
                resp = {
                    success: false,
                    message: "Inputs validation errors",
                    errors: valResult.error.issues.map((err) => {
                        return { message: err.message, field: String(err.path[0]) }
                    })
                }
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
        // sts = 500;
        // resp = {
        //     success: false,
        //     message: error.message
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