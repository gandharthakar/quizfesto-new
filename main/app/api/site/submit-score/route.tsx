import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";

interface Respo {
    success: boolean,
    message: string
}

const getTodaysDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if necessary
    const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if necessary
    return `${year}-${month}-${day}`;
}
const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

export async function POST(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 400;

    try {

        const body = await req.json();
        const {
            quiz_total_question,
            quiz_total_marks,
            quiz_total_score,
            quiz_estimated_time,
            quiz_display_time,
            quiz_time_taken,
            quiz_id,
            quiz_title,
            quiz_correct_answers_count,
            user_id,
            quiz_cover_photo,

        } = body;

        if (quiz_total_question && quiz_total_marks && quiz_estimated_time && quiz_display_time && quiz_time_taken && quiz_id && quiz_title && user_id) {

            const ifAlready = await prisma.qF_User_Participation.findFirst({
                where: {
                    AND: [
                        {
                            quiz_id
                        },
                        {
                            user_id
                        }
                    ]
                }
            });

            const usr = await prisma.qF_User.findFirst({
                where: {
                    user_id
                }
            });
            const isUserBlocked = usr?.isBlockedByAdmin ?? "";

            if (ifAlready == null) {
                if (isUserBlocked == "false") {
                    await prisma.qF_User_Participation.create({
                        data: {
                            quiz_total_question,
                            quiz_total_marks,
                            quiz_total_score,
                            quiz_estimated_time,
                            quiz_display_time,
                            quiz_time_taken,
                            quiz_id,
                            quiz_title,
                            quiz_correct_answers_count,
                            user_id,
                            quiz_cover_photo: quiz_cover_photo ? quiz_cover_photo : '',
                        }
                    });

                    sts = 201;
                    resp = {
                        success: true,
                        message: "Score Submited Successfully!"
                    }

                    const existASU = await prisma.qF_Aggrigate_Scores.findFirst({
                        where: {
                            user_id
                        }
                    });
                    if (existASU !== null) {
                        const ags = existASU.aggregate_score + quiz_total_score;
                        await prisma.qF_Aggrigate_Scores.update({
                            where: {
                                user_id
                            },
                            data: {
                                user_id,
                                record_date: getTodaysDate(),
                                record_time: getCurrentTime(),
                                aggregate_score: ags
                            }
                        })
                    } else {
                        await prisma.qF_Aggrigate_Scores.create({
                            data: {
                                user_id,
                                record_date: getTodaysDate(),
                                record_time: getCurrentTime(),
                                aggregate_score: quiz_total_score
                            }
                        });
                    }
                } else {
                    sts = 200;
                    resp = {
                        success: false,
                        message: "You have no access to submit score because of admin block!"
                    }
                }
            } else {
                sts = 200;
                resp = {
                    success: false,
                    message: "Quiz Already Played By User!"
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
        return NextResponse.json(resp, { status: sts });
    }
}