import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface Respo {
    success: boolean,
    message: string
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }
    let sts: number = 400;

    try {

        const body = await req.json();
        const { home_cats, home_cats_id } = body;

        if (home_cats || home_cats_id) {
            const existingCat = await prisma.qF_Homepage_Categories.findFirst();
            if (existingCat === null) {
                await prisma.qF_Homepage_Categories.create({
                    data: {
                        home_cats: home_cats
                    }
                });
                sts = 200;
                resp = {
                    success: true,
                    message: "Categories Added Successfully!"
                }
            } else {
                await prisma.qF_Homepage_Categories.update({
                    where: {
                        home_cat_id: home_cats_id,
                    },
                    data: {
                        home_cats: home_cats
                    }
                })
                sts = 200;
                resp = {
                    success: true,
                    message: "Categories Updated Successfully!"
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