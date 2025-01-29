import prisma from "@/app/libs/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface ShtResp {
    success: boolean,
    message: string
}

export async function POST(req: Request) {
    let sts: number = 200;

    let resp: ShtResp = {
        success: false,
        message: '',
    }

    try {

        const body = await req.json();
        const { token, user_password, confirm_password } = body;

        if (token && user_password && confirm_password) {

            const res = jwt.verify(token as string, process.env.JWT_SECRET ?? "") as { is_auth_user: string };

            if (res) {

                const user_id = res.is_auth_user;

                const user = await prisma.qF_User.findFirst({
                    where: {
                        user_id
                    }
                });
                if (user !== null) {
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
                        resp = {
                            success: true,
                            message: 'Password Updated.',
                        }
                        sts = 200;
                    } else {
                        resp = {
                            success: false,
                            message: "Password & Confirm Password Doesn't Match."
                        }
                        sts = 200;
                    }
                } else {
                    resp = {
                        success: false,
                        message: 'User not found with this user id.',
                    }
                    sts = 200;
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
        // short_resp = {
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