'use client';

import Image from "next/image";
import parse from 'html-react-parser';
import { useEffect, useState } from "react";

export default function QuizPrizes() {

    const defaultImage: string = "https://placehold.co/700x500/png";
    const defaultDescr: string = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates quos assumenda obcaecati voluptate nisi magni quae fuga distinctio laborum facere.";

    const [prize1Photo, setPrize1Photo] = useState<string>(defaultImage);
    const [prize1Dscr, setPrize1Dscr] = useState<string>(defaultDescr);
    const [loading1, setLoading1] = useState<boolean>(true);
    const [prize2Photo, setPrize2Photo] = useState<string>(defaultImage);
    const [prize2Dscr, setPrize2Dscr] = useState<string>(defaultDescr);
    const [loading2, setLoading2] = useState<boolean>(true);
    const [prize3Photo, setPrize3Photo] = useState<string>(defaultImage);
    const [prize3Dscr, setPrize3Dscr] = useState<string>(defaultDescr);
    const [loading3, setLoading3] = useState<boolean>(true);

    const getPrizes = async () => {
        const baseURI = window.location.origin;
        try {
            const resp = await fetch(`${baseURI}/api/site/get-prizes`, {
                method: "GET",
            });
            if (!resp.ok) {
                setLoading1(false);
                setLoading2(false);
                setLoading3(false);
            }
            const body = await resp.json();
            if (body.message == "No Prizes Found!") {
                setLoading1(false);
                setLoading2(false);
                setLoading3(false);
            } else {
                /* eslint-disable no-unused-vars */
                for (let i = 0; i < body.prizes.length; i++) {
                    if (body.prizes[i].prize_type === 1) {
                        setPrize1Photo(body.prizes[i].prize_cover_photo);
                        setPrize1Dscr(body.prizes[i].prize_description);
                        setLoading1(false);
                    } else {
                        setLoading1(false);
                    }

                    if (body.prizes[i].prize_type === 2) {
                        setPrize2Photo(body.prizes[i].prize_cover_photo);
                        setPrize2Dscr(body.prizes[i].prize_description);
                        setLoading2(false);
                    } else {
                        setLoading2(false);
                    }

                    if (body.prizes[i].prize_type === 3) {
                        setPrize3Photo(body.prizes[i].prize_cover_photo);
                        setPrize3Dscr(body.prizes[i].prize_description);
                        setLoading3(false);
                    } else {
                        setLoading3(false);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPrizes();
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <section className="transition-all delay-75 bg-white px-[15px] py-[50px] md:py-[100px] dark:bg-zinc-950">
                <div className="site-container">
                    <div className="pb-[25px] md:pb-[50px]">
                        <div className="pb-[10px] text-center">
                            <h3 className="transition-all delay-75 font-noto_sans text-[25px] md:text-[30px] text-zinc-800 font-semibold dark:text-zinc-200">
                                Win Exciting Prizes
                            </h3>
                        </div>
                        <div className="max-w-[500px] mx-auto text-center">
                            <p className="transition-all delay-75 font-noto_sans text-[16px] md:text-[18px] text-zinc-800 font-normal dark:text-zinc-300">
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut exercitationem, harum facere sapiente consequuntur dolores optio placeat quod nostrum ratione?
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-[20px]">
                        <div className="transition-all delay-75 relative w-full border-[2px] border-solid bg-zinc-100 flex flex-col items-start md:items-center md:flex-row gap-y-[15px] gap-x-[30px] dark:bg-zinc-900 hover:border-theme-color-2 dark:border-zinc-700 dark:hover:border-theme-color-2">
                            {
                                loading1 ?
                                    (
                                        <div className={`transition-all delay-75 absolute left-0 top-0 z-[10] bg-[rgba(255,255,255,0.90)] w-full h-full dark:bg-[rgba(9,9,11,0.95)] justify-center items-center flex`}>
                                            <div className="spinner"></div>
                                        </div>
                                    )
                                    :
                                    ("")
                            }
                            {/* Prize Logo */}
                            <Image src="/images/winner-prizes/logos/prize-logo-1.png" width={150} height={138} className="w-[150px] h-[138px] absolute right-0 top-[50%] translate-y-[-50%] z-[2] hidden md:block opacity-[0.8] md:opacity-[1]" alt="prize" />

                            {/* Price Image */}
                            <Image src={prize1Photo} width={250} height={179} className="w-full max-w-none md:max-w-[250px] h-auto relative z-[5]" alt="prize" />
                            <div className="pr-[15px] pl-[15px] md:pl-0 md:pr-[180px] pb-[15px] md:pb-[0px]">
                                <div className="pb-[0px]">
                                    <h6 className="transition-all delay-75 font-ubuntu text-[20px] md:text-[25px] text-zinc-800 dark:text-zinc-200">
                                        <b>1<sup>st</sup></b> : Winner Prize
                                    </h6>
                                </div>
                                <div>
                                    <p className="transition-all delay-75 font-noto_sans text-[16px] md:text-[18px] dark:text-zinc-400">
                                        {parse(prize1Dscr)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="transition-all delay-75 relative w-full border-[2px] border-solid bg-zinc-100 flex flex-col items-start md:items-center md:flex-row gap-y-[15px] gap-x-[30px] dark:bg-zinc-900 hover:border-theme-color-2 dark:border-zinc-700 dark:hover:border-theme-color-2">
                            {
                                loading2 ?
                                    (
                                        <div className={`transition-all delay-75 absolute left-0 top-0 z-[10] bg-[rgba(255,255,255,0.90)] w-full h-full dark:bg-[rgba(9,9,11,0.95)] justify-center items-center flex`}>
                                            <div className="spinner"></div>
                                        </div>
                                    )
                                    :
                                    ("")
                            }
                            {/* Prize Logo */}
                            <Image src="/images/winner-prizes/logos/prize-logo-2.png" width={150} height={138} className="w-[150px] h-[138px] absolute right-0 top-[50%] translate-y-[-50%] z-[2] hidden md:block opacity-[0.8] md:opacity-[1]" alt="prize" />

                            {/* Price Image */}
                            <Image src={prize2Photo} width={250} height={179} className="w-full max-w-none md:max-w-[250px] h-auto relative z-[5]" alt="prize" />
                            <div className="pr-[15px] pl-[15px] md:pl-0 md:pr-[180px] pb-[15px] md:pb-[0px]">
                                <div className="pb-[0px]">
                                    <h6 className="transition-all delay-75 font-ubuntu text-[20px] md:text-[25px] text-zinc-800 dark:text-zinc-200">
                                        <b>2<sup>nd</sup></b> : Winner Prize
                                    </h6>
                                </div>
                                <div>
                                    <p className="transition-all delay-75 font-noto_sans text-[16px] md:text-[18px] dark:text-zinc-400">
                                        {parse(prize2Dscr)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="transition-all delay-75 relative w-full border-[2px] border-solid bg-zinc-100 flex flex-col items-start md:items-center md:flex-row gap-y-[15px] gap-x-[30px] dark:bg-zinc-900 hover:border-theme-color-2 dark:border-zinc-700 dark:hover:border-theme-color-2">
                            {
                                loading3 ?
                                    (
                                        <div className={`transition-all delay-75 absolute left-0 top-0 z-[10] bg-[rgba(255,255,255,0.90)] w-full h-full dark:bg-[rgba(9,9,11,0.95)] justify-center items-center flex`}>
                                            <div className="spinner"></div>
                                        </div>
                                    )
                                    :
                                    ("")
                            }
                            {/* Prize Logo */}
                            <Image src="/images/winner-prizes/logos/prize-logo-3.png" width={150} height={138} className="w-[150px] h-[138px] absolute right-0 top-[50%] translate-y-[-50%] z-[2] hidden md:block opacity-[0.8] md:opacity-[1]" alt="prize" />

                            {/* Price Image */}
                            <Image src={prize3Photo} width={250} height={179} className="w-full max-w-none md:max-w-[250px] h-auto relative z-[5]" alt="prize" />
                            <div className="pr-[15px] pl-[15px] md:pl-0 md:pr-[180px] pb-[15px] md:pb-[0px]">
                                <div className="pb-[0px]">
                                    <h6 className="transition-all delay-75 font-ubuntu text-[20px] md:text-[25px] text-zinc-800 dark:text-zinc-200">
                                        <b>3<sup>rd</sup></b> : Winner Prize
                                    </h6>
                                </div>
                                <div>
                                    <p className="transition-all delay-75 font-noto_sans text-[16px] md:text-[18px] dark:text-zinc-400">
                                        {parse(prize3Dscr)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}