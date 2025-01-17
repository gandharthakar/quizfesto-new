'use client';

import { AdminSearchPanelType } from "@/app/types/components/admin/componentsTypes";
import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

function AdminSearchPanel(props: AdminSearchPanelType) {

    const {
        sarchInputVal,
        searchInputChange,
        searchInputKeyDown,
    } = props;

    const [isSearchPanelOpen, setSearchPanelOpen] = useState<boolean>(false);
    const spRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const menuHandler = (e: any) => {
            if (spRef.current !== null) {
                if (!spRef.current.contains(e.target)) {
                    setSearchPanelOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', menuHandler);

    }, []);

    return (
        <>
            <div ref={spRef} className="relative h-[24px]">
                <button
                    type="button"
                    title="Search"
                    className="transition-all delay-75 text-zinc-900 dark:text-zinc-200"
                    onClick={() => setSearchPanelOpen(!isSearchPanelOpen)}
                >
                    <IoSearchOutline size={24} />
                </button>
                <div className={`transition-all delay-75 absolute right-[-132px] md:right-0 bottom-[-58px] z-[8] min-w-[250px] max-w-[300px] py-[10px] px-[15px] w-full bg-white border border-solid border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 ${isSearchPanelOpen ? 'block' : 'hidden'}`}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="transition-all delay-75 pr-[30px] font-noto_sans text-[16px] block w-full border-0 bg-white placeholder:text-zinc-400 text-zinc-900 focus:outline-0 dark:placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-zinc-200"
                            value={sarchInputVal}
                            onChange={searchInputChange}
                            onKeyDown={searchInputKeyDown}
                        />
                        <button
                            type="submit"
                            title="search"
                            className="transition-all delay-75 absolute top-1/2 translate-y-[-50%] z-[2] right-0 text-zinc-900 dark:text-zinc-200"
                        >
                            <IoSearchOutline size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminSearchPanel;