'use client';

import React from "react";
import { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { CommonModalPropsType } from "@/app/types/components/website/componentsTypes";

function CommonModal(props: CommonModalPropsType) {

    const { open_modal_on_page_load = false, openState, setOpenState, modal_heading, backdrop = true, hide_modal_on_backdrop_click, modal_max_width = 600, children, callBackAfterModalClose } = props;

    const handleBackDropClick = () => {
        if (hide_modal_on_backdrop_click) {
            setOpenState(false);
            if (callBackAfterModalClose) {
                callBackAfterModalClose();
            }
        }
    }
    const calcmaxw = `calc(100% - 30px)`;

    useEffect(() => {
        if (open_modal_on_page_load) {
            setOpenState(true);
        }
    }, [open_modal_on_page_load, setOpenState]);

    return (
        <>
            {
                openState ? (
                    <>
                        {
                            backdrop ? (
                                <>
                                    <div className="transition-all fixed top-0 left-0 w-full h-full z-[30] bg-black/50 backdrop-blur-[3px]" onClick={handleBackDropClick}></div>
                                </>
                            )
                                :
                                ('')
                        }
                        <div className="transition-all fixed top-1/2 left-1/2 translate-x-[calc(-50%-20px)] translate-y-[calc(-50%-20px)] w-full my-[20px] mx-[20px] z-[32] max-h-[calc(100%-40px)] overflow-y-auto" style={{ width: calcmaxw, maxWidth: modal_max_width + 'px' }}>
                            <div className="transition-all bg-white w-full mx-auto dark:bg-zinc-900 border border-zinc-300 border-solid dark:border-zinc-700" style={{ maxWidth: modal_max_width + 'px' }}>
                                {modal_heading && (
                                    <header className="flex items-center gap-x-4 justify-between py-[10px] md:py-[15px] px-[15px] border-b border-zinc-300 border-solid dark:border-zinc-700">
                                        <h1 className="transition-all font-ubuntu text-[18px] md:text-[22px] font-medium text-zinc-800 dark:text-zinc-200">
                                            {modal_heading}
                                        </h1>
                                        <div>
                                            <IoCloseSharp size={20} className="transition-all cursor-pointer w-[25px] h-[25px] md:w-[30px] md:h-[30px] text-zinc-700 dark:text-zinc-200" onClick={handleBackDropClick} />
                                        </div>
                                    </header>
                                )}
                                <div>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </>
                ) : ('')
            }
        </>
    )
}

export default React.memo(CommonModal);