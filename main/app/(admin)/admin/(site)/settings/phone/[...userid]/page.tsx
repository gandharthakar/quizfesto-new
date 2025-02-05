'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import AdminSettingsNav from "@/app/components/admin/adminSettingsNav";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { AdminPhoneSettingsFormVS, AdminPhoneSettingsValidationSchema } from "@/app/libs/zod/schemas/adminValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";
import { useGetAdminPhoneSettings } from "@/app/libs/tanstack-query/admin/queries/adminQueries";
import { callbackErrT1S2_ST1, callbackOnErrT1S2_ST1, callbackOnSucT1S2_ST1, QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";
import { useSetAdminPhoneSettings } from "@/app/libs/tanstack-query/admin/mutations/adminSettingsMutations";

function Page() {

    const token = getCookie(adminAuthUserCookieName);
    const param = useParams<{ userid: string[] }>();
    const user_id = param.userid[0];
    // const [isLoading, setIsLoading] = useState<boolean>(true);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<AdminPhoneSettingsFormVS>({
        resolver: zodResolver(AdminPhoneSettingsValidationSchema),
    });

    const updPhnSet = useSetAdminPhoneSettings({
        onSuccessCB: (resp) => callbackOnSucT1S2_ST1(resp),
        errorCB: (resp) => callbackErrT1S2_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S2_ST1(resp),
        token
    });

    const handleFormSubmit: SubmitHandler<AdminPhoneSettingsFormVS> = async (formdata) => {
        const tokenSub = getCookie(adminAuthUserCookieName);
        updPhnSet.mutate({
            token: tokenSub ?? "",
            user_phone: formdata.phone_number
        });
    }

    const { data, isError, error, isSuccess, isLoading } = useGetAdminPhoneSettings(token ?? "");

    useEffect(() => {
        if (isSuccess) {
            setValue("phone_number", data.user_phone);
        }

        QF_TQ_UEF_CatchErrorCB(isError, error);
        //eslint-disable-next-line
    }, [data, isSuccess, isError, error]);

    return (
        <>
            <input type="hidden" value={user_id} />
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
                                placeholder="Phone"
                                {...register("phone_number")}
                            />
                            {errors.phone_number && (<div className="ws-input-error">{errors.phone_number.message}</div>)}
                        </div>
                        <div className="text-right">
                            {
                                (isLoading || updPhnSet.isPending) ?
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