import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface Respo {
    success: boolean,
    message: string
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { prize_type, prize_photo, prize_description, winning_score_limit } = body;

        if (prize_type && prize_description && winning_score_limit) {
            const getType = await prisma.qF_Winning_Prizes.findFirst({
                where: {
                    prize_type
                }
            });
            if (getType) {
                await prisma.qF_Winning_Prizes.update({
                    where: {
                        prize_type
                    },
                    data: {
                        prize_description,
                        prize_cover_photo: prize_photo,
                        winning_score_limit
                    }
                });
                sts = 200;
                resp = {
                    success: true,
                    message: "Prize Updated Successfully!"
                }
            } else {
                await prisma.qF_Winning_Prizes.create({
                    data: {
                        prize_type,
                        prize_description,
                        prize_cover_photo: prize_photo,
                        winning_score_limit
                    }
                });
                sts = 201;
                resp = {
                    success: true,
                    message: "Prize Created Successfully!"
                }
            }
        } else {
            sts = 400;
            resp = {
                success: false,
                message: "Missing Required Field."
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