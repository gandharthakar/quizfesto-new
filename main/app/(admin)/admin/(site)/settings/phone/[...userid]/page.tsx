'use client';

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import AdminSettingsNav from "@/app/components/admin/adminSettingsNav";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

function Page() {

    const param = useParams();
    const user_id = param.userid;
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const validationSchema = z.object({
        phone_number: z.string({
            required_error: "Please enter phone number.",
            invalid_type_error: "Phone Number must be in numeric format."
        }).trim().min(10).max(13)
            .refine((value) => !isNaN(Number(value)), {
                message: 'Invalid phone number format (must be digits)',
            }),
    });

    type validationSchema = z.infer<typeof validationSchema>;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<validationSchema>({
        resolver: zodResolver(validationSchema),
    });

    const handleFormSubmit: SubmitHandler<validationSchema> = async (formdata) => {
        setIsLoading(true);
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/admin/auth-user/settings/phone/set`, {
            method: 'POST',
            body: JSON.stringify({ user_id, user_phone: formdata.phone_number })
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
    }

    const getUser = async () => {
        setIsLoading(true);
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/admin/auth-user/settings/phone/get`, {
            method: 'POST',
            body: JSON.stringify({ user_id }),
        });
        const body = await resp.json();
        if (body.success) {
            setValue("phone_number", body.user_phone);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getUser();
        //eslint-disable-next-line
    }, []);

    return (
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
    )
}

export default Page;