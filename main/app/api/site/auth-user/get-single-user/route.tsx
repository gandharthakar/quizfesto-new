import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";

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

export async function GET(req: NextRequest) {
    let resp: Respo = {
        success: false,
        message: '',
    }

    let sts: number = 200;

    try {

        const searchParams = req.nextUrl.searchParams;
        const token = searchParams.get('token');

        if (token) {

            const res = jwt.verify(token as string, process.env.JWT_SECRET ?? "") as { is_auth_user: string };

            if (res) {

                const user_id = res.is_auth_user;

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