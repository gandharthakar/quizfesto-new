import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { Prisma } from '@prisma/client'

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
        const { category_id, category_title, category_slug } = body;
        if (category_id && category_title && category_slug) {
            const existingCat = await prisma.qF_Quiz_Category.findFirst({
                where: {
                    category_id
                }
            });

            if (existingCat) {
                if (existingCat.category_title == category_title) {
                    sts = 200;
                    resp = {
                        success: false,
                        message: "Category Already Exist!"
                    }
                } else {
                    await prisma.qF_Quiz_Category.update({
                        where: {
                            category_id
                        },
                        data: {
                            category_title,
                            category_slug
                        }
                    });
                    sts = 200;
                    resp = {
                        success: true,
                        message: "Category Updated Successfully!"
                    }
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Category Not Exist!"
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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (error.code === 'P2002') {
                console.log('There is a unique constraint violation, a new user cannot be created with this email');
                sts = 200;
                resp = {
                    success: false,
                    message: "Category Already Exist!"
                }
            }
        }
        return NextResponse.json(resp, { status: sts });
    }
}