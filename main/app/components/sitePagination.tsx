'use client';

import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { PaginationType } from "@/app/types/components/website/componentsTypes";

function SitePagination(props: PaginationType) {

    const {
        totalPages = 5,
        dataPerPage = 5,
        parentClassList,
        currentPage = 1,
        onPageChange,
    } = props;

    const [pageNumber, setPageNumber] = useState<number>(currentPage || 1);

    const handlePrevious = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
            onPageChange(pageNumber - 1);
        }
    };

    const handleNext = () => {
        if (pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
            onPageChange(pageNumber + 1);
        }
    };

    return (
        <div className={`max-w-[280px] mx-auto ${parentClassList}`}>
            <div className="flex justify-between gap-x-[15px] items-center">
                <div>
                    <button
                        type="button"
                        title="Previous Page"
                        className="transition-all delay-75 text-zinc-700 dark:text-zinc-200 disabled:text-zinc-400 dark:disabled:text-zinc-600"
                        disabled={pageNumber === 1}
                        onClick={handlePrevious}
                    >
                        <FaAngleLeft size={35} className="w-[25px] h-[25px] md:w-[35px] md:h-[35px]" />
                    </button>
                </div>
                <div>
                    <div className="transition-all delay-75 font-ubuntu text-[20px] md:text-[22px] text-zinc-800 dark:text-zinc-200">
                        {currentPage} / {totalPages}
                    </div>
                </div>
                <div>
                    <button
                        type="button"
                        title="Next Page"
                        className="transition-all delay-75 text-zinc-700 dark:text-zinc-200 disabled:text-zinc-400 dark:disabled:text-zinc-600"
                        disabled={pageNumber === totalPages}
                        onClick={handleNext}
                    >
                        <FaAngleRight size={35} className="w-[25px] h-[25px] md:w-[35px] md:h-[35px]" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SitePagination;