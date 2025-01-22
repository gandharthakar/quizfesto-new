import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface QF_User {
    user_id: string,
    user_full_name: string,
    user_email: string,
    user_phone: string,
    user_photo: string,
    user_gender: string
}

interface Respo {
    success: boolean,
    message: string,
    user?: QF_User
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: '',
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { user_id } = body;

        if (user_id) {

            const alrreadyExistUser = await prisma.qF_User.findFirst({
                where: {
                    user_id
                }
            });

            if (alrreadyExistUser !== null) {
                sts = 200;
                resp = {
                    success: true,
                    message: "User Found!",
                    user: {
                        user_id: alrreadyExistUser.user_id,
                        user_full_name: alrreadyExistUser.user_full_name,
                        user_email: alrreadyExistUser.user_email,
                        user_phone: alrreadyExistUser.user_phone ?? "",
                        user_photo: alrreadyExistUser.user_photo ?? "",
                        user_gender: alrreadyExistUser.user_gender ?? "",
                    }
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