'use client';

import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import { userPasswordSettingsFormVS, userPasswordSettingsValidationSchema } from "@/app/libs/zod/schemas/userAreaValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import AuthChecker from "@/app/libs/authChecker";
import { siteAuthUserCookieName } from "@/app/constant/datafaker";
import { getCookie } from "cookies-next/client";

export default function Page() {

    const router = useRouter();
    const params = useParams<{ user_id: string[0] }>();
    const user_id = params.user_id[0];

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfPassword, setShowConfPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<userPasswordSettingsFormVS>({
        resolver: zodResolver(userPasswordSettingsValidationSchema)
    });

    const handleFormSubmit: SubmitHandler<userPasswordSettingsFormVS> = async (formdata) => {
        setIsLoading(true);
        const baseURI = window.location.origin;
        const token = getCookie(siteAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/site/auth-user/update-single-user/password`, {
                method: 'POST',
                body: JSON.stringify({ token, user_password: formdata.password, confirm_password: formdata.confirm_password })
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
                                htmlFor="uasp-gspwd"
                                className="block transition-all delay-75 font-ubuntu font-semibold text-[16px] md:text-[18px] text-zinc-800 dark:text-zinc-300 mb-[5px]"
                            >
                                New Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="uasp-gspwd"
                                    className="ws-input-pwd-m1"
                                    autoComplete="off"
                                    {...register("password")}
                                />
                                {
                                    showPassword ?
                                        (<> <IoIosEyeOff size={20} className="transition-all delay-75 cursor-pointer text-zinc-700 hover:text-theme-color-2 absolute top-[11px] md:top-[13px] right-[10px] z-[2] dark:text-zinc-400 dark:hover:text-theme-color-2" onClick={() => setShowPassword(false)} /> </>)
                                        :
                                        (<> <IoIosEye size={20} className="transition-all delay-75 cursor-pointer text-zinc-700 hover:text-theme-color-2 absolute top-[11px] md:top-[13px] right-[10px] z-[2] dark:text-zinc-400 dark:hover:text-theme-color-2" onClick={() => setShowPassword(true)} /> </>)
                                }
                            </div>
                            {errors.password && (<div className="ws-input-error">{errors.password.message}</div>)}
                        </div>
                        <div className="pb-[15px]">
                            <label
                                htmlFor="uasp-gscnfpwd"
                                className="block transition-all delay-75 font-ubuntu font-semibold text-[16px] md:text-[18px] text-zinc-800 dark:text-zinc-300 mb-[5px]"
                            >
                                Confirm New Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfPassword ? "text" : "password"}
                                    id="uasp-gscnfpwd"
                                    className="ws-input-pwd-m1"
                                    autoComplete="off"
                                    {...register("confirm_password")}
                                />
                                {
                                    showConfPassword ?
                                        (<> <IoIosEyeOff size={20} className="transition-all delay-75 cursor-pointer text-zinc-700 hover:text-theme-color-2 absolute top-[11px] md:top-[13px] right-[10px] z-[2] dark:text-zinc-400 dark:hover:text-theme-color-2" onClick={() => setShowConfPassword(false)} /> </>)
                                        :
                                        (<> <IoIosEye size={20} className="transition-all delay-75 cursor-pointer text-zinc-700 hover:text-theme-color-2 absolute top-[11px] md:top-[13px] right-[10px] z-[2] dark:text-zinc-400 dark:hover:text-theme-color-2" onClick={() => setShowConfPassword(true)} /> </>)
                                }
                            </div>
                            {errors.confirm_password && (<div className="ws-input-error">{errors.confirm_password.message}</div>)}
                        </div>
                        <div className="text-right pt-[15px]">
                            {
                                isLoading ?
                                    (<div className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-200 font-semibold">Loading...</div>)
                                    :
                                    (
                                        <button type="submit" title="Change Password" className="ws-button-m1">
                                            Change Password
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