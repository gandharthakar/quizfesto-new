'use client';

import { MdOutlineClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { close_admin_area_menu, open_admin_area_menu } from "@/app/libs/redux-service/slices/admin/adminAreaMenuToggleSlice";
import { RootState } from "@/app/libs/redux-service/store";

function AdminAreaMenuToggleButton() {

    const dispatch = useDispatch();
    const isMenuOpen = useSelector((state: RootState) => state.admin_area_menu_toggle.is_admin_area_menu_open);

    const toggleMenu = () => {
        if (!isMenuOpen) {
            dispatch(open_admin_area_menu());
        } else {
            dispatch(close_admin_area_menu());
        }
    }

    return (
        <>
            <button type="button" title="Toggle Menu" className="transition-all delay-75 text-zinc-700 hover:text-theme-color-2 dark:text-zinc-300 dark:hover:text-theme-color-2" onClick={toggleMenu}>
                {isMenuOpen ? (<MdOutlineClose size={25} />) : (<FiMenu size={25} />)}
            </button>
        </>
    )
}

export default AdminAreaMenuToggleButton;