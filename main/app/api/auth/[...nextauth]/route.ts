import prisma from "@/app/libs/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    pages: {
        signIn: '/sign-in'
    },
    callbacks: {
        async signIn({ user }) {
            // console.log(user);
            const { name, email, image } = user;
            const fuser = await prisma.qF_User.findUnique({
                where: {
                    user_email: email ?? ""
                }
            });
            if (!fuser) {
                const user = await prisma.qF_User.create({
                    data: {
                        user_full_name: name ?? "",
                        user_photo: image,
                        user_email: email ?? "",
                        user_password: "lifeupd@1234"
                    }
                });
                // console.log(user.userid);
                const token = jwt.sign({ is_auth_user: user.user_id }, process.env.JWT_SECRET ?? "", { expiresIn: '30d' });
                const cookieStore = await cookies();
                cookieStore.set({
                    name: 'is_auth_user',
                    value: token
                });
            } else {
                const id = fuser.user_id;
                const token = jwt.sign({ is_auth_user: id }, process.env.JWT_SECRET ?? "", { expiresIn: '1h' });
                const cookieStore = await cookies();
                cookieStore.set({
                    name: 'is_auth_user',
                    value: token
                });
            }
            return true;
        },
    },
    secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST }