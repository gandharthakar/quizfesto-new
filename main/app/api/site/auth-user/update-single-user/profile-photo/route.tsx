import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface ShtResp {
    success: boolean,
    message: string
}

export async function POST(req: Request) {
    let sts: number = 400;

    let short_resp: ShtResp = {
        success: false,
        message: '',
    }

    try {

        const body = await req.json();
        const { user_id, user_photo } = body;

        if (!user_id) {
            short_resp = {
                success: false,
                message: 'User id not provided',
            }
            sts = 400;
        } else {
            const user = await prisma.qF_User.findFirst({
                where: {
                    user_id
                }
            });
            if (user) {
                await prisma.qF_User.update({
                    where: {
                        user_id
                    },
                    data: {
                        user_photo
                    }
                });
                short_resp = {
                    success: true,
                    message: 'Profile Photo Updated.',
                }
                sts = 200;
            } else {
                short_resp = {
                    success: false,
                    message: 'User not found with this user id.',
                }
                sts = 200;
            }
        }
        return NextResponse.json(short_resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        short_resp = {
            success: false,
            message: error.message
        }
        return NextResponse.json(short_resp, { status: sts });
    }
}