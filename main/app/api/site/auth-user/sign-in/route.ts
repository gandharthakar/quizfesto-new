import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

interface Respo {
    success: boolean,
    message: string,
    token?: string,
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {
        const body = await req.json();
        const { email, password } = body;

        if (email && password) {
            const fuser = await prisma.qF_User.findUnique({
                where: {
                    user_email: email
                }
            });
            if (fuser) {
                const isMatch = await compare(password, fuser.user_password);
                if (isMatch) {
                    const token = jwt.sign({ is_auth_user: fuser.user_id }, process.env.JWT_SECRET ?? "", { expiresIn: '30d' });
                    sts = 200;
                    resp = {
                        success: true,
                        message: "User Login Success !",
                        token
                    }
                } else {
                    sts = 422;
                    resp = {
                        success: false,
                        message: "Password Is Incorrect!"
                    }
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "User Not Found With This Email Address. Please Sign Up First Or Try To Sign In With Google."
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