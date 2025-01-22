import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface QF_User {
    user_id: string,
    user_name: string,
    user_role: string,
    user_block_status: string
}

interface Respo {
    success: boolean,
    message: string
    users: QF_User[]
}

export async function GET() {
    let resp: Respo = {
        success: false,
        message: '',
        users: []
    }

    let sts: number = 400;

    try {

        const data = await prisma.qF_User.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (data.length > 0) {
            const user = data.map((item) => {
                const obj = {
                    user_id: item.user_id,
                    user_name: item.user_full_name,
                    user_role: item.role ?? "",
                    user_block_status: item.isBlockedByAdmin ?? ""
                }
                return obj;
            });
            sts = 200;
            resp = {
                success: true,
                message: "Users found!",
                users: user
            }
        } else {
            sts = 200;
            resp = {
                success: false,
                message: "Users Not found!",
                users: []
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message,
            users: []
        }
        return NextResponse.json(resp, { status: sts });
    }
}