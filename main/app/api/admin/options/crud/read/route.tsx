import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface QF_Opt {
    option_id: string,
    options: string[],
    correct_option: string,
    questionid: string
}

interface Respo {
    success: boolean,
    message: string,
    option: QF_Opt
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: '',
        option: {
            option_id: '',
            options: [],
            correct_option: '',
            questionid: ''
        }
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { option_id } = body;

        if (option_id) {
            const existingOptions = await prisma.qF_Option.findFirst({
                where: {
                    option_id
                }
            });

            if (existingOptions !== null) {
                sts = 200;
                resp = {
                    success: true,
                    message: "Option Exist!",
                    option: {
                        option_id: existingOptions.option_id,
                        options: existingOptions.options,
                        correct_option: existingOptions.correct_option,
                        questionid: existingOptions.questionid
                    }
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Option Not Exist!",
                    option: {
                        option_id: '',
                        options: [],
                        correct_option: '',
                        questionid: ''
                    }
                }
            }
        } else {
            sts = 400;
            resp = {
                success: false,
                message: "Missing Required Fields!",
                option: {
                    option_id: '',
                    options: [],
                    correct_option: '',
                    questionid: ''
                }
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message,
            option: {
                option_id: '',
                options: [],
                correct_option: '',
                questionid: ''
            }
        }
        return NextResponse.json(resp, { status: sts });
    }
}