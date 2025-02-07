'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import AdminBreadcrumbs from "@/app/components/admin/adminBreadcrumbs";
import { AdminQuestionsFormVS, AdminQuestionsValidationSchema } from "@/app/libs/zod/schemas/adminValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";
import { useUpdateSingleQuestion } from "@/app/libs/tanstack-query/admin/mutations/adminQuestionsMutations";
import { callbackErrT1S2_ST1, callbackOnErrT1S2_ST1, callbackOnSucT1S2_ST1, QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";
import { useReadSingleQuestion } from "@/app/libs/tanstack-query/admin/queries/adminQueries";

function Page() {

    const token = getCookie(adminAuthUserCookieName);
    const params = useParams<{ question_id: string[] }>();
    const question_id = params.question_id[0];

    // const [isLoading, setIsLoading] = useState<boolean>(true);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<AdminQuestionsFormVS>({
        resolver: zodResolver(AdminQuestionsValidationSchema),
    });

    const updSinQues = useUpdateSingleQuestion({
        token,
        question_id,
        onSuccessCB: (resp) => callbackOnSucT1S2_ST1(resp),
        errorCB: (resp) => callbackErrT1S2_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S2_ST1(resp),
    })

    const handleFormSubmit: SubmitHandler<AdminQuestionsFormVS> = async (formdata) => {
        const tokenSub = getCookie(adminAuthUserCookieName);
        const prepData = {
            token: tokenSub ?? "",
            question_id,
            quiz_id: formdata.quiz_id,
            question_title: formdata.question_text,
            question_marks: formdata.question_marks
        }
        updSinQues.mutate(prepData);
    }

    const { data, isError, error, isSuccess, isLoading } = useReadSingleQuestion({
        token: token ?? "",
        question_id
    });

    useEffect(() => {
        if (isSuccess) {
            if (data.question) {
                setValue("quiz_id", data.question.quiz_id);
                setValue("question_text", data.question.question_title);
                setValue("question_marks", data.question.question_marks);
            }
        }

        QF_TQ_UEF_CatchErrorCB(isError, error);
        //eslint-disable-next-line
    }, [data, isSuccess, isError, error]);

    const breadcrumbsMenu = [
        {
            menu_item_id: 1,
            menu_title: "Questions",
            menu_slug: "/admin/questions",
            clickable: true
        },
        {
            menu_item_id: 2,
            menu_title: "Edit Question",
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
                    <div className="flex gap-[20px] items-start flex-col xl-s2:flex-row-reverse">
                        <div className="w-full xl-s2:flex-1 xl-s2:w-auto">
                            <div className="transition-all delay-75 border-[2px] border-solid p-[15px] md:p-[25px] border-zinc-300 bg-white dark:bg-zinc-800 dark:border-zinc-600">
                                <div className="pb-[20px]">
                                    <label
                                        htmlFor="cq-qzid"
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                    >
                                        Quiz ID <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="cq-qzid"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        placeholder="eg. 9c642378-921e-4745-b5e7-328634d01cb1"
                                        {...register("quiz_id")}
                                    />
                                    {errors.quiz_id && (<div className="ws-input-error mt-[2px]">{errors.quiz_id.message}</div>)}
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        htmlFor="cq-qzqtxt"
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                    >
                                        Question Text <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="cq-qzqtxt"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        placeholder="eg. What is GST ?"
                                        {...register("question_text")}
                                    />
                                    {errors.question_text && (<div className="ws-input-error mt-[2px]">{errors.question_text.message}</div>)}
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        htmlFor="cq-qzmrks"
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                    >
                                        Question Marks <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="cq-qzmrks"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        placeholder="eg. 100"
                                        {...register("question_marks", { valueAsNumber: true })}
                                    />
                                    {errors.question_marks && (<div className="ws-input-error mt-[2px]">{errors.question_marks.message}</div>)}
                                </div>
                                <div className="text-right">
                                    {
                                        (isLoading || updSinQues.isPending) ?
                                            (<div className="spinner size-1"></div>)
                                            :
                                            (
                                                <button type="submit" title="Update Question" className="transition-all delay-75 inline-block concard px-[20px] md:px-[25px] py-[10px] md:py-[12px] text-center text-white font-noto_sans font-semibold text-[16px] md:text-[18px] hover:shadow-lg">
                                                    Update Question
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