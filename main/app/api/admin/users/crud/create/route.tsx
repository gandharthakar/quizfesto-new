import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

interface Respo {
    success: boolean,
    message: string
}

export async function POST(req: Request) {

    let resp: Respo = {
        success: false,
        message: ''
    }


    let sts: number = 400;

    try {

        const body = await req.json();
        const {
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

        if (user_full_name && user_email && user_password && user_conf_password && role) {
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