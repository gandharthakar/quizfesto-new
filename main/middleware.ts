import { NextResponse, NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
    const AdminToken = req.cookies.get('is_admin_user')?.value;
    const AuthUserToken = req.cookies.get('is_auth_user')?.value;

    const { pathname } = req.nextUrl;

    // Check if already logged in admin user.
    if (AdminToken && pathname === '/admin/login') {
        return NextResponse.redirect(new URL('/admin', req.url))
    }

    // Check if already logged in site user.
    if (AuthUserToken && (
        pathname === '/sign-in' ||
        pathname === '/sign-up' ||
        pathname === 'reset-password' ||
        pathname === 'forgot-password'
    )) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    // Protect admin routes
    // if (pathname.startsWith('/admin')) {
    //     if (!AdminToken) {
    //         return NextResponse.redirect(new URL('/admin/login', req.url))
    //     }
    // }

    // Protect user routes
    // if (pathname.startsWith("/play-quiz") || pathname.startsWith("/user") || pathname.startsWith("/submit-score")) {
    //     if (!AuthUserToken) {
    //         return NextResponse.redirect(new URL('/sign-in', req.url))
    //     }
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [

        "/sign-in",
        "/sign-up",
        "/reset-password",
        "/forgot-password",
        "/play-quiz",
        "/user/:path",
        "/submit-score",

        "/admin/login",
        "/admin:path",
        "/admin/settings/:path",
        "/admin/settings/password/:path",
        "/admin/quizes",
        "/admin/quizes/create-new-quiz",
        "/admin/quizes/edit-quiz/:path",
        "/admin/questions",
        "/admin/questions/create-new-question",
        "/admin/questions/edit-question/:path",
        "/admin/options",
        "/admin/options/create-new-options",
        "/admin/options/edit-options/:path",
        "/admin/categories",
        "/admin/categories/create-new-category",
        "/admin/categories/edit-category/:path",
        "/admin/categories/set_home_categories",
        "/admin/users",
        "/admin/users/create-new-user",
        "/admin/users/edit-user/:path",
        "/admin/prizes",
        "/admin/winners"
    ]
}