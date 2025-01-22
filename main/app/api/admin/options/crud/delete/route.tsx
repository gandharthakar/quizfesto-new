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
        const { option_id } = body;

        if (option_id) {
            const existingOptions = await prisma.qF_Option.findFirst({
                where: {
                    option_id
                }
            });

            if (existingOptions !== null) {
                await prisma.qF_Option.delete({
                    where: {
                        option_id
                    }
                });
                sts = 200;
                resp = {
                    success: true,
                    message: "Option Deleted Successfully!"
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Option Not Exist!",
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