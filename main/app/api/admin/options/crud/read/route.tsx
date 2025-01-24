import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";

interface QF_Opt {
    option_id: string,
    options: string[],
    correct_option: string,
    questionid: string
}

interface Respo {
    success: boolean,
    message: string,
    option?: QF_Opt
}

export async function GET(req: NextRequest) {
    let resp: Respo = {
        success: false,
        message: '',
    }

    let sts: number = 200;
    let isTrueAdminUser: boolean = false;

    try {

        const searchParams = req.nextUrl.searchParams;
        const token = searchParams.get('token');
        const option_id = searchParams.get('option_id');

        if (token && option_id) {
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
                    const existingOptions = await prisma.qF_Option.findFirst({
                        where: {
                            option_id
                        }
                    });

                    if (existingOptions !== null) {
                        sts = 200;
                        resp = {
                            success: true,
                            message: "Option Exist!",
                            option: {
                                option_id: existingOptions.option_id,
                                options: existingOptions.options,
                                correct_option: existingOptions.correct_option,
                                questionid: existingOptions.questionid
                            }
                        }
                    } else {
                        sts = 200;
                        resp = {
                            success: false,
                            message: "Option Not Exist!",
                        }
                    }
                } else {
                    sts = 200;
                    resp = {
                        success: false,
                        message: "User Not Found."
                    }
                }
            }
        } else {
            sts = 400;
            resp = {
                success: false,
                message: "Missing Required Fields!",
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        // sts = 500;
        // resp = {
        //     success: false,
        //     message: error.message,
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