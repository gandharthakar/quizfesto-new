import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";
import { RTSPkgSelectType } from "@/app/types/components/admin/componentsTypes";
import { CommonAPIResponse } from "@/app/types/commonTypes";
import { QF_AGetHomeCatsDataType } from "@/app/types/libs/tanstack-query/admin/adminCategoriesTypes";
import { sanitize } from "@/app/libs/sanitize";

const getCatsLabel = async (id_list: string[]) => {
    const data = await prisma.qF_Quiz_Category.findMany({
        where: {
            category_id: {
                in: id_list
            }
        }
    });
    const cts: RTSPkgSelectType[] = [];
    for (let i = 0; i < data.length; i++) {
        const obj = {
            value: data[i].category_id,
            label: data[i].category_title
        }
        cts.push(obj);
    }
    return cts;
}

export async function GET(req: NextRequest) {
    let resp: (CommonAPIResponse & QF_AGetHomeCatsDataType) = {
        success: false,
        message: ''
    }

    let sts: number = 200;
    let isTrueAdminUser: boolean = false;

    try {

        const searchParams = req.nextUrl.searchParams;
        const token = sanitize(searchParams.get('token'));

        if (token) {

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
                    const data = await prisma.qF_Homepage_Categories.findFirst();

                    if (data === null) {
                        sts = 200;
                        resp = {
                            success: false,
                            message: 'No Categories Found!',
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
                message: "Missing Required Fields!",
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