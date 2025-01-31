import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";

interface MyPartCrd {
    user_participation_id: string,
    quiz_title: string,
    quiz_cover_photo: string,
    quiz_display_time: string,
    quiz_total_question: number,
    quiz_total_marks: number,
    quiz_estimated_time: string,
    quiz_time_taken: string,
    quiz_correct_answers_count: number,
    quiz_total_score: number
}

interface Respo {
    success: boolean,
    message: string,
    participation_data?: MyPartCrd[]
}

export async function GET(req: NextRequest) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 200;

    try {

        const searchParams = req.nextUrl.searchParams;
        const token = sanitize(searchParams.get('token'));

        if (token) {

            const res = jwt.verify(token as string, process.env.JWT_SECRET ?? "") as { is_auth_user: string };

            if (res) {

                const user_id = res.is_auth_user;

                const existingUser = await prisma.qF_User.findFirst({
                    where: {
                        user_id
                    }
                });

                if (existingUser !== null) {

                    const usrPart = await prisma.qF_User_Participation.findMany({
                        where: {
                            user_id
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    });

                    if (usrPart.length > 0) {
                        sts = 200;
                        resp = {
                            success: true,
                            message: "Data Found!",
                            participation_data: usrPart.map((item) => {
                                return {
                                    user_participation_id: item.user_participation_id,
                                    quiz_title: item.quiz_title,
                                    quiz_cover_photo: item.quiz_cover_photo ?? "",
                                    quiz_display_time: item.quiz_display_time,
                                    quiz_total_question: item.quiz_total_question,
                                    quiz_total_marks: item.quiz_total_marks,
                                    quiz_estimated_time: item.quiz_estimated_time,
                                    quiz_time_taken: item.quiz_time_taken,
                                    quiz_correct_answers_count: item.quiz_correct_answers_count,
                                    quiz_total_score: item.quiz_total_score
                                }
                            })
                        }
                    } else {
                        sts = 200;
                        resp = {
                            success: false,
                            message: "Data Not Found!",
                        }
                    }
                } else {
                    sts = 200;
                    resp = {
                        success: false,
                        message: "User not found.",
                    }
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