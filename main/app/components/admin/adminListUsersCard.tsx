'use client';

import { IoMdCheckmark } from "react-icons/io";
import { FaEllipsisVertical } from "react-icons/fa6";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { AdminUsersListCardType } from "@/app/types/components/admin/componentsTypes";

function AdminListUsersCard(props: AdminUsersListCardType) {

    const {
        user_id,
        user_name,
        user_role,
        user_block_status,
        checkboxName,
        checkboxChecked,
        onCheckboxChange,
    } = props;

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        setIsMenuOpen(false);
    }

    const handleDeleteUser = async () => {
        setIsMenuOpen(false);
        const conf = confirm("Are you sure want to delete this user ?");
        if (conf) {
            const baseURI = window.location.origin;
            const resp = await fetch(`${baseURI}/api/admin/users/crud/delete`, {
                method: "DELETE",
                body: JSON.stringify({ user_id })
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
            <div className="transition-all delay-75 border-[2px] border-solid p-[15px] border-zinc-300 bg-white hover:border-zinc-600 dark:bg-zinc-800 dark:border-zinc-600 dark:hover:border-zinc-400">
                <div className="flex gap-x-[15px] items-start">
                    <div className="alqc-chrb">
                        <input
                            type="checkbox"
                            id={user_id}
                            name={checkboxName}
                            className="input-chrb"
                            value={user_id}
                            checked={checkboxChecked}
                            onChange={() => onCheckboxChange ? onCheckboxChange(user_id) : null}
                        />
                        <label htmlFor={user_id} className="label">
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
                                {user_name}
                            </h1>
                        </div>
                        <div>
                            <h6 className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-200">
                                <span className="font-semibold">Role : </span>
                                {user_role}
                            </h6>
                            <h4 className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-200">
                                <span className="font-semibold">User Blocked : </span>
                                {user_block_status == 'false' ? (<span className="font-semibold text-theme-color-2">Unblocked</span>) : (<span className="font-semibold text-red-600">Blocked</span>)}
                            </h4>
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
                                    href={`/admin/users/edit-user/${user_id}`}
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
                                    onClick={handleDeleteUser}
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

export default AdminListUsersCard;