import prisma from "@/app/libs/db";
import { CommonAPIResponse } from "@/app/types/commonTypes";
import { CategoriesType } from "@/app/types/components/website/componentsTypes";
import { NextResponse } from "next/server";

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
    let resp: (CommonAPIResponse & { home_cats?: CategoriesType[] }) = {
        success: false,
        message: '',
    }

    let sts: number = 200;

    try {

        const data = await prisma.qF_Homepage_Categories.findFirst();
        if (data === null) {
            sts = 200;
            resp = {
                success: false,
                message: "No Categories Found!",
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
        }
        return NextResponse.json(resp, { status: sts });
    }
}