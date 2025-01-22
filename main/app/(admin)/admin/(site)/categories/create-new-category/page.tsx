'use client';

import { useState } from "react";
import Swal from "sweetalert2";
import AdminBreadcrumbs from "@/app/components/admin/adminBreadcrumbs";
import { convertToSlug } from "@/app/libs/helpers/helperFunctions";
import TokenChecker from "@/app/libs/tokenChecker";

function Page() {

    const [catTitle, setCatTitle] = useState<string>("");
    const [catSlug, setCatSlug] = useState<string>("");
    const [catError, setCatError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (catTitle == "") {
            setCatError("Please enter category title.");
            if (catTitle.length < 2) {
                setCatError("Category title must be contains at least 2 characters.");
            } else {
                setCatError("");
            }
        } else {
            setCatError("");
        }
        setCatTitle(value);
        setCatSlug(convertToSlug(value));
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (catTitle == "") {
            setCatError("Please enter category title.");
            if (catTitle.length < 2) {
                setCatError("Category title must be contains at least 2 characters.");
            } else {
                setCatError("");
            }
        } else {
            setCatError("");
            setIsLoading(true);
            const prepData = {
                category_title: catTitle,
                category_slug: catSlug
            }
            const baseURI = window.location.origin;
            const resp = await fetch(`${baseURI}/api/admin/categories/crud/create`, {
                method: "POST",
                body: JSON.stringify(prepData)
            });
            const body = await resp.json();
            if (body.success) {
                setIsLoading(false);
                Swal.fire({
                    title: "Success!",
                    text: body.message,
                    icon: "success",
                    timer: 3000
                });
                setCatTitle("");
                setCatSlug("");
            } else {
                setIsLoading(false);
                Swal.fire({
                    title: "Error!",
                    text: body.message,
                    icon: "error",
                    timer: 3000
                });
            }
        }
    }

    const breadcrumbsMenu = [
        {
            menu_item_id: 1,
            menu_title: "Categories",
            menu_slug: "/admin/categories",
            clickable: true
        },
        {
            menu_item_id: 2,
            menu_title: "Create New Category",
            menu_slug: "",
            clickable: false
        }
    ];

    return (
        <>
            <TokenChecker is_admin={true} />
            <div className="py-[25px]">
                <div className="pb-[25px]">
                    <AdminBreadcrumbs
                        home_slug="/admin"
                        home_title="Admin Dashboard Home"
                        menuItems={breadcrumbsMenu}
                    />
                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className="flex gap-[20px] items-start flex-col xl-s2:flex-row-reverse">
                        <div className="w-full xl-s2:flex-1 xl-s2:w-auto">
                            <div className="transition-all delay-75 border-[2px] border-solid p-[15px] md:p-[25px] border-zinc-300 bg-white dark:bg-zinc-800 dark:border-zinc-600">
                                <div className="pb-[20px]">
                                    <label
                                        htmlFor="cq-catttl"
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                    >
                                        Category Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="cq-catttl"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        value={catTitle}
                                        onChange={handleInputChange}
                                    />
                                    {
                                        catError && (<div className="ws-input-error mt-[2px]">{catError}</div>)
                                    }
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        htmlFor="cq-catslug"
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                    >
                                        Category Slug
                                    </label>
                                    <input
                                        type="text"
                                        id="cq-catslug"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        readOnly={true}
                                        value={catSlug}
                                    />
                                </div>

                                <div className="text-right">
                                    {
                                        isLoading ?
                                            (<div className="spinner size-1"></div>)
                                            :
                                            (
                                                <button type="submit" title="Add Category" className="transition-all delay-75 inline-block concard px-[20px] md:px-[25px] py-[10px] md:py-[12px] text-center text-white font-noto_sans font-semibold text-[16px] md:text-[18px] hover:shadow-lg">
                                                    Add Category
                                                </button>
                                            )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Page;