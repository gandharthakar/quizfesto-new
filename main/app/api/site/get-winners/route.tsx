import prisma from "@/app/libs/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

interface WinUsrFrm {
    winner_id: string,
    winner_type: number,
    winning_position_text: string,
    user_full_name: string,
    user_profile_picture?: string
}

interface Respo {
    success: boolean,
    message: string,
    winners?: WinUsrFrm[]
}

const getWinnerPosTxt = (winType: number) => {
    let txt = '';
    switch (winType) {
        case 1:
            txt = 'st'
            break;
        case 2:
            txt = 'nd'
            break;
        case 3:
            txt = 'rd'
            break;
        default:
            txt = ''
            break;
    }

    return txt;
}

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

export async function GET() {

    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        const data = await prisma.qF_Winners.findMany();

        if (data.length > 0) {

            const arr: WinUsrFrm[] = [];

            for (let i = 0; i < data.length; i++) {
                const obj = {
                    winner_id: data[i].winner_id,
                    winner_type: data[i].winner_type,
                    winning_position_text: getWinnerPosTxt(data[i].winner_type),
                    user_full_name: await getUserDetails(data[i].user_id ?? "", true) ?? "",
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

            revalidatePath("/winners");
        } else {
            sts = 200;
            resp = {
                success: false,
                message: "No Winners Found!"
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