import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface Cats {
    category_id: string,
    category_title: string,
    category_slug: string
}

interface Respo {
    success: boolean,
    message: string,
    cat_data: Cats[]
}

export async function GET() {
    let resp: Respo = {
        success: false,
        message: '',
        cat_data: []
    }

    let sts: number = 400;

    try {

        const data = await prisma.qF_Quiz_Category.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (data.length > 0) {
            sts = 200;
            resp = {
                success: true,
                message: "Categories Found!",
                cat_data: data
            }
        } else {
            sts = 200;
            resp = {
                success: false,
                message: "No Categories Found!",
                cat_data: []
            }
        }
        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message,
            cat_data: []
        }
        return NextResponse.json(resp, { status: sts });
    }
}