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
    home_cats: Cats[]
}

const getCatsLabel = async (id_list: string[]) => {
    const data = await prisma.qF_Quiz_Category.findMany({
        where: {
            category_id: {
                in: id_list
            }
        }
    });
    return data;
}

export async function GET() {
    let resp: Respo = {
        success: false,
        message: '',
        home_cats: []
    }

    let sts: number = 200;

    try {

        const data = await prisma.qF_Homepage_Categories.findFirst();
        if (data === null) {
            sts = 200;
            resp = {
                success: false,
                message: "No Categories Found!",
                home_cats: []
            }
        } else {
            sts = 200;
            resp = {
                success: true,
                message: "Categories Found!",
                home_cats: await getCatsLabel(data.home_cats)
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message,
            home_cats: []
        }
        return NextResponse.json(resp, { status: sts });
    }
}