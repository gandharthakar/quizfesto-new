import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { userLoginValidationSchema } from "@/app/libs/zod/schemas/userAreaValidationSchemas";
import { CommonAPIResponseWithZodError } from "@/app/types/commonTypes";

export async function POST(req: Request) {
    let resp: CommonAPIResponseWithZodError = {
        success: false,
        message: ''
    }

    let sts: number = 200;

    try {
        const body = await req.json();
        const email = sanitize(body.email);
        const password = sanitize(body.password);

        // const { email, password } = body;

        if (email && password) {
            const valResult = userLoginValidationSchema.safeParse({
                email,
                password
            });
            if (valResult.success) {
                const fuser = await prisma.qF_User.findUnique({
                    where: {
                        user_email: email
                    }
                });
                if (fuser) {
                    const isMatch = await compare(password, fuser.user_password);
                    if (isMatch) {
                        const token = jwt.sign({ is_auth_user: fuser.user_id }, process.env.JWT_SECRET ?? "", { expiresIn: '1h' });
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