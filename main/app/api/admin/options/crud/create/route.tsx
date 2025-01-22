import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

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
        const { question_id, options, correct_option } = body;

        if (question_id && options && correct_option) {
            await prisma.qF_Option.create({
                data: {
                    questionid: question_id,
                    options,
                    correct_option,
                }
            });
            sts = 201;
            resp = {
                success: true,
                message: "Options Created Successfully!"
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
        console.log(error.message);
        return NextResponse.json(resp, { status: sts });
    }
}