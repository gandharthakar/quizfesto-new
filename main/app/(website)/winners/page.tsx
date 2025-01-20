'use client';

import { WinnersType } from "@/app/types/pages/website/winnersPageTypes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Page() {

    const [haveWinners, setHaveWinners] = useState<boolean>(false);
    const [winData1, setWin1Data] = useState<WinnersType>();
    const [winData2, setWin2Data] = useState<WinnersType>();
    const [winData3, setWin3Data] = useState<WinnersType>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getWinners = async () => {
        const baseURI = window.location.origin;
        try {
            const resp = await fetch(`${baseURI}/api/site/get-winners`, {
                method: "GET",
            });
            if (!resp.ok) {
                setIsLoading(false);
                setHaveWinners(false);
            }
            const body = await resp.json();
            if (body.success) {
                if (body.winners.length > 0) {
                    setHaveWinners(true);
                    for (let i = 0; i < body.winners.length; i++) {
                        if (body.winners[i].winner_type === 1) {
                            setWin1Data(body.winners[i]);
                        }
                        if (body.winners[i].winner_type === 2) {
                            setWin2Data(body.winners[i]);
                        }
                        if (body.winners[i].winner_type === 3) {
                            setWin3Data(body.winners[i]);
                        }
                    }
                } else {
                    setHaveWinners(false);
                }
                setIsLoading(false);
            } else {
                Swal.fire({
                    title: "Error!",
                    text: body.message,
                    icon: "error",
                    timer: 3000
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getWinners();
    }, []);

    return (
        <>
            <section className="transition-all delay-75 min-h-screen px-[15px] py-[100px] bg-zinc-100 dark:bg-zinc-900 bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url('/images/celebration.png')` }}>
                <div className="site-container text-center">
                    <div className="flex items-center justify-center flex-col min-h-[calc(100vh-200px)]">
                        <div className="text-center w-full">
                            <h1 className="transition-all delay-75 font-ubuntu font-bold text-[30px] md:text-[50px] text-zinc-900 dark:text-zinc-100">
                                Winners Of The Month
                            </h1>
                            {
                                haveWinners ?
                                    (
                                        <div className="pt-[20px] md:pt-[30px]">

                                            {
                                                winData2 ?
                                                    (
                                                        <div className="flex flex-row lg:flex-row items-end justify-center gap-[25px] flex-wrap lg:flex-nowrap pb-[0px] md:pb-[25px] lg:pb-[0px]">
                                                            <div className="transition-all delay-75 hidden md:block lg:hidden w-full md:w-[calc(50%-13px)] lg:w-[calc(33.3333%-15px)] relative px-[15px] pt-[50px] pb-[20px] md:pt-[110px] md:pb-[40px] bg-white border-[2px] text-center border-solid border-zinc-900 dark:bg-zinc-800 dark:border-zinc-600">
                                                                <div className="inline-block relative p-[2px] rounded-full mx-auto ring-yellow-400 ring-2">
                                                                    <FaCrown size={20} className="absolute right-[10px] md:right-[15px] top-[-28px] md:top-[-42px] w-[25px] h-[25px] md:w-[40px] md:h-[40px] text-yellow-400" />
                                                                    <div className="transition-all delay-75 relative w-[40px] h-[40px] md:w-[70px] md:h-[70px] flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 rounded-full font-ubuntu font-bold text-[18px] md:text-[30px] text-zinc-800 dark:text-zinc-300">
                                                                        <span className="uppercase">{winData1?.user_full_name.charAt(0)}</span>
                                                                        {
                                                                            winData1?.user_profile_picture ? (<Image src={winData1?.user_profile_picture} width={60} height={60} className="absolute left-0 top-0 w-full h-full rounded-full z-[2]" alt="photo" priority={true} />) : ('')
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="text-center pt-[10px] md:pt-[15px]">
                                                                    <h2 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[20px] text-zinc-800 dark:text-zinc-200">
                                                                        {winData1?.user_full_name}
                                                                    </h2>
                                                                </div>
                                                                <div className="pt-[10px]">
                                                                    <h4 className="transition-all delay-75 font-noto_sans font-semibold text-[20px] md:text-[25px] text-zinc-900 dark:text-zinc-100">
                                                                        {winData1?.winner_type}<sup>{winData1?.winning_position_text}</sup> Winner
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                    :
                                                    ('')
                                            }

                                            <div className="flex flex-row lg:flex-row items-end justify-center gap-[25px] flex-wrap lg:flex-nowrap">
                                                {
                                                    winData2 ?
                                                        (
                                                            <div className="transition-all delay-75 w-full md:w-[calc(50%-13px)] lg:w-[calc(33.3333%-15px)] order-2 md:order-1 lg:order-1 relative px-[15px] pt-[50px] pb-[20px] md:pt-[70px] md:pb-[40px] bg-white border-[2px] text-center border-solid border-zinc-900 dark:bg-zinc-800 dark:border-zinc-600">
                                                                <div className="inline-block relative p-[2px] rounded-full mx-auto ring-theme-color-2 ring-2">
                                                                    <FaCrown size={20} className="absolute right-[10px] top-[-28px] md:top-[-42px] w-[25px] h-[25px] md:w-[40px] md:h-[40px] text-gray-400" />
                                                                    <div className="transition-all delay-75 relative w-[40px] h-[40px] md:w-[60px] md:h-[60px] flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 rounded-full font-ubuntu font-bold text-[18px] md:text-[25px] text-zinc-800 dark:text-zinc-300">
                                                                        <span className="uppercase">{winData2?.user_full_name.charAt(0)}</span>
                                                                        {
                                                                            winData2?.user_profile_picture ? (<Image src={winData2?.user_profile_picture} width={60} height={60} className="absolute left-0 top-0 w-full h-full rounded-full z-[2]" alt="photo" priority={true} />) : ('')
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="text-center pt-[10px] md:pt-[15px]">
                                                                    <h2 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[20px] text-zinc-800 dark:text-zinc-200">
                                                                        {winData2?.user_full_name}
                                                                    </h2>
                                                                </div>
                                                                <div className="pt-[10px]">
                                                                    <h4 className="transition-all delay-75 font-noto_sans font-semibold text-[20px] md:text-[25px] text-zinc-900 dark:text-zinc-100">
                                                                        {winData2?.winner_type}<sup>{winData2?.winning_position_text}</sup> Winner
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        )
                                                        :
                                                        ('')
                                                }

                                                {
                                                    winData1 ?
                                                        (
                                                            <div className="transition-all delay-75 block md:hidden lg:block w-full md:w-[calc(50%-13px)] lg:w-[calc(33.3333%-15px)] order-1 md:order-3 lg:order-2 relative px-[15px] pt-[50px] pb-[20px] md:pt-[110px] md:pb-[40px] bg-white border-[2px] text-center border-solid border-zinc-900 dark:bg-zinc-800 dark:border-zinc-600">
                                                                <div className="inline-block relative p-[2px] rounded-full mx-auto ring-yellow-400 ring-2">
                                                                    <FaCrown size={20} className="absolute right-[10px] md:right-[15px] top-[-28px] md:top-[-42px] w-[25px] h-[25px] md:w-[40px] md:h-[40px] text-yellow-400" />
                                                                    <div className="transition-all delay-75 relative w-[40px] h-[40px] md:w-[70px] md:h-[70px] flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 rounded-full font-ubuntu font-bold text-[18px] md:text-[30px] text-zinc-800 dark:text-zinc-300">
                                                                        <span className="uppercase">{winData1?.user_full_name.charAt(0)}</span>
                                                                        {
                                                                            winData1?.user_profile_picture ? (<Image src={winData1?.user_profile_picture} width={60} height={60} className="absolute left-0 top-0 w-full h-full rounded-full z-[2]" alt="photo" priority={true} />) : ('')
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="text-center pt-[10px] md:pt-[15px]">
                                                                    <h2 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[20px] text-zinc-800 dark:text-zinc-200">
                                                                        {winData1?.user_full_name}
                                                                    </h2>
                                                                </div>
                                                                <div className="pt-[10px]">
                                                                    <h4 className="transition-all delay-75 font-noto_sans font-semibold text-[20px] md:text-[25px] text-zinc-900 dark:text-zinc-100">
                                                                        {winData1?.winner_type}<sup>{winData1?.winning_position_text}</sup> Winner
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        )
                                                        :
                                                        ('')
                                                }

                                                {
                                                    winData3 ?
                                                        (
                                                            <div className="transition-all delay-75 w-full md:w-[calc(50%-13px)] lg:w-[calc(33.3333%-15px)] order-3 md:order-2 lg:order-3 relative px-[15px] pt-[50px] pb-[20px] md:pt-[70px] md:pb-[40px] bg-white border-[2px] text-center border-solid border-zinc-900 dark:bg-zinc-800 dark:border-zinc-600">
                                                                <div className="inline-block relative p-[2px] rounded-full mx-auto ring-theme-color-2 ring-2">
                                                                    <FaCrown size={20} className="absolute right-[10px] top-[-28px] md:top-[-42px] w-[25px] h-[25px] md:w-[40px] md:h-[40px] text-orange-700" />
                                                                    <div className="transition-all delay-75 relative w-[40px] h-[40px] md:w-[60px] md:h-[60px] flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 rounded-full font-ubuntu font-bold text-[18px] md:text-[25px] text-zinc-800 dark:text-zinc-300">
                                                                        <span className="uppercase">{winData3?.user_full_name.charAt(0)}</span>
                                                                        {
                                                                            winData3?.user_profile_picture ? (<Image src={winData3?.user_profile_picture} width={60} height={60} className="absolute left-0 top-0 w-full h-full rounded-full z-[2]" alt="photo" priority={true} />) : ('')
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="text-center pt-[10px] md:pt-[15px]">
                                                                    <h2 className="transition-all delay-75 font-ubuntu text-[16px] md:text-[20px] text-zinc-800 dark:text-zinc-200">
                                                                        {winData3?.user_full_name}
                                                                    </h2>
                                                                </div>
                                                                <div className="pt-[10px]">
                                                                    <h4 className="transition-all delay-75 font-noto_sans font-semibold text-[20px] md:text-[25px] text-zinc-900 dark:text-zinc-100">
                                                                        {winData3?.winner_type}<sup>{winData3?.winning_position_text}</sup> Winner
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        )
                                                        :
                                                        ('')
                                                }
                                            </div>
                                        </div>
                                    )
                                    :
                                    (
                                        <>
                                            {
                                                isLoading ?
                                                    (<div className="spinner size-1"></div>)
                                                    :
                                                    (
                                                        <div className="transition-all delay-75 px-[15px] py-[15px] md:py-[20px] mt-[20px] border-[2px] text-center border-solid border-zinc-900 bg-white max-w-[600px] mx-auto dark:bg-zinc-800 dark:border-zinc-600">
                                                            <h6 className="transition-all delay-75 inline-block font-ubuntu text-[18px] md:text-[20px] text-zinc-900 dark:text-zinc-300">
                                                                There is no winner in this month.
                                                            </h6>
                                                        </div>
                                                    )
                                            }
                                        </>
                                    )
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}