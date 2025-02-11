import prisma from "@/app/libs/db";
import { CommonAPIResponse } from "@/app/types/commonTypes";
import { QF_PUBPrizesDataType } from "@/app/types/libs/tanstack-query/website/websiteCommonTypes";
import { NextResponse } from "next/server";

export async function GET() {

    let resp: (CommonAPIResponse & { prizes?: QF_PUBPrizesDataType[] }) = {
        success: false,
        message: ''
    }

    let sts: number = 200;

    try {
        const data = await prisma.qF_Winning_Prizes.findMany();
        if (data.length > 0) {
            sts = 200;
            resp = {
                success: true,
                message: "Prizes Found!",
                prizes: data,
            }
            return NextResponse.json(resp, { status: sts });
        } else {
            sts = 200;
            resp = {
                success: true,
                message: "No Prizes Found!",
            }
            return NextResponse.json(resp, { status: sts });
        }
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message,
        }
        return NextResponse.json(resp, { status: sts });
    }
}