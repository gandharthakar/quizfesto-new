import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { userGeneralSettingsValidationSchema } from "@/app/libs/zod/schemas/userAreaValidationSchemas";
import { CommonAPIResponseWithZodError } from "@/app/types/commonTypes";

export async function POST(req: Request) {
    let sts: number = 200;

    let resp: CommonAPIResponseWithZodError = {
        success: false,
        message: '',
    }

    try {

        const body = await req.json();

        const token = sanitize(body.token);
        const user_full_name = sanitize(body.user_full_name);
        const user_email = sanitize(body.user_email);
        const user_gender = sanitize(body.user_gender);

        // const { token, user_full_name, user_email, user_gender } = body;

        if (token && user_full_name && user_email) {
            const valResult = userGeneralSettingsValidationSchema.safeParse({
                full_name: user_full_name,
                email: user_email
            });
            if (valResult.success) {
                const res = jwt.verify(token as string, process.env.JWT_SECRET ?? "") as { is_auth_user: string };

                if (res) {

                    const user_id = res.is_auth_user;

                    const user = await prisma.qF_User.findFirst({
                        where: {
                            user_id
                        }
                    });
                    if (user !== null) {
                        await prisma.qF_User.update({
                            where: {
                                user_id
                            },
                            data: {
                                user_full_name,
                                user_email,
                                user_gender
                            }
                        });
                        resp = {
                            success: true,
                            message: 'General Settings Updated.',
                        }
                        sts = 200;
                    } else {
                        resp = {
                            success: false,
                            message: 'User not found with this user id.',
                        }
                        sts = 200;
                    }
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