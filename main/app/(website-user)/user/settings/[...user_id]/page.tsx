'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import { userGeneralSettingsFormVS, userGeneralSettingsValidationSchema } from "@/app/libs/zod/schemas/userAreaValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import AuthChecker from "@/app/libs/authChecker";
import { siteAuthUserCookieName } from "@/app/constant/datafaker";
import { getCookie } from "cookies-next/client";

export default function Page() {

    const router = useRouter();
    const params = useParams<{ user_id: string[] }>();
    const user_id = params.user_id[0];

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [gender, setGender] = useState<string>('');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<userGeneralSettingsFormVS>({
        resolver: zodResolver(userGeneralSettingsValidationSchema),
    });

    const handleFormSubmit: SubmitHandler<userGeneralSettingsFormVS> = async (formdata) => {
        setIsLoading(true);
        const baseURI = window.location.origin;
        const token = getCookie(siteAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/site/auth-user/update-single-user/general`, {
                method: 'POST',
                body: JSON.stringify({ token, user_full_name: formdata.full_name, user_email: formdata.email, user_gender: gender })
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
                setValue("full_name", body.user.user_full_name);
                setValue("email", body.user.user_email);
                if (body.user.user_gender !== null) {
                    setGender(body.user.user_gender);
                }
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