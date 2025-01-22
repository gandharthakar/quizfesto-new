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
        const { user_id } = body;

        if (user_id) {
            const DB_User = await prisma.qF_User.findFirst({
                where: {
                    user_id
                }
            });
            if (DB_User) {
                await prisma.qF_User.delete({
                    where: {
                        user_id
                    }
                });
                sts = 200;
                resp = {
                    success: true,
                    message: "User Deleted Successfully."
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "User Not Exist."
                }
            }
        } else {
            sts = 400;
            resp = {
                success: false,
                message: "Missing Required Fields!",
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