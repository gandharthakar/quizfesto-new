import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { zodIssuesMyType } from "@/app/types/commonTypes";
import { AdminCreateUserValidationSchema } from "@/app/libs/zod/schemas/adminValidationSchemas";

interface Respo {
    success: boolean,
    message: string,
    errors?: zodIssuesMyType[]
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
        const user_full_name = sanitize(body.user_full_name);
        const user_email = sanitize(body.user_email);
        const user_password = sanitize(body.user_password);
        const user_conf_password = sanitize(body.user_conf_password);
        const s1 = sanitize(JSON.stringify(body.role));
        const role = JSON.parse(s1);
        const user_phone = sanitize(body.user_phone);
        const user_photo = sanitize(body.user_photo);
        const user_gender = sanitize(body.user_gender);
        const block_user = sanitize(body.block_user);

        // const {
        //     token,
        //     user_full_name,
        //     user_email,
        //     user_password,
        //     user_conf_password,
        //     role,
        //     user_phone,
        //     user_photo,
        //     user_gender,
        //     block_user
        // } = body;

        if (token && user_full_name && user_email && user_password && user_conf_password && role) {
            const valResult = AdminCreateUserValidationSchema.safeParse({
                full_name: user_full_name,
                email: user_email,
                role,
                password: user_password,
                confirmPassword: user_conf_password
            });
            if (valResult.success) {
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
                        if (user_password === user_conf_password) {

                            // Find existing user by email
                            const existinUserByEmail = await prisma.qF_User.findUnique({
                                where: {
                                    user_email
                                }
                            });
                            if (existinUserByEmail) {
                                sts = 200;
                                resp = {
                                    success: false,
                                    message: "User Already Exist."
                                }
                            } else {
                                const hashPassword = await hash(user_password, 10);
                                await prisma.qF_User.create({
                                    data: {
                                        user_full_name,
                                        user_photo,
                                        user_phone,
                                        user_email,
                                        role,
                                        user_password: hashPassword,
                                        user_gender,
                                        isBlockedByAdmin: block_user
                                    }
                                });
                                sts = 201;
                                resp = {
                                    success: true,
                                    message: "User Created Successfully."
                                }
                            }
                        } else {
                            sts = 422;
                            resp = {
                                success: false,
                                message: "Password & Confirm Password Doesn't Match."
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
        // resp = {
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