import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface Respo {
    user_phone: string,
    success?: boolean
}

interface ShtResp {
    success: boolean,
    message: string
}

export async function POST(req: Request) {
    let resp_main: Respo = {
        user_phone: '',
        success: false
    }

    let sts: number = 400;

    let short_resp: ShtResp = {
        success: false,
        message: '',
    }

    let MixResp;

    try {

        const body = await req.json();
        const { user_id } = body;

        if (!user_id) {
            short_resp = {
                success: false,
                message: 'User id not provided',
            }
            MixResp = short_resp;
            sts = 400;
        } else {

            //eslint-disable-next-line
            let user: any = {};
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
                user = fu__in__usrtblmdl;
            } else {
                if (fu__in__admntblmdl) {
                    user = fu__in__admntblmdl;
                } else {
                    user = {};
                }
            }

            if (fu__in__usrtblmdl) {
                resp_main = {
                    user_phone: user.user_phone,
                    success: true
                }
                MixResp = resp_main;
                sts = 200;
            } else {
                if (fu__in__admntblmdl) {
                    resp_main = {
                        user_phone: user.admin_user_phone,
                        success: true
                    }
                    MixResp = resp_main;
                    sts = 200;
                } else {
                    short_resp = {
                        success: false,
                        message: 'No User Found.',
                    }
                    MixResp = short_resp;
                    sts = 200;
                }
            }
        }

        return NextResponse.json(MixResp, { status: sts });
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