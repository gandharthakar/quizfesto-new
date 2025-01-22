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

            const data = await prisma.qF_User_Participation.findMany({
                where: {
                    user_id
                }
            });

            if (data.length > 0) {
                await prisma.qF_User_Participation.deleteMany({
                    where: {
                        user_id
                    }
                });
                sts = 200;
                resp = {
                    success: true,
                    message: "Participation Data Reset Successfully!"
                }

                await prisma.qF_Aggrigate_Scores.delete({
                    where: {
                        user_id
                    }
                })
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Participation Data Not Found!"
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