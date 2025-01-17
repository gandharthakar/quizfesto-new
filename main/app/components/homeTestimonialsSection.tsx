'use client';

import { TfiAngleLeft } from "react-icons/tfi";
import { TfiAngleRight } from "react-icons/tfi";
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { dump_testimonials_homepage } from "@/app/constant/datafaker";
import { IoStar } from "react-icons/io5";
import Image from "next/image";

export default function HomeTestimonialsSection() {
    const pgn = {
        clickable: true,
        renderBullet: function (index: any, className: any) {
            return '<div class="' + className + '"></div>';
        },
    };

    return (

        <>
            <div className="relative home-sw">
                <Swiper
                    pagination={pgn}
                    modules={[Pagination]}
                    className="mySwiper"
                >
                    {
                        dump_testimonials_homepage.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="md:px-[80px] pb-[25px] md:pb-[80px]">
                                    <div className="transition-all delay-75 pb-[25px] md:pb-[40px] flex justify-center items-center gap-x-[1px] text-zinc-800 dark:text-zinc-100">
                                        {
                                            [...Array(item.stars)].map((e, i) => <div className="" key={i}>
                                                <IoStar size={20} className="w-[20px] h-[20px] md:w-[25px] md:h-[25px]" />
                                            </div>)
                                        }
                                    </div>

                                    <div className="pb-[25px] md:pb-[40px]">
                                        <div className="max-w-[900px] mx-auto text-center">
                                            <h1 className="transition-all delay-75 font-noto_sans font-semibold text-[22px] md:text-[30px] text-zinc-900 dark:text-zinc-200">
                                                {item.testimonial_content}
                                            </h1>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="pb-[10px] md:pb-[5px] text-center">
                                            <Image
                                                src={item.testimonial_person_photo}
                                                width={50}
                                                height={50}
                                                className="inline-block w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full"
                                                alt="photo"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h2 className="transition-all delay-75 inline-block font-ubuntu font-semibold text-[20px] md:text-[22px] text-zinc-900 dark:text-zinc-200">
                                                {item.testimonial_name}
                                            </h2>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="transition-all delay-75 inline-block font-ubuntu font-semibold text-[16px] md:text-[18px] text-zinc-400 dark:text-zinc-400">
                                                {item.testimonial_designation}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                    <Swc />
                </Swiper>
            </div>
        </>
    )
}

const Swc = () => {
    const mySwipe = useSwiper();
    return (
        <>
            <div className="hidden md:block">
                <div className="absolute left-0 top-[50%] translate-y-[-50%] z-[10]">
                    <button
                        title="Previous Slide"
                        className="transition-all delay-75 w-[40px] h-[40px] flex items-center justify-center border-[1px] border-solid border-zinc-800 text-zinc-800 dark:border-zinc-300 dark:text-zinc-300 hover:bg-theme-color-1 hover:border-theme-color-1 hover:text-white dark:hover:bg-theme-color-1 dark:hover:border-theme-color-1"
                        onClick={() => mySwipe.slidePrev()}
                    >
                        <TfiAngleLeft size={18} />
                    </button>
                </div>
                <div className="absolute right-0 top-[50%] translate-y-[-50%] z-[10]">
                    <button
                        title="Next Slide"
                        className="transition-all delay-75 w-[40px] h-[40px] flex items-center justify-center border-[1px] border-solid border-zinc-800 text-zinc-800 dark:border-zinc-300 dark:text-zinc-300 hover:bg-theme-color-1 hover:border-theme-color-1 hover:text-white dark:hover:bg-theme-color-1 dark:hover:border-theme-color-1"
                        onClick={() => mySwipe.slideNext()}
                    >
                        <TfiAngleRight size={18} />
                    </button>
                </div>
            </div>
        </>
    )
}