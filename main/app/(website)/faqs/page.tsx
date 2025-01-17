'use client';

import { useState } from "react";
import FAQAccordion from "@/app/components/FAQAccordion";
import Link from "next/link";
import parse from 'html-react-parser';
import { dump_faqs_content } from "@/app/constant/datafaker";

export default function Page() {

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleItemClick = (index: any) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <>
            <section className="transition-all delay-75 relative px-[15px] py-[100px] md:py-[150px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <div className="site-container">

                    <div className="pb-[25px] md:pb-[50px]">
                        <div className="pb-[10px] text-center">
                            <h1 className="transition-all delay-75 font-noto_sans text-[25px] md:text-[30px] text-zinc-800 font-semibold dark:text-zinc-200">
                                Frequently Asked Questions
                            </h1>
                        </div>
                        <div className="max-w-[500px] mx-auto text-center">
                            <p className="transition-all delay-75 font-noto_sans text-[16px] md:text-[18px] text-zinc-800 font-normal dark:text-zinc-300">
                                Everything you need to know about QuizFesto.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-[1000px] mx-auto">
                        {
                            dump_faqs_content.map((item) => (
                                <FAQAccordion
                                    key={item.id}
                                    ques_text={item.question}
                                    show_icon={true}
                                    is_open={activeIndex === item.id}
                                    onClick={() => handleItemClick(item.id)}
                                >
                                    <div className="faq-content pb-4">
                                        {parse(item.answer)}
                                    </div>
                                </FAQAccordion>
                            ))
                        }
                    </div>
                </div>
            </section>

            <section className="transition-all delay-75 relative px-[15px] py-[100px] overflow-hidden bg-theme-color-2">
                <div className="site-container">
                    <div className="pb-[10px] md:pb-[20px] text-center">
                        <h2 className="transition-all delay-75 inline-block font-ubuntu font-bold text-[25px] md:text-[30px] text-zinc-100">
                            {`Can't find what you're looking for ?`}
                        </h2>
                    </div>
                    <div className="text-center">
                        <p className="transition-all delay-75 font-ubuntu text-[18px] text-zinc-200">
                            For more information you can <Link href="/contact" title="contact us." className="underline font-semibold text-zinc-100">contact us.</Link>
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}