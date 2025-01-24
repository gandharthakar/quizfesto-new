'use client';

import AdminListQuestionOption from "@/app/components/admin/adminListQuestionOption";
import AdminSearchPanel from "@/app/components/admin/adminSearchPanel";
import SitePagination from "@/app/components/sitePagination";
// import { dump_list_of_options } from "@/app/constant/datafaker";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { GrAdd } from "react-icons/gr";
import { IoMdCheckmark } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { GFG } from "@/app/libs/helpers/helperFunctions";
import { AdminOptionsDataType } from "@/app/types/components/admin/componentsTypes";
import TokenChecker from "@/app/libs/tokenChecker";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";

function Page() {

    const dataPerPage = 5;
    const [srchInp, setSrchInp] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [optionData, setOptionData] = useState<AdminOptionsDataType[]>([]);
    const [totalPages, setTotalPages] = useState<number>(Math.ceil(optionData.length / dataPerPage));
    const [optionsListData, setOptionsListData] = useState<AdminOptionsDataType[]>([]);

    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSrchInp(e.target.value);
        if (srchInp.length === 1) {
            setCurrentPage(1);
            setOptionsListData(GFG(optionData, currentPage, dataPerPage));
            setTotalPages(Math.ceil(optionData.length / dataPerPage));
        }
    }

    const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const value = (e.target as HTMLInputElement).value;
        setSrchInp(value);
        // setSrchInp('');
        if (e.key === "Backspace") {
            setCurrentPage(1);
            setOptionsListData(GFG(optionData, currentPage, dataPerPage));
            setTotalPages(Math.ceil(optionData.length / dataPerPage));
        }
    }

    const handleSearchLogic = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (srchInp == '') {
            Swal.fire({
                title: "Error!",
                text: "Please enter search term first.",
                icon: "error",
                timer: 4000
            });
        } else {

            if (optionsListData.length > 0) {

                const res = optionData.filter((item) => {
                    const srch_res = item.question_text.toLowerCase().includes(srchInp.toLowerCase()) || item.search_tems?.includes(srchInp.toLowerCase());
                    return srch_res;
                });

                if (res.length > 0) {
                    setCurrentPage(1);
                    setTotalPages(Math.ceil(res.length / dataPerPage));
                    setOptionsListData(GFG(res, currentPage, dataPerPage));
                    if (srchInp == "") {
                        setCurrentPage(1);
                        setTotalPages(Math.ceil(optionData.length / dataPerPage));
                        setOptionsListData([]);
                    }
                } else {
                    if (srchInp == "") {
                        setCurrentPage(1);
                        setTotalPages(Math.ceil(optionData.length / dataPerPage));
                        setOptionsListData([]);
                    }
                    setCurrentPage(1);
                    setOptionsListData(GFG(res, currentPage, dataPerPage));
                    setTotalPages(Math.ceil(res.length / dataPerPage));
                }
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "No Options Found.",
                    icon: "error",
                    timer: 4000
                });
            }
        }
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        setOptionsListData(GFG(optionData, newPage, dataPerPage));
        setSelectAll(false);
        setSelectedItems([]);
    };

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        const allIds = optionsListData.map(item => item['option_id']);
        setSelectedItems(selectAll ? [] : allIds);
    };

    const toggleItem = (itemId: string) => {
        const index = selectedItems.indexOf(itemId);
        if (index === -1) {
            setSelectedItems([...selectedItems, itemId]);
        } else {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        }
    };

    const handleCheckboxChange = (itemId: string) => {
        toggleItem(itemId);
    };

    const handleDeleteAllBulkLogic = async () => {
        const conf = confirm("Are you sure want to delete all options ?");
        if (conf) {
            setIsLoading(true);
            setIsMenuOpen(false);
            const baseURI = window.location.origin;
            const token = getCookie(adminAuthUserCookieName);
            try {
                const resp = await fetch(`${baseURI}/api/admin/options/bulk-actions/delete-all?token=${token}`, {
                    method: "DELETE",
                });
                if (!resp.ok) {
                    setIsLoading(false);
                }
                const body = await resp.json();
                if (body.success) {
                    Swal.fire({
                        title: "Success!",
                        text: body.message,
                        icon: "success",
                        timer: 2000
                    });
                    const set = setTimeout(() => {
                        window.location.reload();
                        setIsLoading(false);
                        clearTimeout(set);
                    }, 2000);
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: body.message,
                        icon: "error",
                        timer: 2000
                    });
                    setIsLoading(false);
                }
                //eslint-disable-next-line
            } catch (error: any) {
                Swal.fire({
                    title: "Error!",
                    text: error.message,
                    icon: "error",
                    timer: 4000
                });
            }
        }
    }

    const handleDeleteSelectedBulkLogic = async () => {
        if (selectedItems.length > 0) {
            const conf = confirm("Are you sure want to delete selected options ?");
            if (conf) {
                setIsLoading(true);
                setIsMenuOpen(false);
                const baseURI = window.location.origin;
                const token = getCookie(adminAuthUserCookieName);
                try {
                    const resp = await fetch(`${baseURI}/api/admin/options/bulk-actions/delete-selected`, {
                        method: "DELETE",
                        body: JSON.stringify({ token, options_id_list: selectedItems })
                    });
                    if (!resp.ok) {
                        setIsLoading(false);
                    }
                    const body = await resp.json();
                    if (body.success) {
                        Swal.fire({
                            title: "Success!",
                            text: body.message,
                            icon: "success",
                            timer: 2000
                        });
                        const set = setTimeout(() => {
                            window.location.reload();
                            clearTimeout(set);
                        }, 2000);
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: body.message,
                            icon: "error",
                            timer: 2000
                        });
                        setIsLoading(false);
                    }
                    //eslint-disable-next-line
                } catch (error: any) {
                    Swal.fire({
                        title: "Error!",
                        text: error.message,
                        icon: "error",
                        timer: 4000
                    });
                }
            }
        } else {
            Swal.fire({
                title: "Error!",
                text: "Please Select Options First!",
                icon: "error",
                timer: 3000
            });
        }
    }

    const getOptions = async () => {
        const baseURI = window.location.origin;
        const token = getCookie(adminAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/admin/options/bulk-actions/read-all?token=${token}`, {
                method: "GET",
            });
            if (!resp.ok) {
                setIsLoading(false);
            }
            const body = await resp.json();
            if (body.success) {
                setIsLoading(false);
                setOptionsListData(GFG(body.options_list, currentPage, dataPerPage));
                setOptionData(body.options_list);
                setTotalPages(Math.ceil(body.options_list.length / dataPerPage));
            } else {
                setIsLoading(false);
            }
            //eslint-disable-next-line
        } catch (error: any) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
                timer: 4000
            });
        }
    }

    useEffect(() => {
        getOptions();
        // setOptionsListData(GFG(dump_list_of_options, currentPage, dataPerPage));
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (selectedItems.length === optionsListData.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedItems, optionsListData]);

    useEffect(() => {

        const menuHandler = (e: MouseEvent) => {
            if (menuRef.current !== null) {
                if (!menuRef.current.contains(e.target as Node)) {
                    setIsMenuOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', menuHandler);

    }, []);

    return (
        <>
            <TokenChecker is_admin={true} />
            <div className="py-[25px]">
                <div className="pb-[25px]">
                    <div className="flex gap-x-[15px] gap-y-[10px] flex-wrap items-center">
                        <div className="mr-auto">
                            <Link
                                href="/admin/options/create-new-options"
                                title="Add New"
                                className="transition-all delay-75 inline-block font-noto_sans font-semibold text-[14px] md:text-[16px] py-[8px] md:py-[10px] px-[10px] md:px-[15px] bg-theme-color-2 text-zinc-100 hover:bg-theme-color-2-hover-dark"
                            >
                                <div className="flex gap-x-[5px] items-center">
                                    <GrAdd size={20} className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
                                    <div className="hidden md:block">Add New</div>
                                </div>
                            </Link>
                        </div>
                        <div className="pr-[5px]">
                            <form onSubmit={handleSearchLogic}>
                                <AdminSearchPanel
                                    sarchInputVal={srchInp}
                                    searchInputChange={handleSearchInputChange}
                                    searchInputKeyDown={handleSearchInputKeyDown}
                                />
                            </form>
                        </div>
                        <div className="alqc-chrb">
                            <input
                                type="checkbox"
                                id="selall"
                                // name="all_quiz" 
                                className="input-chrb"
                                checked={selectAll} onChange={toggleSelectAll}
                            />
                            <label htmlFor="selall" className="label">
                                <div>
                                    <div className="squere-box">
                                        <IoMdCheckmark size={18} className="svg-icon" />
                                    </div>
                                </div>
                                <div className="label-text">
                                    Select All
                                </div>
                            </label>
                        </div>
                        {/* <button 
                            type="button" 
                            title="Delete All" 
                            className="transition-all delay-75 inline-block font-noto_sans font-semibold text-[14px] md:text-[16px] py-[8px] md:py-[10px] px-[10px] md:px-[15px] bg-red-600 text-zinc-100 hover:bg-red-700" 
                            onClick={handleDeleteBulkLogic} 
                        >
                            <div className="flex gap-x-[5px] items-center">
                                <RiDeleteBin6Line size={20} className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
                                <div className="hidden md:block">Delete All</div>
                            </div>
                        </button> */}
                        <div ref={menuRef} className="relative h-[18px]">
                            <button
                                type="button"
                                title="Actions"
                                className="transition-all delay-75 text-zinc-800 dark:text-zinc-200"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <FaEllipsisVertical size={18} />
                            </button>
                            <ul className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-950 dark:ring-zinc-800 ${isMenuOpen ? 'block' : 'hidden'}`}>
                                <li className="w-full">
                                    <button
                                        type="button"
                                        title="Delete Selected"
                                        className="transition-all delay-75 block w-full py-[10px] px-[15px] font-ubuntu text-[16px] text-red-500 hover:bg-zinc-100 dark:text-red-500 dark:hover:bg-zinc-800"
                                        onClick={handleDeleteSelectedBulkLogic}
                                    >
                                        <div className="flex gap-x-[5px] items-center">
                                            <RiDeleteBin6Line size={20} />
                                            <div>
                                                Delete Selected
                                            </div>
                                        </div>
                                    </button>
                                </li>
                                <li className="w-full">
                                    <button
                                        type="button"
                                        title="Delete All"
                                        className="transition-all delay-75 block w-full py-[10px] px-[15px] font-ubuntu text-[16px] text-red-500 hover:bg-zinc-100 dark:text-red-500 dark:hover:bg-zinc-800"
                                        onClick={handleDeleteAllBulkLogic}
                                    >
                                        <div className="flex gap-x-[5px] items-center">
                                            <RiDeleteBin6Line size={20} />
                                            <div>
                                                Delete All
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    {
                        optionsListData.length ?
                            (
                                <>
                                    {
                                        optionsListData.map((itm: AdminOptionsDataType) => (
                                            <div key={itm.option_id} className="pb-[20px] last:pb-0">
                                                <AdminListQuestionOption
                                                    option_id={itm.option_id}
                                                    options={itm.options}
                                                    question_text={itm.question_text}
                                                    checkboxName={"options_list"}
                                                    checkboxValue={itm.option_id}
                                                    checkboxChecked={selectedItems.includes(itm.option_id)}
                                                    onCheckboxChange={handleCheckboxChange}
                                                />
                                            </div>
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
                                                    No Options Found.
                                                </h1>
                                            )
                                    }
                                </>
                            )
                    }

                </div>
                <SitePagination
                    totalPages={totalPages}
                    dataPerPage={dataPerPage}
                    currentPage={currentPage}
                    parentClassList="pt-[50px]"
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    )
}

export default Page;