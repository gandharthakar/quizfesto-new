// pages/api/_middleware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const corsOptions = {
    origin: ["http://localhost:3000", "https://quizfesto-platform.vercel.app"], // Replace with your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs 
});

// export default cors(corsOptions);

export default function middleware(req: NextApiRequest, res: NextApiResponse) {
    cors(corsOptions)(req, res, () => {
        limiter(req, res, () => {
            // Your API route logic goes here
        });
    });
}