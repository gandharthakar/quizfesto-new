'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { AdminMenuItemType } from "@/app/types/components/admin/componentsTypes";

function AdminSubMenuComp(props: AdminMenuItemType) {

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLLIElement>(null);

    const {
        parentMenuItemURI,
        parentMenuItemTitle,
        parentMenuItemIcon,
        parentMenuItemActArr,
        parentMenuItemPathName,
        parentMenuItemOnClickCallBack,
        submenu,
        closeMainMenuOnParentItemClick,
        closeMainMenuFunc,
    } = props;

    const handleParentMenuItemClick = () => {
        if (parentMenuItemOnClickCallBack) {
            parentMenuItemOnClickCallBack();
        }
        setIsMenuOpen(!isMenuOpen);
        if (closeMainMenuOnParentItemClick) {
            if (closeMainMenuFunc) {
                closeMainMenuFunc();
            }
        }
    }

    const handleSubMenuItemClick = (cb: any) => {
        setIsMenuOpen(false);
        if (cb) {
            cb();
        }
    }

    useEffect(() => {

        const menuHandler = (e: any) => {
            if (menuRef.current !== null) {
                if (!menuRef.current.contains(e.target)) {
                    setIsMenuOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', menuHandler);

    }, []);

    return (
        <>
            <li ref={menuRef}>
                <Link
                    href={parentMenuItemURI}
                    title={parentMenuItemTitle}
                    className={`nav-item ${parentMenuItemActArr.includes(parentMenuItemPathName) ? 'active' : ''}`}
                    onClick={handleParentMenuItemClick}
                >
                    <div className="flex gap-x-[10px] items-center">
                        {parentMenuItemIcon}
                        <div className="mr-auto">
                            {parentMenuItemTitle}
                        </div>
                        {
                            submenu?.length &&
                            (
                                <>
                                    {
                                        isMenuOpen ?
                                            (<FaAngleUp size={20} className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />)
                                            :
                                            (<FaAngleDown size={20} className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />)
                                    }
                                </>
                            )
                        }
                    </div>
                </Link>
                {
                    submenu?.length &&
                    (
                        <>
                            {
                                isMenuOpen &&
                                (
                                    <ul className="pb-[10px] pt-[20px] md:pb-[20px] md:pt-[30px] pl-[15px] flex flex-col gap-y-[15px]">
                                        {
                                            submenu.map((itm) => (
                                                <li key={itm.subMenuItemId}>
                                                    <Link
                                                        href={itm.subMenuItemURI}
                                                        title={itm.subMenuItemTitle}
                                                        className={`admin-subnav-item ${itm.subMenuItemActArr.includes(itm.subMenuItemPathName) ? 'active' : ''}`}
                                                        onClick={() => handleSubMenuItemClick(itm.subMenuItemOnClickCallBack)}
                                                    >
                                                        {itm.subMenuItemTitle}
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                )
                            }
                        </>
                    )
                }
            </li>
        </>
    )
}

export default AdminSubMenuComp;