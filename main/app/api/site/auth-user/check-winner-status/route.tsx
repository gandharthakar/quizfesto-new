import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { getWinnerPosTxt } from "@/app/libs/helpers/helperFunctions";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";

interface Check_Winner {
    winner_type: number,
    winning_position_text: string,
    winning_score: number
}

interface Respo {
    success: boolean,
    message: string,
    winner?: Check_Winner
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

                    const ifWinner = await prisma.qF_Winners.findFirst({
                        where: {
                            user_id
                        }
                    });

                    if (ifWinner !== null) {
                        sts = 200;
                        resp = {
                            success: true,
                            message: "Winner Found!",
                            winner: {
                                winner_type: ifWinner.winner_type,
                                winning_position_text: getWinnerPosTxt(ifWinner.winner_type),
                                winning_score: (await prisma.qF_Aggrigate_Scores.findFirst({ where: { user_id } }))?.aggregate_score ?? 0
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