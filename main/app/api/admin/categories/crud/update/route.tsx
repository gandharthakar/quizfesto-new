import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { Prisma } from '@prisma/client';
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";

interface Respo {
    success: boolean,
    message: string
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 200;
    let isTrueAdminUser: boolean = false;

    try {

        const body = await req.json();

        const token = sanitize(body.token);
        const category_id = sanitize(body.category_id);
        const category_title = sanitize(body.category_title);
        const category_slug = sanitize(body.category_slug);

        // const { token, category_id, category_title, category_slug } = body;
        if (token && category_id && category_title && category_slug) {

            const res = jwt.verify(token as string, process.env.JWT_SECRET ?? "") as { is_admin_user: string };

            if (res) {

                const user_id = res.is_admin_user;

                const fu__in__usrtblmdl = await prisma.qF_User.findFirst({
                    where: {
                        AND: [
                            {
                                user_id
                            },
                            {
                                role: "Admin"
                            }
                        ]
                    }
                });
                const fu__in__admntblmdl = await prisma.qF_Admin_User.findFirst({
                    where: {
                        admin_user_id: user_id,
                    }
                });

                if (fu__in__usrtblmdl) {
                    isTrueAdminUser = true;
                } else {
                    if (fu__in__admntblmdl) {
                        isTrueAdminUser = true;
                    } else {
                        isTrueAdminUser = false;
                    }
                }

                if (isTrueAdminUser) {
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
                    sts = 200;
                    resp = {
                        success: false,
                        message: "User Not Found."
                    }
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
        // sts = 500;
        // resp = {
        //     success: false,
        //     message: error.message
        // }
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
        } else {
            if (error.message == "jwt expired") {
                resp = {
                    success: false,
                    message: "Your session is expired, Please login again."
                }
            } else if (error.message == "jwt malformed" || error.message == "jwt must be a string") {
                resp = {
                    success: false,
                    message: "Wrong information provided."
                }
            } else if (error.message == "invalid signature" || error.message == "invalid token") {
                resp = {
                    success: false,
                    message: "Invalid information provided."
                }
            } else if (error.message == "jwt must be provided") {
                sts = 400;
                resp = {
                    success: false,
                    message: "Missing required fields."
                }
            } else {
                resp = {
                    success: false,
                    message: error.message
                }
            }
        }
        return NextResponse.json(resp, { status: sts });
    }
}