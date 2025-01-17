'use client';

import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/libs/redux-service/store";
import { usePathname, useParams } from "next/navigation";
import { close_admin_area_menu } from "@/app/libs/redux-service/slices/admin/adminAreaMenuToggleSlice";
import { VscDashboard } from "react-icons/vsc";
import { RiMessage2Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineTrophy } from "react-icons/ai";
import AdminThemeSwitchButton from "./adminThemeSwitchButton";
import { IoFlagOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import AdminSubMenuComp from "./adminSubMenuComp";

function AdminAreaNav() {

    const dispatch = useDispatch();
    const pathName = usePathname();
    const params = useParams();
    const ques_id = params?.question_id ? params?.question_id[0] : '';
    const opt_id = params?.option_id ? params?.option_id[0] : '';
    const cat_id = params?.category_id ? params?.category_id[0] : '';
    const usr_id = params?.user_id ? params?.user_id[0] : '';
    const quiz_id = params?.quiz_id ? params?.quiz_id[0] : '';

    const isMenuOpen = useSelector((state: RootState) => state.admin_area_menu_toggle.is_admin_area_menu_open);
    const isDarkTheme = useSelector((state: RootState) => state.admin_theme_mode.admin_dark_theme_mode);

    const all_quizes_mi: string[] = ["/admin/quizes", "/admin/quizes/create-new-quiz", `/admin/quizes/edit-quiz/${quiz_id}`, "/admin/questions", "/admin/options", "/admin/questions/create-new-question", `/admin/questions/edit-question/${ques_id}`, "/admin/options/create-new-options", `/admin/options/edit-options/${opt_id}`];
    const all_users_mi: string[] = ["/admin/users", "/admin/users/create-new-user", `/admin/users/edit-user/${usr_id}`];
    const all_prizes_mi: string[] = ["/admin/prizes"];
    const all_winners_mi: string[] = ["/admin/winners"];
    const all_qzcats_mi: string[] = ["/admin/categories", "/admin/categories/create-new-category", `/admin/categories/edit-category/${cat_id}`, "/admin/categories/set_home_categories"];

    const quizes_submenu = [
        {
            subMenuItemId: '1',
            subMenuItemURI: '/admin/quizes',
            subMenuItemTitle: 'Quizes',
            subMenuItemActArr: ["/admin/quizes", "/admin/quizes/create-new-quiz", `/admin/quizes/edit-quiz/${quiz_id}`],
            subMenuItemPathName: pathName,
            subMenuItemOnClickCallBack: () => dispatch(close_admin_area_menu()),
        },
        {
            subMenuItemId: '2',
            subMenuItemURI: '/admin/questions',
            subMenuItemTitle: 'Questions',
            subMenuItemActArr: ["/admin/questions", "/admin/questions/create-new-question", `/admin/questions/edit-question/${ques_id}`],
            subMenuItemPathName: pathName,
            subMenuItemOnClickCallBack: () => dispatch(close_admin_area_menu()),
        },
        {
            subMenuItemId: '3',
            subMenuItemURI: '/admin/options',
            subMenuItemTitle: 'Options',
            subMenuItemActArr: ["/admin/options", "/admin/options/create-new-options", `/admin/options/edit-options/${opt_id}`],
            subMenuItemPathName: pathName,
            subMenuItemOnClickCallBack: () => dispatch(close_admin_area_menu()),
        }
    ];

    const category_submenu = [
        {
            subMenuItemId: '1',
            subMenuItemURI: '/admin/categories',
            subMenuItemTitle: 'Categories',
            subMenuItemActArr: ["/admin/categories", "/admin/categories/create-new-category", `/admin/categories/edit-category/${cat_id}`],
            subMenuItemPathName: pathName,
            subMenuItemOnClickCallBack: () => dispatch(close_admin_area_menu()),
        },
        {
            subMenuItemId: '2',
            subMenuItemURI: '/admin/categories/set_home_categories',
            subMenuItemTitle: 'Home Categories',
            subMenuItemActArr: ["/admin/categories/set_home_categories"],
            subMenuItemPathName: pathName,
            subMenuItemOnClickCallBack: () => dispatch(close_admin_area_menu()),
        },
    ];

    return (
        <>
            <div className="hidden fixed top-0 left-0 w-full h-full z-[20] bg-black opacity-[0.4]"></div>
            <div className={`transition-all delay-75 min-w-[265px] lg:min-w-[300px] fixed z-[20] top-0 lg:relative lg:left-0 lg:top-0 h-screen lg:h-auto bg-white border-r border-solid border-zinc-300 dark:bg-zinc-950 dark:border-zinc-700 ${isMenuOpen ? 'left-0' : 'left-[-100%]'}`}>
                <div className="flex flex-col max-h-screen min-h-screen overflow-y-auto lg:fixed lg:left-0 lg:top-0 lg:w-full lg:max-w-[300px]">
                    <div>
                        <div className="py-[30px] md:py-[40px] px-[15px] text-center">
                            <Link href="/admin" title="Admin Home">
                                {
                                    isDarkTheme ?
                                        (<Image src="/images/qf-admin-og-black-bg-final.svg" width={150} height={32} className="w-[150px] h-auto inline-block" alt="Logo" priority={true} />)
                                        :
                                        (<Image src="/images/qf-admin-og-white-bg-final.svg" width={150} height={32} className="w-[150px] h-auto inline-block" alt="Logo" priority={true} />)
                                }
                            </Link>
                        </div>
                        <div className="pb-[15px] px-[15px] md:px-[25px] w-full">
                            <ul className="admin-area-nav">
                                <li>
                                    <Link
                                        href="/admin"
                                        title="Dashboard"
                                        className={`nav-item ${pathName === '/admin' ? 'active' : ''}`}
                                        onClick={() => dispatch(close_admin_area_menu())}
                                    >
                                        <div className="flex gap-x-[10px] items-center">
                                            <VscDashboard size={20} className="svg-icon" />
                                            <div>
                                                Dashboard
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link
                                        href="/admin/quizes"
                                        title="Quizes"
                                        className={`nav-item ${all_quizes_mi.includes(pathName) ? 'active' : ''}`}
                                        onClick={() => dispatch(close_admin_area_menu())}
                                    >
                                        <div className="flex gap-x-[10px] items-center">
                                            <RiMessage2Line size={20} className="svg-icon" />
                                            <div>
                                                Quizes
                                            </div>
                                        </div>
                                    </Link>
                                </li> */}
                                <AdminSubMenuComp
                                    parentMenuItemURI="#"
                                    parentMenuItemTitle="Quizzes"
                                    parentMenuItemIcon={<RiMessage2Line size={20} className="svg-icon" />}
                                    parentMenuItemActArr={all_quizes_mi}
                                    parentMenuItemPathName={pathName}
                                    submenu={quizes_submenu}
                                    closeMainMenuOnParentItemClick={false}
                                    closeMainMenuFunc={() => dispatch(close_admin_area_menu())}
                                />
                                <AdminSubMenuComp
                                    parentMenuItemURI="#"
                                    parentMenuItemTitle="Categories"
                                    parentMenuItemIcon={<BiCategory size={20} className="svg-icon" />}
                                    parentMenuItemActArr={all_qzcats_mi}
                                    parentMenuItemPathName={pathName}
                                    submenu={category_submenu}
                                    closeMainMenuOnParentItemClick={false}
                                    closeMainMenuFunc={() => dispatch(close_admin_area_menu())}
                                />
                                {/* <li>
                                    <Link
                                        href="/admin/categories"
                                        title="Categories"
                                        className={`nav-item ${all_qzcats_mi.includes(pathName) ? 'active' : ''}`}
                                        onClick={() => dispatch(close_admin_area_menu())}
                                    >
                                        <div className="flex gap-x-[10px] items-center">
                                            <BiCategory size={20} className="svg-icon" />
                                            <div>
                                                Categories
                                            </div>
                                        </div>
                                    </Link>
                                </li> */}
                                <li>
                                    <Link
                                        href="/admin/users"
                                        title="Users"
                                        className={`nav-item ${all_users_mi.includes(pathName) ? 'active' : ''}`}
                                        onClick={() => dispatch(close_admin_area_menu())}
                                    >
                                        <div className="flex gap-x-[10px] items-center">
                                            <FaRegUser size={20} className="svg-icon" />
                                            <div>
                                                Users
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/prizes"
                                        title="Prizes"
                                        className={`nav-item ${all_prizes_mi.includes(pathName) ? 'active' : ''}`}
                                        onClick={() => dispatch(close_admin_area_menu())}
                                    >
                                        <div className="flex gap-x-[10px] items-center">
                                            <AiOutlineTrophy size={20} className="svg-icon" />
                                            <div>
                                                Prizes
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/winners"
                                        title="Winners"
                                        className={`nav-item ${all_winners_mi.includes(pathName) ? 'active' : ''}`}
                                        onClick={() => dispatch(close_admin_area_menu())}
                                    >
                                        <div className="flex gap-x-[10px] items-center">
                                            <IoFlagOutline size={20} className="svg-icon" />
                                            <div>
                                                Winners
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-auto w-full">
                        <div className="pb-[10px] px-[15px] md:px-[30px] block md:hidden">
                            <div className="flex items-center gap-x-[15px]">
                                <div className="transition-all delay-75 font-ubuntu text-[14px] text-zinc-700 dark:text-zinc-300">
                                    Theme:
                                </div>
                                <AdminThemeSwitchButton />
                            </div>
                        </div>
                        <div className="pb-[10px] text-center">
                            <p className="transition-all delay-75 font-noto_sans text-[12px] inline-block text-zinc-600 dark:text-zinc-500">
                                &copy; {new Date().getFullYear()} All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminAreaNav;