'use client';

import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrAdd } from "react-icons/gr";
import AdminListQuizCard from "@/app/components/admin/adminListQuizCard";
import { IoMdCheckmark } from "react-icons/io";
import AdminSearchPanel from "@/app/components/admin/adminSearchPanel";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import SitePagination from "@/app/components/sitePagination";
// import { dump_list_of_quizes } from "@/app/constant/datafaker";
import { FaEllipsisVertical } from "react-icons/fa6";
import { AdminQuizDataType, AdminQuizesListCardType } from "@/app/types/components/admin/componentsTypes";
import { GFG } from "@/app/libs/helpers/helperFunctions";
import TokenChecker from "@/app/libs/tokenChecker";

function Page() {

    const dataPerPage = 10;
    const [srchInp, setSrchInp] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [quizData, setQuizData] = useState<AdminQuizDataType[]>([]);
    const [totalPages, setTotalPages] = useState<number>(Math.ceil(quizData.length / dataPerPage));
    const [quizListData, setQuizListData] = useState<AdminQuizesListCardType[]>([]);
    // const totalPages = Math.ceil(totalItems / dataPerPage);

    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSrchInp(e.target.value);
        if (srchInp.length === 1) {
            setCurrentPage(1);
            setQuizListData(GFG(quizData, currentPage, dataPerPage));
            setTotalPages(Math.ceil(quizData.length / dataPerPage));
        }
    }

    const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setSrchInp("");
        // setSrchInp(e.target.value);
        if (e.key === "Backspace") {
            setCurrentPage(1);
            setQuizListData(GFG(quizData, currentPage, dataPerPage));
            setTotalPages(Math.ceil(quizData.length / dataPerPage));
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

            if (quizListData.length > 0) {

                const res = quizData.filter((item) => {
                    const srch_res = item.quiz_title.toLowerCase().includes(srchInp.toLowerCase()) || item.quiz_status.toLowerCase().includes(srchInp.toLowerCase());
                    return srch_res;
                });

                if (res.length > 0) {
                    setCurrentPage(1);
                    setTotalPages(Math.ceil(res.length / dataPerPage));
                    setQuizListData(GFG(res, currentPage, dataPerPage));
                    if (srchInp == "") {
                        setCurrentPage(1);
                        setTotalPages(Math.ceil(quizData.length / dataPerPage));
                        setQuizListData([]);
                    }
                } else {
                    if (srchInp == "") {
                        setCurrentPage(1);
                        setTotalPages(Math.ceil(quizData.length / dataPerPage));
                        setQuizListData([]);
                    }
                    setCurrentPage(1);
                    setQuizListData(GFG(res, currentPage, dataPerPage));
                    setTotalPages(Math.ceil(res.length / dataPerPage));
                }
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "No Quizes Found.",
                    icon: "error",
                    timer: 4000
                });
            }
        }
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        setQuizListData(GFG(quizData, newPage, dataPerPage));
        setSelectAll(false);
        setSelectedItems([]);
    };

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        const allIds = quizListData.map(item => item['quiz_id']);
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

    const handleDeleteSelectedBulkLogic = async () => {
        if (selectedItems.length > 0) {
            const conf = confirm("Are you sure want to delete selected Quizes ?");
            if (conf) {
                const baseURI = window.location.origin;
                const resp = await fetch(`${baseURI}/api/admin/quizes/bulk-actions/delete-selected`, {
                    method: "DELETE",
                    body: JSON.stringify({ quiz_id_list: selectedItems })
                });
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
                }
            }
        } else {
            Swal.fire({
                title: "Error!",
                text: "Please Select Quiz Items First!",
                icon: "error",
                timer: 3000
            });
        }
    }

    const handleDeleteAllBulkLogic = async () => {
        const conf = confirm("Are you sure want to delete all quizes ?");
        if (conf) {
            const baseURI = window.location.origin;
            const resp = await fetch(`${baseURI}/api/admin/quizes/bulk-actions/delete-all`, {
                method: "DELETE",
            });
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
            }
        }
        setIsMenuOpen(false);
    }

    const getQuizes = async () => {
        const baseURI = window.location.origin;
        try {
            const resp = await fetch(`${baseURI}/api/admin/quizes/bulk-actions/read-all`, {
                method: "GET",
            });
            if (!resp.ok) {
                setIsLoading(false);
            }
            const body = await resp.json();
            if (body.success) {
                setIsLoading(false);
                setQuizListData(GFG(body.quizes, currentPage, dataPerPage));
                setQuizData(body.quizes);
                setTotalPages(Math.ceil(body.quizes.length / dataPerPage));
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // setQuizListData(GFG(dump_list_of_quizes, currentPage, dataPerPage));
        getQuizes();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (selectedItems.length === quizListData.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedItems, quizListData]);

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
                                href="/admin/quizes/create-new-quiz"
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
                        quizListData?.length ?
                            (
                                <>
                                    {
                                        quizListData.map((itm: AdminQuizesListCardType) => (
                                            <div key={itm.quiz_id} className="pb-[20px] last:pb-0">
                                                <AdminListQuizCard
                                                    quiz_id={itm.quiz_id}
                                                    quiz_title={itm.quiz_title}
                                                    quiz_status={itm.quiz_status}
                                                    total_questions={itm.total_questions}
                                                    checkboxName={"quiz_list"}
                                                    checkboxValue={itm.quiz_id}
                                                    checkboxChecked={selectedItems.includes(itm.quiz_id)}
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
                                                    No Quizes Found.
                                                </h1>
                                            )
                                    }
                                </>
                            )
                    }
                </div>

                <div className="pb-[70px]">
                    <SitePagination
                        totalPages={totalPages}
                        dataPerPage={dataPerPage}
                        currentPage={currentPage}
                        parentClassList="pt-[50px]"
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    )
}

export default Page;