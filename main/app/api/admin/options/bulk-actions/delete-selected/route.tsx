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
        const { options_id_list } = body;

        const data = await prisma.qF_Option.findMany({
            where: {
                option_id: {
                    in: options_id_list
                }
            }
        });
        if (data.length > 0) {
            await prisma.qF_Option.deleteMany({
                where: {
                    option_id: {
                        in: options_id_list
                    }
                }
            });
            sts = 200;
            resp = {
                success: true,
                message: "Selected Options Deleted Successfully!",
            }
        } else {
            sts = 200;
            resp = {
                success: false,
                message: "No Options Found!",
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