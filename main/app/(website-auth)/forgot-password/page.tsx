'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_dark_mode, unset_dark_mode } from "@/app/libs/redux-service/slices/theme-mode/themeSwitcherSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { RootState } from "@/app/libs/redux-service/store";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { userForgotPasswordFormVS, userForgotPasswordValidationSchema } from "@/app/libs/zod/schemas/userAreaValidationSchemas";

export default function Page() {

    const router = useRouter();
    const AuthUser = useSelector((state: RootState) => state.auth_user_id.auth_user_id);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<userForgotPasswordFormVS>({
        resolver: zodResolver(userForgotPasswordValidationSchema)
    });

    const handleFormSubmit: SubmitHandler<userForgotPasswordFormVS> = async (formdata) => {
        setIsLoading(true);
        const resp = await fetch('/api/site/auth-user/forgot-password', {
            method: "POST",
            body: JSON.stringify({ user_email: formdata.email })
        });
        const body = await resp.json();
        if (body.success) {
            Swal.fire({
                title: "Success!",
                text: body.message,
                icon: "success",
                timer: 4000
            });
            setIsLoading(false);
            reset();
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

    useEffect(() => {
        const glsi = localStorage.getItem('site-dark-mode');
        const checkDM = glsi ? JSON.parse(glsi) : '';
        if (checkDM) {
            dispatch(set_dark_mode());
        } else {
            dispatch(unset_dark_mode());
        }
    });

    //eslint-disable-next-line
    const checkAuthUser = () => {
        if (AuthUser !== '') {
            router.push("/");
        }
    }

    useEffect(() => {
        checkAuthUser();
    }, [checkAuthUser]);

    return (
        <>
            <section className="transition-all delay-75 py-[50px] px-[15px] bg-zinc-100 min-h-screen relative dark:bg-zinc-950">
                {/* Overlay */}
                {/* <div className="absolute top-0 left-0 w-full h-full opacity-[0.7] bg-white z-[1]"></div> */}

                <div className="flex flex-col justify-center items-center min-h-[calc(100vh-100px)] relative z-[5]">
                    <div className="w-full text-center">
                        <Link href="/" title="Home">
                            <Image src="/images/quizfesto-logo-final.svg" width={130} height={28} className="inline-block w-[130px] h-[28px]" alt="logo" />
                        </Link>
                    </div>
                    <div className="w-full py-[20px] max-w-[400px] mx-auto">
                        <div className="concard-rev p-[4px]">
                            <div className="bg-white py-[20px] px-[15px] md:py-[25px] md:px-[50px] dark:bg-zinc-900">
                                <div className="pb-[15px] md:pb-[20px] text-center">
                                    <h1 className="font-noto_sans text-zinc-800 text-[20px] md:text-[25px] font-bold dark:text-zinc-200">
                                        Forgot Password
                                    </h1>
                                </div>

                                <form onSubmit={handleSubmit(handleFormSubmit)}>
                                    <div className="pb-[15px] md:pb-[15px]">
                                        <input
                                            type="email"
                                            autoComplete="off"
                                            className="ws-input-m1"
                                            placeholder="E-Mail"
                                            {...register("email")}
                                        />
                                        {errors.email && (<div className="ws-input-error">{errors.email.message}</div>)}
                                    </div>

                                    <div className="text-right pt-[10px]">
                                        {
                                            isLoading ?
                                                (<div className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-200 font-semibold">Sending ...</div>)
                                                :
                                                (
                                                    <button type="submit" title="Submit" className="ws-button-m1">
                                                        Submit
                                                    </button>
                                                )
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}