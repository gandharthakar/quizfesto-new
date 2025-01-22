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
        const { full_name, email, password, confirm_password } = body;

        if (full_name && email && password && confirm_password) {
            if (password === confirm_password) {

                // Find existing user by email
                const existinUserByEmail = await prisma.qF_User.findUnique({
                    where: {
                        user_email: email
                    }
                });

                if (existinUserByEmail) {
                    sts = 200;
                    resp = {
                        success: false,
                        message: "User Already Exist."
                    }
                } else {
                    const hashPassword = await hash(password, 10);
                    await prisma.qF_User.create({
                        data: {
                            user_full_name: full_name,
                            user_photo: '',
                            user_email: email,
                            user_password: hashPassword
                        }
                    });
                    sts = 201;
                    resp = {
                        success: true,
                        message: "User Registered Successfully."
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
                message: "Missing Required Field"
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