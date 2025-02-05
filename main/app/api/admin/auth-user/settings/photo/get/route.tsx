import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { CommonAPIResponse } from "@/app/types/commonTypes";
import { QF_GetAdminProfilePhotoType } from "@/app/types/libs/tanstack-query/admin/adminSettingsType";

export async function GET(req: NextRequest) {
    let resp_main: QF_GetAdminProfilePhotoType = {
        user_photo: '',
        success: false,
        message: ''
    }

    let sts: number = 200;

    let short_resp: CommonAPIResponse = {
        success: false,
        message: '',
    }

    let MixResp;

    try {

        const searchParams = req.nextUrl.searchParams;
        const token = sanitize(searchParams.get('token'));
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
                        user_photo: user.user_photo,
                        success: true,
                        message: "Profile Photo Updated."
                    }
                    MixResp = resp_main;
                    sts = 200;
                } else {
                    if (fu__in__admntblmdl) {
                        resp_main = {
                            user_photo: user.admin_user_photo,
                            success: true,
                            message: "Profile Photo Updated."
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