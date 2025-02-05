'use client';

import AdminSettingsNav from "@/app/components/admin/adminSettingsNav";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminGeneralSettingsFormVS, AdminGeneralSettingsValidationSchema } from "@/app/libs/zod/schemas/adminValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";
import { useGetAdminGeneralSettings } from "@/app/libs/tanstack-query/admin/queries/adminQueries";
import { callbackErrT1S2_ST1, callbackOnErrT1S2_ST1, callbackOnSucT1S2_ST1, QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";
import { useSetAdminGeneralSettings } from "@/app/libs/tanstack-query/admin/mutations/adminSettingsMutations";

const Page = () => {

    const token = getCookie(adminAuthUserCookieName);
    const param = useParams<{ userid: string[] }>();
    const AuthUser = param.userid[0];
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    const [gender, setGender] = useState<string>("");

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<AdminGeneralSettingsFormVS>({
        resolver: zodResolver(AdminGeneralSettingsValidationSchema),
    });

    const updGenSet = useSetAdminGeneralSettings({
        onSuccessCB: (resp) => callbackOnSucT1S2_ST1(resp),
        errorCB: (resp) => callbackErrT1S2_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S2_ST1(resp),
        token
    });

    const handleFormSubmit: SubmitHandler<AdminGeneralSettingsFormVS> = async (formdata) => {
        const tokenSub = getCookie(adminAuthUserCookieName);
        updGenSet.mutate({
            token: tokenSub ?? "",
            user_full_name: formdata.full_name,
            user_email: formdata.email,
            user_gender: gender
        });
    }

    const { data, isError, isSuccess, isLoading, error } = useGetAdminGeneralSettings(token ?? "");

    useEffect(() => {

        if (isSuccess) {
            setValue("full_name", data.user_full_name);
            setValue("email", data.user_email);
            if (data.user_gender !== null) {
                setGender(data.user_gender);
            }
        }

        QF_TQ_UEF_CatchErrorCB(isError, error);
        //eslint-disable-next-line
    }, [data, isSuccess, isError, error]);

    return (
        <>
            <input type="hidden" value={AuthUser} />
            <TokenChecker is_admin={true} />
            <div className="pt-[15px] pb-[25px]">
                <div className="pb-[25px]">
                    <AdminSettingsNav />
                </div>

                <div className="lg:max-w-[500px]">
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="pb-[20px]">
                            <input
                                type="text"
                                id="uasp-gsfn"
                                className="ws-input-m1"
                                autoComplete="off"
                                placeholder="Full Name"
                                {...register("full_name")}
                            />
                            {errors.full_name && (<div className="ws-input-error">{errors.full_name.message}</div>)}
                        </div>
                        <div className="pb-[20px]">
                            <input
                                type="email"
                                id="uasp-gseml"
                                className="ws-input-m1"
                                autoComplete="off"
                                placeholder="Email"
                                {...register("email")}
                            />
                            {errors.email && (<div className="ws-input-error">{errors.email.message}</div>)}
                        </div>
                        <div className="pb-[20px]">
                            <select
                                name="user_gender"
                                id="cq-gender"
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
                        <div className="text-right">
                            {
                                (isLoading || updGenSet.isPending) ?
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

export default Page;