'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import AdminSettingsNav from "@/app/components/admin/adminSettingsNav";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { AdminPhoneSettingsFormVS, AdminPhoneSettingsValidationSchema } from "@/app/libs/zod/schemas/adminValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";

function Page() {

    const param = useParams<{ userid: string[] }>();
    const user_id = param.userid[0];
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<AdminPhoneSettingsFormVS>({
        resolver: zodResolver(AdminPhoneSettingsValidationSchema),
    });

    const handleFormSubmit: SubmitHandler<AdminPhoneSettingsFormVS> = async (formdata) => {
        setIsLoading(true);
        const baseURI = window.location.origin;
        const token = getCookie(adminAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/admin/auth-user/settings/phone/set`, {
                method: 'POST',
                body: JSON.stringify({ token, user_phone: formdata.phone_number })
            });
            const body = await resp.json();
            if (body.success) {
                Swal.fire({
                    title: "Success!",
                    text: body.message,
                    icon: "success",
                    timer: 4000
                });
                //this will reload the page without doing SSR
                // router.refresh();
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
            setIsLoading(false);
        }
    }

    const getUser = async () => {
        setIsLoading(true);
        const baseURI = window.location.origin;
        const token = getCookie(adminAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/admin/auth-user/settings/phone/get?token=${token}`, {
                method: 'GET',
            });
            if (!resp.ok) {
                setIsLoading(false);
            }
            const body = await resp.json();
            if (body.success) {
                setValue("phone_number", body.user_phone);
                setIsLoading(false);
            } else {
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
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getUser();
        //eslint-disable-next-line
    }, []);

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

export default Page;