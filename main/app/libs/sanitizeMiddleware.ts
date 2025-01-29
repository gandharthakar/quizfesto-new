// lib/sanitizeMiddleware.js
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeHtml } from './sanitize';  // Assuming you already created the sanitize.js utility

// Middleware to sanitize request body and query parameters
export const sanitizeRequest = (req: NextRequest, res: NextResponse, next: () => void) => {
    if (req.body) {
        // Sanitize request body if it's provided (typically POST, PUT requests)
        req.body = sanitizeHtml(req.body);
    }

    if (req.query) {
        // Sanitize query parameters if they are provided
        Object.keys(req.query).forEach((key) => {
            req.query[key] = sanitizeHtml(req.query[key]);
        });
    }

    if (req.params) {
        // Sanitize route parameters if they exist
        Object.keys(req.params).forEach((key) => {
            req.params[key] = sanitizeHtml(req.params[key]);
        });
    }

    next();
};
