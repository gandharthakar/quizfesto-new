'use client';

import { IoMdCheckmark } from "react-icons/io";
import { FaEllipsisVertical } from "react-icons/fa6";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import { AdminCategoriesListCardType } from "@/app/types/components/admin/componentsTypes";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";
import { useDeleteSingleCategory } from "@/app/libs/tanstack-query/admin/mutations/adminCategoriesMutations";
import { callbackErrT1S1_ST1, callbackOnErrT1S1_ST1, callbackOnSucT1S1_ST1 } from "@/app/libs/helpers/helperFunctions";

function AdminListCategoryCard(props: AdminCategoriesListCardType) {

    const {
        category_id,
        category_title,
        category_slug,
        checkboxName,
        checkboxChecked,
        onCheckboxChange,
    } = props;

    const token = getCookie(adminAuthUserCookieName);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    // const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClick = () => {
        setIsMenuOpen(false);
    }

    const delSinCat = useDeleteSingleCategory({
        token,
        errorCB: (resp) => callbackErrT1S1_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S1_ST1(resp),
        onSuccessCB: (resp) => callbackOnSucT1S1_ST1(resp)
    });

    const handleDeleteCategory = async () => {
        const conf = confirm("Are you sure want to delete this category ?");
        if (conf) {
            setIsMenuOpen(false);
            const tokenDel = getCookie(adminAuthUserCookieName);
            delSinCat.mutate({ token: tokenDel ?? "", category_id: category_id });
        }
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
                    delSinCat.isPending &&
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
                            id={category_id}
                            name={checkboxName}
                            className="input-chrb"
                            value={category_id}
                            checked={checkboxChecked}
                            onChange={() => onCheckboxChange ? onCheckboxChange(category_id) : null}
                        />
                        <label htmlFor={category_id} className="label">
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
                                {category_title}
                            </h1>
                        </div>
                        <div>
                            <h6 className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-200">
                                <span className="font-semibold">Slug : </span>
                                {category_slug}
                            </h6>
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
                                <Link
                                    href={`/admin/categories/edit-category/${category_id}`}
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
                                    onClick={handleDeleteCategory}
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

export default AdminListCategoryCard;