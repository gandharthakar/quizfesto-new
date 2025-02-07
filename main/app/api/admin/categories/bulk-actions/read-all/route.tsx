import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { CategoriesType } from "@/app/types/components/website/componentsTypes";
import { CommonAPIResponse } from "@/app/types/commonTypes";

export async function GET(req: NextRequest) {
    let resp: (CommonAPIResponse & { cat_data?: CategoriesType[] }) = {
        success: false,
        message: '',
    }

    let sts: number = 200;
    let isTrueAdminUser: boolean = false;

    try {

        const searchParams = req.nextUrl.searchParams;
        const token = sanitize(searchParams.get('token'));
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

        return NextResponse.json(resp, { status: sts });
        //eslint-disable-next-line
    } catch (error: any) {
        // sts = 500;
        // resp = {
        //     success: false,
        //     message: error.message,
        // }
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
        return NextResponse.json(resp, { status: sts });
    }
}