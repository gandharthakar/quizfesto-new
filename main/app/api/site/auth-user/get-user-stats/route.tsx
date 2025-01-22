import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { user_id } = body;

        if (user_id) {

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
            message: error.message
        }
        return NextResponse.json(resp, { status: sts });
    }
}