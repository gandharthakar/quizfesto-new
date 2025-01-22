import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";

interface Respo {
    success: boolean,
    message: string,
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { user_password, confirm_password, user_id, token } = body;

        if (user_password && confirm_password && user_id && token) {
            if (user_password === confirm_password) {
                const user = await prisma.qF_User.findFirst({
                    where: {
                        user_id
                    }
                });
                if (user !== null) {
                    const vrfy = jwt.verify(token, process.env.JWT_SECRET ?? "");
                    const hashPwd = await hash(user_password, 10);
                    if (vrfy) {
                        await prisma.qF_User.update({
                            where: {
                                user_id
                            },
                            data: {
                                user_password: hashPwd
                            }
                        });
                        sts = 200;
                        resp = {
                            success: true,
                            message: "Password Changed Successfully!",
                        }
                    } else {
                        sts = 200;
                        resp = {
                            success: false,
                            message: "Token is invalid or expired.",
                        }
                    }
                } else {
                    sts = 200;
                    resp = {
                        success: false,
                        message: "Unable to find user.",
                    }
                }
            } else {
                sts = 422;
                resp = {
                    success: false,
                    message: "Password & confirm password doesn't match.",
                }
            }
        } else {
            sts = 400;
            resp = {
                success: false,
                message: 'Missing required fields.',
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {

        if (error.message == "jwt expired") {
            sts = 200;
            resp = {
                success: false,
                message: "Token is invalid or expired."
            }
        } else {
            sts = 500;
            resp = {
                success: false,
                message: error.message
            }
        }
        return NextResponse.json(resp, { status: sts });
    }
}