import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface WinUsrFrm {
    winner_id: string,
    winning_type: number,
    winning_position_text: string,
    winning_description: string,
    winning_date: string
}

interface Respo {
    success: boolean,
    message: string,
    winner?: WinUsrFrm
}

const getWinnerPosTxt = (winType: number) => {
    let txt = '';
    switch (winType) {
        case 1:
            txt = 'st'
            break;
        case 2:
            txt = 'nd'
            break;
        case 3:
            txt = 'rd'
            break;
        default:
            txt = ''
            break;
    }

    return txt;
}

const convertDigitIn = (str: string) => {
    return str.split('-').reverse().join('-');
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
            const checkExistWinner = await prisma.qF_Winners.findFirst({
                where: {
                    user_id: user_id
                }
            });

            if (checkExistWinner !== null) {

                sts = 200;
                resp = {
                    success: true,
                    message: "Winner Found!",
                    winner: {
                        winner_id: checkExistWinner.winner_id,
                        winning_type: checkExistWinner.winner_type,
                        winning_position_text: getWinnerPosTxt(checkExistWinner.winner_type),
                        winning_description: checkExistWinner.winner_description,
                        winning_date: convertDigitIn(checkExistWinner.winner_date),
                    }
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "No Winner Found!"
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
        sts = 500;
        resp = {
            success: false,
            message: error.message
        }
        return NextResponse.json(resp, { status: sts });
    }
}