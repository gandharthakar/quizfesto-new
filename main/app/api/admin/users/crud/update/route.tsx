import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";

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
        const {
            token,
            uid,
            user_full_name,
            user_email,
            user_password,
            user_conf_password,
            role,
            user_phone,
            user_photo,
            user_gender,
            block_user
        } = body;

        if (token && uid && user_full_name && user_email && role) {

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
                    // Find existing user by email
                    const existinUserByEmail = await prisma.qF_User.findUnique({
                        where: {
                            user_email
                        }
                    });
                    if (existinUserByEmail) {
                        if (user_password) {
                            if (user_password === user_conf_password) {
                                const hashPassword = await hash(user_password, 10);
                                await prisma.qF_User.update({
                                    where: {
                                        user_id: uid,
                                    },
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
                                sts = 200;
                                resp = {
                                    success: true,
                                    message: "User Updated Successfully."
                                }
                            } else {
                                sts = 422;
                                resp = {
                                    success: false,
                                    message: "Password & Confirm Password Doesn't Match."
                                }
                            }
                        } else {
                            await prisma.qF_User.update({
                                where: {
                                    user_id: uid,
                                },
                                data: {
                                    user_full_name,
                                    user_photo,
                                    user_phone,
                                    user_email,
                                    role,
                                    user_gender,
                                    isBlockedByAdmin: block_user
                                }
                            });
                            sts = 200;
                            resp = {
                                success: true,
                                message: "User Updated Successfully."
                            }
                        }
                    } else {
                        sts = 200;
                        resp = {
                            success: false,
                            message: "User Not Exist."
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