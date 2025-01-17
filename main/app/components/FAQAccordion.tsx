'use client';

import { useRef } from "react";
import { GoPlusCircle } from "react-icons/go";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { FAQComponentType } from "@/app/types/components/website/componentsTypes";

function FAQAccordion(props: FAQComponentType) {

    const { ques_text, children, show_icon = true, is_open, onClick } = props;
    const accRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="site-acc-item transition-all overflow-hidden delay-75 border-b border-solid border-zinc-300 dark:border-zinc-700">
                <button
                    type="button"
                    title={ques_text}
                    className={`transition-all delay-75 w-full block py-[20px] text-zinc-900 dark:text-zinc-200 ${is_open ? 'active' : ''}`}
                    onClick={onClick}
                >
                    <div className="flex items-start gap-x-[20px] justify-between">
                        <h4 className="font-noto_sans text-[18px] md:text-[22px] font-bold text-left">
                            {ques_text}
                        </h4>
                        {
                            show_icon ?
                                (
                                    <div className="translate-y-[5px]">
                                        {
                                            is_open ?
                                                (
                                                    <AiOutlineMinusCircle size={20} className="w-[20px] h-[20px] md:w-[25px] md:h-[25px]" />
                                                )
                                                :
                                                (
                                                    <GoPlusCircle size={20} className="w-[20px] h-[20px] md:w-[25px] md:h-[25px]" />
                                                )
                                        }
                                    </div>
                                )
                                :
                                ('')
                        }
                    </div>
                </button>
                <div className="transition-all delay-75" ref={accRef} style={is_open ? { height: accRef.current !== null ? accRef.current.scrollHeight : '' } : { height: "0px" }}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default FAQAccordion;