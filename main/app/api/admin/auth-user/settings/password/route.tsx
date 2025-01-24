import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
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

    let isTrueAdminUser: boolean = false;

    try {

        const body = await req.json();
        const { token, password, confirm_password } = body;

        if (token && password && confirm_password) {
            const res = jwt.verify(token as string, process.env.JWT_SECRET ?? "") as { is_admin_user: string };

            if (res) {

                const user_id = res.is_admin_user;

                const fu__in__usrtblmdl = await prisma.qF_User.findFirst({
                    where: {
                        AND: [
                            {
                                user_id
                            },
                            {
                                role: "Admin"
                            }
                        ]
                    }
                });
                const fu__in__admntblmdl = await prisma.qF_Admin_User.findFirst({
                    where: {
                        admin_user_id: user_id,
                    }
                });

                if (fu__in__usrtblmdl) {
                    isTrueAdminUser = true;
                } else {
                    if (fu__in__admntblmdl) {
                        isTrueAdminUser = true;
                    } else {
                        isTrueAdminUser = false;
                    }
                }

                if (isTrueAdminUser) {

                    if (password === confirm_password) {
                        const hashPassword = await hash(password, 10);
                        if (fu__in__usrtblmdl) {
                            await prisma.qF_User.update({
                                where: {
                                    user_id
                                },
                                data: {
                                    user_password: hashPassword,
                                }
                            });
                        } else {
                            if (fu__in__admntblmdl) {
                                await prisma.qF_Admin_User.update({
                                    where: {
                                        admin_user_id: user_id
                                    },
                                    data: {
                                        admin_user_password: hashPassword
                                    }
                                });
                            }
                        }
                        resp = {
                            success: true,
                            message: 'Password Updated.',
                        }
                        sts = 200;
                    } else {
                        resp = {
                            success: false,
                            message: "Password & Confirm Password Doesn't Match.",
                        }
                        sts = 422;
                    }
                } else {
                    resp = {
                        success: false,
                        message: 'User Not Found.',
                    }
                    sts = 200;
                }
            }
        } else {
            resp = {
                success: false,
                message: 'Missing required fields.',
            }
            sts = 400;
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