import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { zodIssuesMyType } from "@/app/types/commonTypes";
import { AdminLoginValidationSchema } from "@/app/libs/zod/schemas/adminValidationSchemas";

interface Resp {
    success: boolean,
    message: string,
    token?: string,
    errors?: zodIssuesMyType[]
}

export async function POST(req: Request) {
    let resp: Resp = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        let isAdminSide: boolean = false;

        let isUserSide: boolean = false;

        let finalSide: boolean = false;

        //eslint-disable-next-line
        let finalUser: any = {};

        const body = await req.json();

        const admin_user_email = sanitize(body.admin_user_email);
        const admin_user_password = sanitize(body.admin_user_password);

        // const { admin_user_email, admin_user_password } = body;

        if (admin_user_email && admin_user_password) {
            const valResult = AdminLoginValidationSchema.safeParse({
                email: admin_user_email,
                password: admin_user_password
            });
            if (valResult.success) {
                const usr_a = await prisma.qF_Admin_User.findFirst({
                    where: {
                        admin_user_email
                    }
                });
                const usr_b = await prisma.qF_User.findFirst({
                    where: {
                        AND: [
                            {
                                user_email: admin_user_email
                            },
                            {
                                role: 'Admin'
                            }
                        ]
                    }
                });

                isAdminSide = usr_a ? true : false;
                isUserSide = usr_b ? true : false;

                if (isAdminSide) {
                    finalUser = usr_a;
                } else {
                    finalUser = {};
                    if (isUserSide) {
                        finalUser = usr_b;
                    } else {
                        finalUser = {};
                    }
                }

                if (usr_a || usr_b) {
                    finalSide = true;
                }

                if (finalSide) {

                    let isMatch: boolean = false;
                    if (isAdminSide) {
                        isMatch = await compare(admin_user_password, finalUser.admin_user_password);
                    } else {
                        if (isUserSide) {
                            isMatch = await compare(admin_user_password, finalUser.user_password);
                        }
                    }

                    let token: string = '';
                    if (isMatch) {
                        if (isAdminSide) {
                            token = jwt.sign({ is_admin_user: finalUser.admin_user_id }, process.env.JWT_SECRET ?? "", { expiresIn: '1h' });
                        } else {
                            if (isUserSide) {
                                token = jwt.sign({ is_admin_user: finalUser.user_id }, process.env.JWT_SECRET ?? "", { expiresIn: '1h' });
                            }
                        }
                    }
                    resp = {
                        success: true,
                        message: 'Admin Login Success !',
                        token
                    }
                    sts = 200;
                } else {
                    resp = {
                        success: false,
                        message: 'Admin Access Denied : Invalid User.',
                    }
                    sts = 200;
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Inputs validation errors",
                    errors: valResult.error.issues.map((err) => {
                        return { message: err.message, field: String(err.path[0]) }
                    })
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