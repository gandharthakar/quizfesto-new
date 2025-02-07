'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import AdminBreadcrumbs from "@/app/components/admin/adminBreadcrumbs";
import { AdminOptionsFormVS, AdminOptionsValidationSchema } from "@/app/libs/zod/schemas/adminValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";
import { useUpdateSingleOptions } from "@/app/libs/tanstack-query/admin/mutations/adminOptionsMutations";
import { callbackErrT1S2_ST1, callbackOnErrT1S2_ST1, callbackOnSucT1S2_ST1, QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";
import { useReadSingleOptions } from "@/app/libs/tanstack-query/admin/queries/adminQueries";

function Page() {

    const token = getCookie(adminAuthUserCookieName);
    const params = useParams<{ option_id: string[] }>();
    const option_id = params.option_id[0];

    // const [isLoading, setIsLoading] = useState<boolean>(true);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<AdminOptionsFormVS>({
        resolver: zodResolver(AdminOptionsValidationSchema),
    });

    const updSinOpts = useUpdateSingleOptions({
        token,
        option_id,
        onSuccessCB: (resp) => callbackOnSucT1S2_ST1(resp),
        errorCB: (resp) => callbackErrT1S2_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S2_ST1(resp),
    });

    const handleFormSubmit: SubmitHandler<AdminOptionsFormVS> = async (formdata) => {
        const tokenSub = getCookie(adminAuthUserCookieName);
        updSinOpts.mutate({
            token: tokenSub ?? "",
            option_id,
            options: formdata.options.split(", "),
            correct_option: formdata.correct_option,
            question_id: formdata.question_id
        });
    }

    const { data, isError, error, isSuccess, isLoading } = useReadSingleOptions({
        token: token ?? "",
        option_id
    });

    useEffect(() => {
        if (isSuccess) {
            if (data.option) {
                setValue("question_id", data.option.questionid);
                setValue("options", data.option.options.join(", "));
                setValue("correct_option", data.option.correct_option);
            }
        }

        QF_TQ_UEF_CatchErrorCB(isError, error);
        //eslint-disable-next-line
    }, [data, isSuccess, isError, error]);

    const breadcrumbsMenu = [
        {
            menu_item_id: 1,
            menu_title: "Options",
            menu_slug: "/admin/options",
            clickable: true
        },
        {
            menu_item_id: 2,
            menu_title: "Edit Options",
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
                                        placeholder="eg. 9c642378-921e-4745-b5e7-328634d01cb1"
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
                                        placeholder="eg. Opt1, Opt2, Opt3, Opt4"
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
                                        placeholder="eg. Opt3"
                                        {...register("correct_option")}
                                    />
                                    {errors.correct_option && (<div className="ws-input-error mt-[2px]">{errors.correct_option.message}</div>)}
                                </div>
                                <div className="text-right">
                                    {
                                        (isLoading || updSinOpts.isPending) ?
                                            (<div className="spinner size-1"></div>)
                                            :
                                            (
                                                <button type="submit" title="Update Options" className="transition-all delay-75 inline-block concard px-[20px] md:px-[25px] py-[10px] md:py-[12px] text-center text-white font-noto_sans font-semibold text-[16px] md:text-[18px] hover:shadow-lg">
                                                    Update Options
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