import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";

interface Respo {
    success: boolean,
    message: string
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 200;

    let isTrueAdminUser: boolean = false;

    try {

        const body = await req.json();

        const token = sanitize(body.token);
        const user_photo = sanitize(body.user_photo);

        // const { token, user_photo } = body;

        if (token && user_photo) {

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

                    if (fu__in__usrtblmdl) {
                        await prisma.qF_User.update({
                            where: {
                                user_id
                            },
                            data: {
                                user_photo
                            }
                        });
                    } else {
                        if (fu__in__admntblmdl) {
                            await prisma.qF_Admin_User.update({
                                where: {
                                    admin_user_id: user_id
                                },
                                data: {
                                    admin_user_photo: user_photo
                                }
                            });
                        }
                    }

                    resp = {
                        success: true,
                        message: "Profile Photo Updated."
                    }
                    sts = 200;
                } else {
                    resp = {
                        success: false,
                        message: 'User Not Found.',
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
        sts = 500;
        resp = {
            success: false,
            message: error.message
        }
        return NextResponse.json(resp, { status: sts });
    }
}