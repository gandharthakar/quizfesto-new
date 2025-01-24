'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { useState } from "react";
import AdminBreadcrumbs from "@/app/components/admin/adminBreadcrumbs";
import { AdminOptionsFormVS, AdminOptionsValidationSchema } from "@/app/libs/zod/schemas/adminValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";

function Page() {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminOptionsFormVS>({
        resolver: zodResolver(AdminOptionsValidationSchema),
    });

    const handleFormSubmit: SubmitHandler<AdminOptionsFormVS> = async (formdata) => {
        setIsLoading(true);
        const baseURI = window.location.origin;
        const token = getCookie(adminAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/admin/options/crud/create`, {
                method: "POST",
                body: JSON.stringify({
                    token,
                    options: formdata.options.split(", "),
                    correct_option: formdata.correct_option,
                    question_id: formdata.question_id
                })
            });
            if (!resp.ok) {
                setIsLoading(false);
            }
            const body = await resp.json();
            if (body.success) {
                Swal.fire({
                    title: "Success!",
                    text: body.message,
                    icon: "success",
                    timer: 3000
                });
                reset();
                setIsLoading(false);
            } else {
                Swal.fire({
                    title: "Error!",
                    text: body.message,
                    icon: "error",
                    timer: 3000
                });
                setIsLoading(false);
            }
            //eslint-disable-next-line
        } catch (error: any) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
                timer: 4000
            });
        }
    }

    const breadcrumbsMenu = [
        {
            menu_item_id: 1,
            menu_title: "Options",
            menu_slug: "/admin/options",
            clickable: true
        },
        {
            menu_item_id: 2,
            menu_title: "Add New Options",
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
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="flex gap-[20px] items-start flex-col xl-s2:flex-row">
                        <div className="w-full xl-s2:flex-1 xl-s2:w-auto">
                            <div className="transition-all delay-75 border-[2px] border-solid p-[15px] md:p-[25px] border-zinc-300 bg-white dark:bg-zinc-800 dark:border-zinc-600">
                                <div className="pb-[20px]">
                                    <label
                                        htmlFor="cq-quid"
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                    >
                                        Question ID <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="cq-quid"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        {...register("question_id")}
                                    />
                                    {errors.question_id && (<div className="ws-input-error mt-[2px]">{errors.question_id.message}</div>)}
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        htmlFor="cq-qzqtxt"
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                    >
                                        Options <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="cq-qzqtxt"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        {...register("options")}
                                    />
                                    {errors.options && (<div className="ws-input-error mt-[2px]">{errors.options.message}</div>)}
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        htmlFor="cq-qzqtxt"
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                    >
                                        Correct Option <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="cq-qzqtxt"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        {...register("correct_option")}
                                    />
                                    {errors.correct_option && (<div className="ws-input-error mt-[2px]">{errors.correct_option.message}</div>)}
                                </div>
                                <div className="text-right">
                                    {
                                        isLoading ?
                                            (<div className="spinner size-1"></div>)
                                            :
                                            (
                                                <button type="submit" title="Create Options" className="transition-all delay-75 inline-block concard px-[20px] md:px-[25px] py-[10px] md:py-[12px] text-center text-white font-noto_sans font-semibold text-[16px] md:text-[18px] hover:shadow-lg">
                                                    Create Options
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