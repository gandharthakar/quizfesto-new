'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { CategoriesType } from "@/app/types/components/website/componentsTypes";
import { useGetHomeFeCats } from "@/app/libs/tanstack-query/website/queries/websiteQueries";
import { QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";

function HomeTopCategories() {

    const [cats, setCats] = useState<CategoriesType[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(true);

    const { data, isError, error, isSuccess, isLoading } = useGetHomeFeCats();

    useEffect(() => {
        if (isSuccess) {
            if (data.home_cats) {
                setCats(data.home_cats);
            } else {
                setCats([]);
            }
        }

        QF_TQ_UEF_CatchErrorCB(isError, error);
    }, [data, isSuccess, isError, error, setCats]);

    return (
        <>
            <ul className="flex flex-wrap gap-x-[10px] gap-y-[10px] md:gap-x-[20px] md:gap-y-[15px]">
                {
                    cats.length ?
                        (
                            <>
                                {
                                    cats.map((item) => (
                                        <li key={item.category_id}>
                                            <Link
                                                href={`/view-category/${item.category_slug}`}
                                                title={item.category_title}
                                                className="inline-block transition-all delay-75 font-ubuntu text-[16px] md:text-[20px] bg-zinc-100 border-[2px] border-solid border-zinc-600 px-[25px] py-[10px] md:py-[10px] rounded-full hover:bg-white hover:border-theme-color-2 hover:text-theme-color-2 dark:hover:text-theme-color-2 dark:bg-zinc-800 hover:dark:bg-zinc-950 dark:text-zinc-300"
                                            >
                                                {item.category_title}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </>
                        )
                        :
                        (
                            <>
                                {
                                    isLoading ?
                                        (<div className="spinner size-1"></div>)
                                        :
                                        (
                                            <h1 className="transition-all delay-75 text-[16px] md:text-[18px] font-semibold text-zinc-800 dark:text-zinc-300">
                                                No Categories Found.
                                            </h1>
                                        )
                                }
                            </>
                        )
                }
            </ul>
        </>
    )
}

export default HomeTopCategories;