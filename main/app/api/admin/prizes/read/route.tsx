import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface Respo {
    success: boolean,
    message: string,
    prize_type: number,
    prize_description: string,
    prize_cover_photo?: string,
    winning_score_limit: number
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: '',
        prize_type: 0,
        prize_description: '',
        prize_cover_photo: '',
        winning_score_limit: 0
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { prize_type } = body;

        if (prize_type) {
            const getType = await prisma.qF_Winning_Prizes.findFirst({
                where: {
                    prize_type
                }
            });
            if (getType) {
                const data = await prisma.qF_Winning_Prizes.findFirst({
                    where: {
                        prize_type
                    },
                });
                if (data) {
                    sts = 200;
                    resp = {
                        success: true,
                        message: "Prize Found Successfully!",
                        prize_type: data.prize_type,
                        prize_description: data.prize_description,
                        prize_cover_photo: data.prize_cover_photo ?? "",
                        winning_score_limit: data.winning_score_limit
                    }
                }
            } else {
                sts = 200;
                resp = {
                    success: true,
                    message: "No Prize Found!",
                    prize_type: 0,
                    prize_description: '',
                    prize_cover_photo: '',
                    winning_score_limit: 0
                }
            }
        } else {
            sts = 400;
            resp = {
                success: false,
                message: "Missing Required Field.",
                prize_type: 0,
                prize_description: '',
                prize_cover_photo: '',
                winning_score_limit: 0
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message,
            prize_type: 0,
            prize_description: '',
            prize_cover_photo: '',
            winning_score_limit: 0
        }
        return NextResponse.json(resp, { status: sts });
    }
}