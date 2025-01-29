import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";

interface QF_User_Stats {
    user_score: number,
    user_participation: number,
    user_winnings: number
}

interface Respo {
    success: boolean,
    message: string,
    user_stats?: QF_User_Stats
}

export async function GET(req: NextRequest) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 200;

    try {

        const searchParams = req.nextUrl.searchParams;
        const token = searchParams.get('token');

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

                    const upd = await prisma.qF_User_Participation.findMany({
                        where: {
                            user_id
                        },
                        select: {
                            quiz_total_score: true
                        }
                    });
                    const totalScore = upd.reduce((acc, user) => acc + user.quiz_total_score, 0);

                    sts = 200;
                    resp = {
                        success: true,
                        message: "Data Found!",
                        user_stats: {
                            user_score: totalScore,
                            user_participation: (await prisma.qF_User_Participation.findMany({ where: { user_id } })).length,
                            user_winnings: (await prisma.qF_Winners.findMany({ where: { user_id: user_id } })).length
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