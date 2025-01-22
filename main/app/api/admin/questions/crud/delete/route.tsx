import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface Respo {
    success: boolean,
    message: string
}

export async function DELETE(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { question_id } = body;

        if (question_id) {
            const existingQuestion = await prisma.qF_Question.findFirst({
                where: {
                    question_id
                }
            });

            if (existingQuestion !== null) {
                await prisma.qF_Question.delete({
                    where: {
                        question_id
                    }
                });
                sts = 200;
                resp = {
                    success: true,
                    message: "Question Deleted Successfully!"
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Question Not Found!",
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
        if (error.message.endsWith("Invalid value provided. Expected StringFilter or String, provided Int.")) {
            sts = 500;
            resp = {
                success: false,
                message: "Question Not Exist!"
            }
        } else {
            sts = 500;
            resp = {
                success: false,
                message: error.message
            }
        }
        return NextResponse.json(resp, { status: sts });
    }
}