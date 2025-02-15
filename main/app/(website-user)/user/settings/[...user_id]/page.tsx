'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { userGeneralSettingsFormVS, userGeneralSettingsValidationSchema } from "@/app/libs/zod/schemas/userAreaValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import AuthChecker from "@/app/libs/authChecker";
import { siteAuthUserCookieName } from "@/app/constant/datafaker";
import { getCookie } from "cookies-next/client";
import { useUpdateWebAuthUserGenSettings } from "@/app/libs/tanstack-query/website/mutations/websiteAuthUserMutations";
import { callbackErrT1S2_ST1, callbackOnErrT1S2_ST1, callbackOnSucT1S2_ST1, QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";
import { useGetWebsiteAuthUserInfo } from "@/app/libs/tanstack-query/website/queries/websiteQueries";

export default function Page() {

    const token = getCookie(siteAuthUserCookieName);
    const params = useParams<{ user_id: string[] }>();
    const user_id = params.user_id[0];

    // const [isLoading, setIsLoading] = useState<boolean>(true);
    const [gender, setGender] = useState<string>('');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<userGeneralSettingsFormVS>({
        resolver: zodResolver(userGeneralSettingsValidationSchema),
    });

    const updAuthUser = useUpdateWebAuthUserGenSettings({
        onSuccessCB: (resp) => callbackOnSucT1S2_ST1(resp),
        errorCB: (resp) => callbackErrT1S2_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S2_ST1(resp),
        token
    });

    const handleFormSubmit: SubmitHandler<userGeneralSettingsFormVS> = async (formdata) => {
        const tokenSub = getCookie(siteAuthUserCookieName);
        updAuthUser.mutate({ token: tokenSub ?? "", user_full_name: formdata.full_name, user_email: formdata.email, user_gender: gender });
    }

    const { data, isError, error, isSuccess, isLoading } = useGetWebsiteAuthUserInfo(token ?? "");

    useEffect(() => {
        if (isSuccess) {
            if (data.user) {
                setValue("full_name", data.user.user_full_name);
                setValue("email", data.user.user_email);
                if (data.user.user_gender !== null) {
                    setGender(data.user.user_gender);
                }
            }
        }
        QF_TQ_UEF_CatchErrorCB(isError, error);
        //eslint-disable-next-line
    }, [data, isSuccess, isError, error]);

    return (
        <>
            <AuthChecker />
            <TokenChecker is_admin={false} />
            <input type="hidden" value={user_id} />
            <div className="pt-[25px] lg:pt-0">
                <div className="transition-all delay-75 bg-white border-[2px] border-solid border-zinc-300 px-[20px] py-[20px] md:px-[40px] md:py-[30px] lg:max-w-[800px] dark:bg-zinc-950 dark:border-zinc-700">
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="pb-[15px]">
                            <label
                                htmlFor="uasp-gsfn"
                                className="block transition-all delay-75 font-ubuntu font-semibold text-[16px] md:text-[18px] text-zinc-800 dark:text-zinc-300 mb-[5px]"
                            >
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="uasp-gsfn"
                                className="ws-input-m1"
                                autoComplete="off"
                                {...register("full_name")}
                            />
                            {errors.full_name && (<div className="ws-input-error">{errors.full_name.message}</div>)}
                        </div>

                        <div className="pb-[15px]">
                            <label
                                htmlFor="uasp-gseml"
                                className="block transition-all delay-75 font-ubuntu font-semibold text-[16px] md:text-[18px] text-zinc-800 dark:text-zinc-300 mb-[5px]"
                            >
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="uasp-gseml"
                                className="ws-input-m1"
                                autoComplete="off"
                                {...register("email")}
                            />
                            {errors.email && (<div className="ws-input-error">{errors.email.message}</div>)}
                        </div>
                        <div className="pb-[15px]">
                            <label
                                htmlFor="uasp-gender"
                                className="block transition-all delay-75 font-ubuntu font-semibold text-[16px] md:text-[18px] text-zinc-800 dark:text-zinc-300 mb-[5px]"
                            >
                                Gender
                            </label>
                            <select
                                name="user_gender"
                                id="uasp-gender"
                                className="ws-input-m1"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">-- Select --</option>
                                <option value="male">Male</option>
                                <option value="Female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="text-right pt-[15px]">
                            {
                                isLoading || updAuthUser.isPending ?
                                    (<div className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-200 font-semibold">Loading...</div>)
                                    :
                                    (
                                        <button type="submit" title="Save Changes" className="ws-button-m1">
                                            Save Changes
                                        </button>
                                    )
                            }
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}