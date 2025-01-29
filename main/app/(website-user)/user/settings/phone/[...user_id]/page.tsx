'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import { userPhoneSettingsFormVS, userPhoneSettingsValidationSchema } from "@/app/libs/zod/schemas/userAreaValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import AuthChecker from "@/app/libs/authChecker";
import { siteAuthUserCookieName } from "@/app/constant/datafaker";
import { getCookie } from "cookies-next/client";

export default function Page() {

    const router = useRouter();
    const params = useParams<{ user_id: string[] }>();
    const user_id = params.user_id[0];

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<userPhoneSettingsFormVS>({
        resolver: zodResolver(userPhoneSettingsValidationSchema),
    });

    const handleFormSubmit: SubmitHandler<userPhoneSettingsFormVS> = async (formdata) => {
        setIsLoading(true);
        const baseURI = window.location.origin;
        const token = getCookie(siteAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/site/auth-user/update-single-user/phone`, {
                method: 'POST',
                body: JSON.stringify({ token, user_phone: formdata.phone_number })
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
                    timer: 4000
                });
                //this will reload the page without doing SSR
                router.refresh();
                setIsLoading(false);
            } else {
                Swal.fire({
                    title: "Error!",
                    text: body.message,
                    icon: "error",
                    timer: 4000
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

    const getUser = async () => {
        const baseURI = window.location.origin;
        const token = getCookie(siteAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/site/auth-user/get-single-user?token=${token}`, {
                method: 'GET',
            });
            if (!resp.ok) {
                setIsLoading(false);
            }
            const body = await resp.json();
            if (body.success) {
                setValue("phone_number", body.user.user_phone);
                setIsLoading(false);
            } else {
                Swal.fire({
                    title: "Error!",
                    text: body.message,
                    icon: "error",
                    timer: 4000
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

    useEffect(() => {
        getUser();
        //eslint-disable-next-line
    }, []);

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
                                isLoading ?
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