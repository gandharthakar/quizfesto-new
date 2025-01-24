import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface Respo {
    success: boolean,
    message: string
}

export async function DELETE(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 200;
    let isTrueAdminUser: boolean = false;

    try {

        const body = await req.json();
        const { token, question_id } = body;

        if (token && question_id) {

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
                    const existingQuestion = await prisma.qF_Question.findFirst({
                        where: {
                            question_id
                        }
                    });

                    if (existingQuestion !== null) {
                        await prisma.qF_Question.delete({
                            where: {
                                question_id
                            }
                        });
                        sts = 200;
                        resp = {
                            success: true,
                            message: "Question Deleted Successfully!"
                        }
                    } else {
                        sts = 200;
                        resp = {
                            success: false,
                            message: "Question Not Found!",
                        }
                    }
                } else {
                    resp = {
                        success: false,
                        message: 'User Not Found.',
                    }
                    sts = 200;
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
        if (error.message.endsWith("Invalid value provided. Expected StringFilter or String, provided Int.")) {
            sts = 500;
            resp = {
                success: false,
                message: "Question Not Exist!"
            }
        } else {
            // sts = 500;
            // resp = {
            //     success: false,
            //     message: error.message
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
        }
        return NextResponse.json(resp, { status: sts });
    }
}