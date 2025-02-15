'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { userPhoneSettingsFormVS, userPhoneSettingsValidationSchema } from "@/app/libs/zod/schemas/userAreaValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import AuthChecker from "@/app/libs/authChecker";
import { siteAuthUserCookieName } from "@/app/constant/datafaker";
import { getCookie } from "cookies-next/client";
import { useGetWebsiteAuthUserInfo } from "@/app/libs/tanstack-query/website/queries/websiteQueries";
import { callbackErrT1S2_ST1, callbackOnErrT1S2_ST1, callbackOnSucT1S2_ST1, QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";
import { useUpdateWebAuthUserPhoneSettings } from "@/app/libs/tanstack-query/website/mutations/websiteAuthUserMutations";

export default function Page() {

    const token = getCookie(siteAuthUserCookieName);
    const params = useParams<{ user_id: string[] }>();
    const user_id = params.user_id[0];

    // const [isLoading, setIsLoading] = useState<boolean>(true);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<userPhoneSettingsFormVS>({
        resolver: zodResolver(userPhoneSettingsValidationSchema),
    });

    const updPhnSet = useUpdateWebAuthUserPhoneSettings({
        onSuccessCB: (resp) => callbackOnSucT1S2_ST1(resp),
        errorCB: (resp) => callbackErrT1S2_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S2_ST1(resp),
        token
    });

    const handleFormSubmit: SubmitHandler<userPhoneSettingsFormVS> = async (formdata) => {
        const tokenSub = getCookie(siteAuthUserCookieName);
        updPhnSet.mutate({ token: tokenSub ?? "", user_phone: formdata.phone_number });
    }

    const { data, isError, error, isSuccess, isLoading } = useGetWebsiteAuthUserInfo(token ?? "");

    useEffect(() => {
        if (isSuccess) {
            if (data.user) {
                setValue("phone_number", data.user.user_phone);
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
                                htmlFor="uasp-gsephn"
                                className="block transition-all delay-75 font-ubuntu font-semibold text-[16px] md:text-[18px] text-zinc-800 dark:text-zinc-300 mb-[5px]"
                            >
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="uasp-gsephn"
                                className="ws-input-m1"
                                autoComplete="off"
                                {...register("phone_number")}
                            />
                            {errors.phone_number && (<div className="ws-input-error">{errors.phone_number.message}</div>)}
                        </div>
                        <div className="text-right pt-[15px]">
                            {
                                isLoading || updPhnSet.isPending ?
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