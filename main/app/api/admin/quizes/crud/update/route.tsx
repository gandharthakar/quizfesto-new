import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { AdminQuizesValidationSchema } from "@/app/libs/zod/schemas/adminValidationSchemas";
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
        const quiz_title = sanitize(body.quiz_title);
        const quiz_summary = sanitize(body.quiz_summary);
        const quiz_display_time = sanitize(body.quiz_display_time);
        const quiz_estimated_time = sanitize(body.quiz_estimated_time);

        const s1 = sanitize(JSON.stringify(body.quiz_total_question));
        const quiz_total_question = Number(JSON.parse(s1));

        const s2 = sanitize(JSON.stringify(body.quiz_total_marks));
        const quiz_total_marks = Number(JSON.parse(s2));

        const quiz_status = sanitize(body.quiz_status);
        const quiz_about_text = sanitize(body.quiz_about_text);

        const s3 = sanitize(JSON.stringify(body.quiz_terms));
        const quiz_terms = JSON.parse(s3);

        // const s4 = sanitize(JSON.stringify(body.quiz_categories));
        // const quiz_categories = JSON.parse(s4);
        const quiz_cover_photo = sanitize(body.quiz_cover_photo);

        const s5 = sanitize(JSON.stringify(body.negative_marking_score));
        const negative_marking_score = JSON.parse(s5);

        // const {
        //     token,
        //     quiz_id,
        //     quiz_title,
        //     quiz_summary,
        //     quiz_display_time,
        //     quiz_estimated_time,
        //     quiz_total_question,
        //     quiz_total_marks,
        //     quiz_status,
        //     quiz_about_text,
        //     quiz_terms,
        //     quiz_categories,
        //     quiz_cover_photo,
        //     negative_marking_score
        // } = body;

        if (token && quiz_id && quiz_title && quiz_summary && quiz_display_time && quiz_estimated_time && quiz_total_question && quiz_total_marks && quiz_status) {
            const valResult = AdminQuizesValidationSchema.safeParse({
                quiz_main_title: quiz_title,
                quiz_summ: quiz_summary,
                quiz_disp_time: quiz_display_time,
                quiz_est_time: quiz_estimated_time,
                quiz_total_marks: quiz_total_marks,
                quiz_total_ques: quiz_total_question,
                quiz_sts: quiz_status
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
                        const alreadQuizExited = await prisma.qF_Quiz.findFirst({
                            where: {
                                quiz_id
                            }
                        });
                        if (alreadQuizExited) {

                            await prisma.qF_Quiz.update({
                                where: {
                                    quiz_id
                                },
                                data: {
                                    quiz_title,
                                    quiz_summary,
                                    quiz_display_time,
                                    quiz_estimated_time,
                                    quiz_total_question,
                                    quiz_total_marks,
                                    quiz_status,
                                    quiz_about_text,
                                    quiz_terms,
                                    // quiz_categories,
                                    quiz_cover_photo,
                                    negative_marking_score
                                }
                            });
                            sts = 200;
                            resp = {
                                success: true,
                                message: "Quiz Updated Successfully!"
                            }

                        } else {
                            sts = 200;
                            resp = {
                                success: false,
                                message: "Quiz Not Exist!"
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