import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { convertDigitIn, getWinnerPosTxt } from "@/app/libs/helpers/helperFunctions";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { CommonAPIResponse } from "@/app/types/commonTypes";
import { QF_ARAWinnersDataType } from "@/app/types/libs/tanstack-query/admin/adminWinnersTypes";

const getUserDetails = async (user_id: string, onlyName: boolean) => {
    const data = await prisma.qF_User.findFirst({
        where: {
            user_id
        }
    });
    if (onlyName) {
        return data?.user_full_name
    } else {
        return data?.user_photo;
    }
}

export async function GET(req: NextRequest) {
    let resp: (CommonAPIResponse & { winners?: QF_ARAWinnersDataType[] }) = {
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
                    const data = await prisma.qF_Winners.findMany();

                    if (data.length > 0) {

                        const arr: QF_ARAWinnersDataType[] = [];
                        for (let i = 0; i < data.length; i++) {
                            const obj = {
                                winner_id: data[i].winner_id,
                                winner_type: data[i].winner_type,
                                winning_position_text: getWinnerPosTxt(data[i].winner_type),
                                user_id: data[i].user_id ?? "",
                                winner_date: convertDigitIn(data[i].winner_date),
                                user_full_name: await getUserDetails(data[i].user_id ?? "", true) ?? "",
                                winner_description: data[i].winner_description,
                                user_profile_picture: await getUserDetails(data[i].user_id ?? "", false) ?? "",
                            }
                            arr.push(obj);
                        }

                        // Sort winners by "winner_type" in ascending order
                        const sortedWinners = arr.sort((a, b) => a.winner_type - b.winner_type);

                        sts = 200;
                        resp = {
                            success: true,
                            message: "Winners Found!",
                            winners: sortedWinners
                        }
                    } else {
                        sts = 200;
                        resp = {
                            success: false,
                            message: "No Winners Found!"
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