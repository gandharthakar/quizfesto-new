import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { sanitize } from "@/app/libs/sanitize";

interface Respo {
    success: boolean,
    message: string
    user_block_status?: string
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 200;

    try {

        const body = await req.json();

        const user_id = sanitize(body.user_id);

        // const { user_id } = body;

        if (user_id) {
            const existingUser = await prisma.qF_User.findFirst({
                where: {
                    user_id
                }
            });
            if (existingUser !== null) {
                sts = 200;
                resp = {
                    success: true,
                    message: "User Found!",
                    user_block_status: existingUser.isBlockedByAdmin ?? ""
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "User Not Found!"
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