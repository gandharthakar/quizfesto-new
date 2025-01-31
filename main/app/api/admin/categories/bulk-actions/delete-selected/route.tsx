import prisma from "@/app/libs/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sanitize } from "@/app/libs/sanitize";

interface Respo {
    success: boolean,
    message: string
}

const findCommonItems = (arr1: string[], arr2: string[]) => {
    return arr1.filter(item => arr2.includes(item));
}

const removeItemsFromArray = (fruitsArray: string[], itemsToRemove: string[]) => {
    return fruitsArray.filter(fruit => !itemsToRemove.includes(fruit));
}

const getFilteredQuizes = async (filter: string) => {
    const view_post = await prisma.qF_Quiz.findMany({
        where: {
            quiz_categories: {
                has: filter
            }
        }
    });
    return view_post;
}

const removeCategoryFromQuizes = async (categoryId: string) => {
    const posts = await getFilteredQuizes(categoryId);

    const updatedPosts = posts.map(post => {
        const updatedCategories = post.quiz_categories.filter(category => category !== categoryId);
        return {
            quiz_id: post.quiz_id,
            quiz_categories: updatedCategories
        };
    });

    await Promise.all(updatedPosts.map(post => prisma.qF_Quiz.update({ where: { quiz_id: post.quiz_id }, data: { quiz_categories: post.quiz_categories } })));
}

export async function DELETE(req: Request) {
    let resp: Respo = {
        success: false,
        message: ''
    }

    let sts: number = 200;
    let isTrueAdminUser: boolean = false;

    try {

        const body = await req.json();

        const token = sanitize(body.token);
        const s1 = sanitize(JSON.stringify(body.category_id_list));
        const category_id_list = JSON.parse(s1);

        // const { token, category_id_list } = body;

        if (token && category_id_list) {

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
                    const cat_list = await prisma.qF_Quiz_Category.findMany({
                        where: {
                            category_id: {
                                in: category_id_list
                            }
                        }
                    });

                    if (cat_list.length > 0) {
                        await prisma.qF_Quiz_Category.deleteMany({
                            where: {
                                category_id: {
                                    in: category_id_list
                                }
                            }
                        });
                        sts = 200;
                        resp = {
                            success: true,
                            message: "Selected Categories Deleted Successfully!"
                        }

                        // Remove 'Selected' Categories From Home Top Categories List. 
                        const hcats = await prisma.qF_Homepage_Categories.findFirst();
                        if (hcats !== null) {
                            const commonIDs = findCommonItems(category_id_list, hcats.home_cats);
                            if (commonIDs.length > 0) {
                                const updated = removeItemsFromArray(hcats.home_cats, category_id_list);
                                await prisma.qF_Homepage_Categories.update({
                                    where: {
                                        home_cat_id: hcats.home_cat_id
                                    },
                                    data: {
                                        home_cats: updated
                                    }
                                });
                            }
                        }

                        // Remove 'Selected' Categories From List Of Associative Quizes. 
                        for (let i = 0; i < category_id_list.length; i++) {
                            await removeCategoryFromQuizes(category_id_list[i]);
                        }
                    } else {
                        sts = 200;
                        resp = {
                            success: false,
                            message: "No Categories Found!"
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
                message: "Missing Required Fields!"
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