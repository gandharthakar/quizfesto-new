import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface Resp {
    success: boolean,
    message: string,
}

export async function POST(req: Request) {
    let resp: Resp = {
        success: false,
        message: ''
    }

    let sts: number = 200;

    try {

        const body = await req.json();
        const { token } = body;
        if (token) {
            const res = await jwt.verify(token, process.env.JWT_SECRET ?? "");
            if (res) {
                resp = {
                    success: true,
                    message: 'Token is valid.',
                }
                sts = 200;
            } else {
                resp = {
                    success: false,
                    message: 'Your session is ended. Please sign in again to continue.',
                }
                sts = 200;
            }
        } else {
            resp = {
                success: false,
                message: 'Missing required fields.',
            }
            sts = 400;
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