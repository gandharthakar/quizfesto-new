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
        const { quiz_id, user_id } = body;

        if (quiz_id) {
            const gquiz = await prisma.qF_User_Participation.findFirst({
                where: {
                    AND: [
                        {
                            user_id
                        },
                        {
                            quiz_id
                        }
                    ]
                }
            });

            if (gquiz !== null) {
                sts = 200;
                resp = {
                    success: true,
                    message: "Quiz Found!",
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Quiz Not Found!",
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