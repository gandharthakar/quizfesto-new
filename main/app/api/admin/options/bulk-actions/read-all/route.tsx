import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";

interface QF_Opt {
    option_id: string,
    options: string[],
    question_text: string | Promise<string>
}

interface Respo {
    success: boolean,
    message: string,
    options_list?: QF_Opt[]
}

const getQT = async (qid: string) => {
    const ques = await prisma.qF_Question.findFirst({
        where: {
            question_id: qid
        }
    });

    return ques?.question_title;
}

const getOpts = async () => {
    const data = await prisma.qF_Option.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    const opts: QF_Opt[] = [];
    for (let i = 0; i < data.length; i++) {
        const obj = {
            option_id: data[i].option_id,
            options: data[i].options,
            question_text: await getQT(data[i].questionid) ?? ""
        }
        opts.push(obj);
    }
    return opts;
}

export async function GET(req: NextRequest) {
    let resp: Respo = {
        success: false,
        message: '',
    }

    let sts: number = 200;
    let isTrueAdminUser: boolean = false;

    try {

        const searchParams = req.nextUrl.searchParams;
        const token = searchParams.get('token');
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
                const data = await prisma.qF_Option.findMany();
                if (data.length > 0) {
                    sts = 200;
                    resp = {
                        success: true,
                        message: "Options Found!",
                        options_list: await getOpts()
                    }
                } else {
                    sts = 200;
                    resp = {
                        success: false,
                        message: "No Options Found!",
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