import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface homeCats {
    value: string,
    label: string
}

interface Respo {
    success: boolean,
    message: string,
    home_cats: homeCats[],
    home_cats_id: string
}

const getCatsLabel = async (id_list: string[]) => {
    const data = await prisma.qF_Quiz_Category.findMany({
        where: {
            category_id: {
                in: id_list
            }
        }
    });
    const cts: homeCats[] = [];
    for (let i = 0; i < data.length; i++) {
        const obj = {
            value: data[i].category_id,
            label: data[i].category_title
        }
        cts.push(obj);
    }
    return cts;
}

export async function GET() {
    let resp: Respo = {
        success: false,
        message: '',
        home_cats: [],
        home_cats_id: ''
    }

    let sts: number = 400;

    try {

        const data = await prisma.qF_Homepage_Categories.findFirst();

        if (data === null) {
            sts = 200;
            resp = {
                success: false,
                message: 'No Categories Found!',
                home_cats: [],
                home_cats_id: ''
            }
        } else {
            sts = 200;
            resp = {
                success: true,
                message: 'Categories Found!',
                home_cats: await getCatsLabel(data.home_cats),
                home_cats_id: data.home_cat_id
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message,
            home_cats: [],
            home_cats_id: ''
        }
        return NextResponse.json(resp, { status: sts });
    }
}