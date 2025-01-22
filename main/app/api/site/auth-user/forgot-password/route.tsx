import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
//eslint-disable-next-line
const emailTransporter = require("@/app/libs/nodemailer/emailConfig");
import jwt from "jsonwebtoken";

interface Respo {
    success: boolean,
    message: string,
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { user_email } = body;

        if (user_email) {
            const user = await prisma.qF_User.findFirst({
                where: {
                    user_email
                }
            });

            if (user) {
                const sec = process.env.JWT_SECRET ?? '';
                const token = jwt.sign({ userID: user.user_id }, sec, { expiresIn: '10m' })
                const link = `${process.env.NEXTAUTH_URL}/reset-password/${user.user_id}/${token}`;
                await emailTransporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user_email, // list of receivers
                    subject: "QuizFesto - Password Reset Link.", // Subject line
                    html: `<h4 style="font-family: 'Arial'; font-size: 20px; color: #575757; margin: 0px; padding: 0px; padding-bottom: 10px;">Dear User</h4><h5 style="font-family: 'Arial'; font-size: 16px; font-weight: 400; color: #575757; margin: 0px; padding: 0px; padding-bottom: 10px;">Below is your password reset link. This link is valid for 10 Mins.</h5><h5 style="font-family: 'Arial'; font-size: 16px; font-weight: 400; color: #575757; margin: 0px; padding: 0px;"><b>Password Reset Link :- </b> <a href="${link}" title="Click Here" target="_blank">Click Here</a></h5>`
                });
                sts = 200;
                resp = {
                    success: true,
                    message: 'Email has been sent to your registered email address.',
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: 'No user found with this email address.',
                }
            }
        } else {
            sts = 400;
            resp = {
                success: false,
                message: 'User email id is missing.',
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