import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { convertDigitIn, getWinnerPosTxt } from "@/app/libs/helpers/helperFunctions";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { WinnerUserDataType } from "@/app/types/pages/website/user-area/userAreaPageTypes";
import { CommonAPIResponse } from "@/app/types/commonTypes";

export async function GET(req: NextRequest) {
    let resp: (CommonAPIResponse & { winner?: WinnerUserDataType }) = {
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