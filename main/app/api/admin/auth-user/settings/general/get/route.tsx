import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";

interface Respo {
    user_full_name: string,
    user_email: string,
    user_gender: string,
    success?: boolean
}

interface ShtResp {
    success: boolean,
    message: string
}

export async function GET(req: NextRequest) {
    let resp_main: Respo = {
        user_full_name: '',
        user_email: '',
        user_gender: '',
        success: false
    }

    let sts: number = 200;

    let short_resp: ShtResp = {
        success: false,
        message: '',
    }

    let MixResp;

    try {

        // const body = await req.json();
        // const { user_id } = body;
        const searchParams = req.nextUrl.searchParams;
        const token = searchParams.get('token');
        const res = jwt.verify(token as string, process.env.JWT_SECRET ?? "") as { is_admin_user: string };

        if (res) {
            const user_id = res.is_admin_user;

            if (!user_id) {
                short_resp = {
                    success: false,
                    message: 'User id not provided',
                }
                MixResp = short_resp;
                sts = 200;
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
                        user_full_name: user.user_full_name,
                        user_email: user.user_email,
                        user_gender: user.user_gender,
                        success: true
                    }
                    MixResp = resp_main;
                    sts = 200;
                } else {
                    if (fu__in__admntblmdl) {
                        resp_main = {
                            user_full_name: user.admin_user_name,
                            user_email: user.admin_user_email,
                            user_gender: user.admin_user_gender,
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
        }

        return NextResponse.json(MixResp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        // sts = 500;
        // short_resp = {
        //     success: false,
        //     message: error.message
        // }

        if (error.message == "jwt expired") {
            short_resp = {
                success: false,
                message: "Your session is expired, Please login again."
            }
        } else if (error.message == "jwt malformed" || error.message == "jwt must be a string") {
            short_resp = {
                success: false,
                message: "Wrong information provided."
            }
        } else if (error.message == "invalid signature" || error.message == "invalid token") {
            short_resp = {
                success: false,
                message: "Invalid information provided."
            }
        } else if (error.message == "jwt must be provided") {
            sts = 400;
            short_resp = {
                success: false,
                message: "Missing required fields."
            }
        } else {
            short_resp = {
                success: false,
                message: error.message
            }
        }
        return NextResponse.json(short_resp, { status: sts });
    }
}