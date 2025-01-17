import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { GoChevronRight } from "react-icons/go";
import { AdminBreadcrumbsType } from "@/app/types/components/admin/componentsTypes";

const AdminBreadcrumbs = (props: AdminBreadcrumbsType) => {

    const { home_slug, home_title, menuItems } = props;

    return (
        <ul className="flex items-center gap-x-[10px] gap-y-[10px] flex-wrap">
            <li>
                <div className="text-zinc-400 hover:text-blue-500">
                    <Link href={home_slug ?? ''} title={home_title ?? ""}>
                        <FaHome size={22} className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" />
                    </Link>
                </div>
            </li>
            {
                menuItems ?? [].length > 0 ?
                    (
                        <>
                            {
                                menuItems?.map(item => (
                                    <li key={item.menu_item_id}>
                                        <ul className="flex items-center gap-x-[10px] gap-y-[10px] flex-wrap">
                                            <li>
                                                <div className="text-zinc-400">
                                                    <GoChevronRight size={22} className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" />
                                                </div>
                                            </li>
                                            <li>
                                                {
                                                    item.clickable ?
                                                        (
                                                            <Link
                                                                href={item.menu_slug}
                                                                title={item.menu_title}
                                                                className="transition-all delay-75 block font-ubuntu text-[14px] md:text-[16px] text-zinc-900 hover:text-blue-500 dark:text-zinc-200 dark:hover:text-blue-500"
                                                            >
                                                                {item.menu_title}
                                                            </Link>
                                                        )
                                                        :
                                                        (
                                                            <h3 className="transition-all delay-75 font-ubuntu text-[14px] md:text-[16px] text-zinc-400">
                                                                {item.menu_title}
                                                            </h3>
                                                        )
                                                }
                                            </li>
                                        </ul>
                                    </li>
                                ))
                            }
                        </>
                    )
                    :
                    ('')
            }
        </ul>
    )
}

export default AdminBreadcrumbs;