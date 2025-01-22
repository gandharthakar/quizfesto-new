import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface ShtResp {
    success: boolean,
    message: string
}

export async function POST(req: Request) {

    let sts: number = 400;

    let resp: ShtResp = {
        success: false,
        message: '',
    }

    let isTrueAdminUser: boolean = false;

    try {

        const body = await req.json();
        const { user_id, user_phone } = body;

        if (user_id && user_phone) {

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
                            user_phone
                        }
                    });
                } else {
                    if (fu__in__admntblmdl) {
                        await prisma.qF_Admin_User.update({
                            where: {
                                admin_user_id: user_id
                            },
                            data: {
                                admin_user_phone: user_phone
                            }
                        });
                    }
                }

                resp = {
                    success: true,
                    message: 'Phone Number Updated.',
                }
                sts = 200;
            } else {
                resp = {
                    success: false,
                    message: 'User Not Found.',
                }
                sts = 200;
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