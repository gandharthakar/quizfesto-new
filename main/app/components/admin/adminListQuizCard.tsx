'use client';

import { IoMdCheckmark } from "react-icons/io";
import { FaEllipsisVertical } from "react-icons/fa6";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import { IoDuplicateOutline } from "react-icons/io5";
import copy from "copy-to-clipboard";
import Swal from "sweetalert2";
import { AdminQuizesListCardType } from "@/app/types/components/admin/componentsTypes";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";

function AdminListQuizCard(props: AdminQuizesListCardType) {

    const {
        quiz_id,
        quiz_title,
        quiz_status,
        total_questions,
        checkboxName,
        checkboxChecked,
        onCheckboxChange,
    } = props;

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClick = () => {
        setIsMenuOpen(false);
    }

    const handleDeleteQuiz = async () => {
        const conf = confirm("Are you sure want to delete this quiz ?");
        if (conf) {
            setIsMenuOpen(false);
            const baseURI = window.location.origin;
            const token = getCookie(adminAuthUserCookieName);
            setIsLoading(true);
            try {
                const resp = await fetch(`${baseURI}/api/admin/quizes/crud/delete`, {
                    method: "DELETE",
                    body: JSON.stringify({ token, quiz_id: quiz_id }),
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
                        timer: 3000
                    });
                    const set = setTimeout(() => {
                        window.location.reload();
                        setIsLoading(false);
                        clearTimeout(set);
                    }, 3000);
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: body.message,
                        icon: "error",
                        timer: 3000
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

    const handleDuplicateQuiz = async () => {
        setIsMenuOpen(false);
        const baseURI = window.location.origin;
        const token = getCookie(adminAuthUserCookieName);
        setIsLoading(true);
        try {
            const resp = await fetch(`${baseURI}/api/admin/quizes/crud/create-duplicate`, {
                method: "POST",
                body: JSON.stringify({ token, quiz_id: quiz_id }),
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
                    timer: 3000
                });
                const set = setTimeout(() => {
                    window.location.reload();
                    setIsLoading(false);
                    clearTimeout(set);
                }, 3000);
            } else {
                Swal.fire({
                    title: "Error!",
                    text: body.message,
                    icon: "error",
                    timer: 3000
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

    const handleCopyquiz_id = () => {
        setIsMenuOpen(false);
        copy(quiz_id);
        Swal.fire({
            title: "Success!",
            text: "Quiz ID Copied Successfully!",
            icon: "success",
            timer: 3000
        });
    }

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
            <div className="transition-all delay-75 relative border-[2px] border-solid p-[15px] border-zinc-300 bg-white hover:border-zinc-600 dark:bg-zinc-800 dark:border-zinc-600 dark:hover:border-zinc-400">
                {
                    isLoading &&
                    (
                        <>
                            <div className={`transition-all delay-75 absolute left-0 top-0 z-[10] bg-[rgba(255,255,255,0.90)] w-full h-full dark:bg-[rgba(9,9,11,0.95)] justify-center items-center flex`}>
                                <div className="spinner size-5"></div>
                            </div>
                        </>
                    )
                }
                <div className="flex gap-x-[15px] items-start">
                    <div className="alqc-chrb">
                        <input
                            type="checkbox"
                            id={quiz_id}
                            name={checkboxName}
                            className="input-chrb"
                            value={quiz_id}
                            checked={checkboxChecked}
                            onChange={() => onCheckboxChange ? onCheckboxChange(quiz_id) : null}
                        />
                        <label htmlFor={quiz_id} className="label">
                            <div>
                                <div className="squere-box">
                                    <IoMdCheckmark size={18} className="svg-icon" />
                                </div>
                            </div>
                        </label>
                    </div>
                    <div className="mr-auto">
                        <div className="pb-[5px]">
                            <h1 className="transition-all delay-75 font-noto_sans text-[18px] md:text-[20px] font-semibold text-zinc-800 dark:text-zinc-200 break-words">
                                {quiz_title}
                            </h1>
                        </div>
                        <div>
                            <h6 className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-200">
                                <span className="font-semibold">Status : </span>
                                {quiz_status == "draft" ? (<span className="text-red-500 font-bold">Draft</span>) : (<span className="text-green-500 font-bold">Published</span>)}
                            </h6>
                            <h5 className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-200">
                                <span className="font-semibold">Total Questions : </span>
                                {total_questions}
                            </h5>
                        </div>
                    </div>
                    <div ref={menuRef} className="relative h-[18px]">
                        <button
                            type="button"
                            title="Actions"
                            className="transition-all delay-75 text-zinc-800 dark:text-zinc-200"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <FaEllipsisVertical size={18} />
                        </button>
                        <ul className={`absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-950 dark:ring-zinc-800 ${isMenuOpen ? 'block' : 'hidden'}`}>
                            <li className="w-full">
                                <button
                                    type="button"
                                    title="Duplicate"
                                    className="transition-all delay-75 block w-full py-[10px] px-[15px] font-ubuntu text-[16px] text-zinc-900 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                    onClick={handleDuplicateQuiz}
                                >
                                    <div className="flex gap-x-[5px] items-center">
                                        <IoDuplicateOutline size={20} />
                                        <div>
                                            Duplicate
                                        </div>
                                    </div>
                                </button>
                            </li>
                            <li className="w-full">
                                <button
                                    type="button"
                                    title="Copy Quiz ID"
                                    className="transition-all delay-75 block w-full py-[10px] px-[15px] font-ubuntu text-[16px] text-zinc-900 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                    onClick={handleCopyquiz_id}
                                >
                                    <div className="flex gap-x-[5px] items-center">
                                        <svg width="100" height="100" className="w-[22px] h-[22px] md:w-[22px] md:h-[22px]" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_2009_9688)">
                                                <path fill="red" className="transition-all delay-75 fill-zinc-800 dark:fill-zinc-200" d="M5.83333 5.49984V2.99984C5.83333 2.77882 5.92113 2.56686 6.07741 2.41058C6.23369 2.2543 6.44565 2.1665 6.66667 2.1665H16.6667C16.8877 2.1665 17.0996 2.2543 17.2559 2.41058C17.4122 2.56686 17.5 2.77882 17.5 2.99984V14.6665C17.5 14.8875 17.4122 15.0995 17.2559 15.2558C17.0996 15.412 16.8877 15.4998 16.6667 15.4998H14.1667V17.9998C14.1667 18.4598 13.7917 18.8332 13.3275 18.8332H3.33917C3.22927 18.8338 3.12033 18.8128 3.0186 18.7712C2.91687 18.7296 2.82436 18.6684 2.74638 18.5909C2.6684 18.5135 2.60649 18.4214 2.56421 18.32C2.52193 18.2185 2.50011 18.1097 2.5 17.9998L2.5025 6.33317C2.5025 5.87317 2.8775 5.49984 3.34167 5.49984H5.83333ZM4.16917 7.1665L4.16667 17.1665H12.5V7.1665H4.16917ZM7.5 5.49984H14.1667V13.8332H15.8333V3.83317H7.5V5.49984Z" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2009_9688">
                                                    <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <div>
                                            Copy Quiz ID
                                        </div>
                                    </div>
                                </button>
                            </li>
                            <li className="w-full">
                                <Link
                                    href={`/admin/quizes/edit-quiz/${quiz_id}`}
                                    title="Edit"
                                    className="transition-all delay-75 block w-full py-[10px] px-[15px] font-ubuntu text-[16px] text-zinc-900 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                    onClick={handleClick}
                                >
                                    <div className="flex gap-x-[5px] items-center">
                                        <MdOutlineModeEdit size={20} />
                                        <div>
                                            Edit
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li className="w-full">
                                <button
                                    type="button"
                                    title="Delete"
                                    className="transition-all delay-75 block w-full py-[10px] px-[15px] font-ubuntu text-[16px] text-red-500 hover:bg-zinc-100 dark:text-red-500 dark:hover:bg-zinc-800"
                                    onClick={handleDeleteQuiz}
                                >
                                    <div className="flex gap-x-[5px] items-center">
                                        <RiDeleteBin6Line size={20} />
                                        <div>
                                            Delete
                                        </div>
                                    </div>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminListQuizCard;