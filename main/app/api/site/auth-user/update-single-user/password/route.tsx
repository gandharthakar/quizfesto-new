import prisma from "@/app/libs/db";
import { hash } from "bcrypt";
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
        const { user_id, user_password, confirm_password } = body;

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
                if (user_password === confirm_password) {
                    const hashPassword = await hash(user_password, 10);
                    await prisma.qF_User.update({
                        where: {
                            user_id
                        },
                        data: {
                            user_password: hashPassword,
                        }
                    });
                    short_resp = {
                        success: true,
                        message: 'Password Updated.',
                    }
                    sts = 200;
                } else {
                    short_resp = {
                        success: false,
                        message: "Password & Confirm Password Doesn't Match."
                    }
                    sts = 422;
                }
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