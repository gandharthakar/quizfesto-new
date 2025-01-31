import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";

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

        const token = sanitize(body.token);
        const s1 = sanitize(JSON.stringify(body.prize_type));
        const prize_type = Number(JSON.parse(s1));

        // const { token, prize_type } = body;

        if (token && prize_type) {

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
                    const getType = await prisma.qF_Winning_Prizes.findFirst({
                        where: {
                            prize_type
                        }
                    });
                    if (getType) {
                        await prisma.qF_Winning_Prizes.delete({
                            where: {
                                prize_type
                            },
                        });
                        sts = 200;
                        resp = {
                            success: true,
                            message: "Prize Deleted Successfully!"
                        }
                    } else {
                        sts = 200;
                        resp = {
                            success: false,
                            message: "No Prize Found!"
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
                message: "Missing Required Field."
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