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
    cat_data: Cats
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: '',
        cat_data: {
            category_id: '',
            category_title: '',
            category_slug: ''
        }
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const { category_id } = body;
        if (category_id) {
            const existingCat = await prisma.qF_Quiz_Category.findFirst({
                where: {
                    category_id
                }
            });
            if (existingCat) {
                sts = 200;
                resp = {
                    success: true,
                    message: "Category Exist!",
                    cat_data: {
                        category_id: existingCat.category_id,
                        category_title: existingCat.category_title,
                        category_slug: existingCat.category_slug
                    }
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Category Not Exist!",
                    cat_data: {
                        category_id: '',
                        category_title: '',
                        category_slug: ''
                    }
                }
            }
        } else {
            sts = 400;
            resp = {
                success: false,
                message: "Missing Required Fields!",
                cat_data: {
                    category_id: '',
                    category_title: '',
                    category_slug: ''
                }
            }
        }

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        sts = 500;
        resp = {
            success: false,
            message: error.message,
            cat_data: {
                category_id: '',
                category_title: '',
                category_slug: ''
            }
        }
        return NextResponse.json(resp, { status: sts });
    }
}