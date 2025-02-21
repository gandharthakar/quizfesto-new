import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import { convertDigitIn } from "@/app/libs/helpers/helperFunctions";
import { type NextRequest } from 'next/server';
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";
import { CommonAPIResponse } from "@/app/types/commonTypes";

// interface QF_Winning_Record {
//     user_id: string,
//     aggregate_score: number,
//     record_date: string,
//     record_time: string
// }

// interface WinUsrFrm {
//     winner_id: string, 
//     winner_type: number, 
//     winning_possition_text: string, 
//     winner_user_id?: string,
//     winner_date: string,
//     user_full_name: string,
//     winner_description: string,
//     user_profile_picture?: string
// }

// interface Respo {
//     success: boolean,
//     message: string,
//     //eslint-disable-next-line
//     winners?: any[]
// }

//eslint-disable-next-line
const getWinner = (data: any[], minScore: number, maxScore: number, onlyMaxScore: boolean) => {
    // Function For Find User By Earlest Date.
    //eslint-disable-next-line
    const findEarliestDateUsers = (records: any[]) => {
        // Get the current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Filter records for the current month
        const filteredRecords = records.filter(record => {
            const recordDate = new Date(record.record_date);
            return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
        });

        // Find the earliest date among filtered records
        let earliestDate = filteredRecords[0].record_date;
        filteredRecords.forEach(record => {
            if (new Date(record.record_date) < new Date(earliestDate)) {
                earliestDate = record.record_date;
            }
        });

        // Get users with the earliest date
        const earliestDateUsers = filteredRecords.filter(record => record.record_date === earliestDate);

        return earliestDateUsers;
    }

    // Function For Find User By Earlest Time.
    //eslint-disable-next-line
    const findEarliestTimeUser = (records: any[]) => {
        // Get the current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Filter records for the current month
        const filteredRecords = records.filter(record => {
            const recordDate = new Date(record.record_date);
            return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
        });

        // Find the earliest time among filtered records
        let earliestTime = filteredRecords[0].record_time;
        filteredRecords.forEach(record => {
            if (new Date(`2000-01-01 ${record.record_time}`) < new Date(`2000-01-01 ${earliestTime}`)) {
                earliestTime = record.record_time;
            }
        });

        // Get the user with the earliest time
        const earliestTimeUser = filteredRecords.find(record => record.record_time === earliestTime);

        return earliestTimeUser;
    }

    const startDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        return `${year}-${month < 10 ? '0' + month : month}-01`;
    }

    const endDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const startDate = new Date(year, month, 1);
        return startDate.toISOString().slice(0, 10);
    }

    // Filter By Score.
    let fs = [];
    if (onlyMaxScore) {
        fs = data.filter((item) => item.aggregate_score > maxScore);
    } else {
        fs = data.filter((item) => (item.aggregate_score >= minScore && item.aggregate_score < maxScore));
    }
    // Filter By Date.
    const fd = fs.filter((item) => (item.record_date <= endDate() && item.record_date >= startDate()));
    // Check If found more than 1 Record only.
    if (fd.length > 1) {
        // Filter By Earliest date.
        const fde = findEarliestDateUsers(fd);
        // Filter By Earliest Time.
        const fte = findEarliestTimeUser(fde);
        return fte;
    } else {
        return fd;
    }
}

//eslint-disable-next-line
const prepScoreRecord = async (winData: any[], winType: number, WinTypeDscr: string) => {
    let obj = {};
    //eslint-disable-next-line
    let c1: any = {};
    const alreadyExist = await prisma.qF_Winners.findFirst({
        where: {
            winner_type: winType
        }
    });
    if (alreadyExist !== null) {
        c1 = {
            winner_id: alreadyExist.winner_id,
            user_id: alreadyExist.user_id,
            winner_type: alreadyExist.winner_type,
            winner_date: convertDigitIn(alreadyExist.winner_date),
            winner_description: alreadyExist.winner_description
        };
    } else {
        c1 = await prisma.qF_Winners.create({
            data: {
                winner_type: winType,
                user_id: winData[0].user_id,
                winner_date: winData[0].record_date,
                winner_description: `You scored ${winData[0].aggregate_score} in this month.`
            }
        });
    }
    const ufn = await prisma.qF_User.findFirst({ where: { user_id: c1.user_id }, select: { user_full_name: true } });
    const upp = await prisma.qF_User.findFirst({ where: { user_id: c1.user_id }, select: { user_photo: true } });
    obj = {
        winner_id: c1.winner_id,
        winner_type: winType,
        winning_position_text: WinTypeDscr,
        user_id: c1.winner_user_id,
        winner_date: convertDigitIn(c1.winner_date),
        user_full_name: ufn?.user_full_name,
        winner_description: c1.winner_description,
        user_profile_picture: upp?.user_photo
    }
    return obj;
}

export async function POST(req: NextRequest) {
    //eslint-disable-next-line
    let resp: (CommonAPIResponse & { winners?: any[] }) = {
        success: false,
        message: ''
    }

    let sts: number = 200;
    let isTrueAdminUser: boolean = false;

    try {

        const body = await req.json();
        const token = sanitize(body.token);
        // const searchParams = req.nextUrl.searchParams;
        // const token = sanitize(searchParams.get('token'));

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
                    const f1 = (await prisma.qF_Winning_Prizes.findFirst({
                        where: {
                            prize_type: 1
                        }
                    }))?.winning_score_limit
                    const f2 = (await prisma.qF_Winning_Prizes.findFirst({
                        where: {
                            prize_type: 2
                        }
                    }))?.winning_score_limit
                    const f3 = (await prisma.qF_Winning_Prizes.findFirst({
                        where: {
                            prize_type: 3
                        }
                    }))?.winning_score_limit

                    const data = await prisma.qF_Aggrigate_Scores.findMany();
                    if (data.length > 0) {
                        const propData = data.map((item) => {
                            return {
                                user_id: item.user_id ?? "",
                                aggregate_score: item.aggregate_score,
                                record_date: item.record_date,
                                record_time: item.record_time
                            }
                        });

                        // console.log(f1);
                        // console.log(f2);
                        // console.log(f3);
                        const first_winner = getWinner(propData, (f2 ? f2 : 20000), (f1 ? f1 : 25000), true);
                        const second_winner = getWinner(propData, (f3 ? f3 : 15000), (f2 ? f2 : 20000), false);
                        const third_winner = getWinner(propData, 0, (f3 ? f3 : 15000), false);
                        // console.log(third_winner);

                        let winner_1 = {};

                        let winner_2 = {};

                        let winner_3 = {};

                        //eslint-disable-next-line
                        let arr: any = [];

                        if (first_winner.length > 0) {
                            winner_1 = await prepScoreRecord(first_winner, 1, 'st');
                            arr.push(winner_1);
                        }

                        if (second_winner.length > 0) {
                            winner_2 = await prepScoreRecord(second_winner, 2, 'nd');
                            arr.push(winner_2);
                        }

                        if (third_winner.length > 0) {
                            winner_3 = await prepScoreRecord(third_winner, 3, 'rd');
                            arr.push(winner_3);
                        }

                        sts = 200;
                        resp = {
                            success: true,
                            message: "Records Found!",
                            winners: arr
                        }
                    } else {
                        sts = 200;
                        resp = {
                            success: false,
                            message: "No Records Found!"
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