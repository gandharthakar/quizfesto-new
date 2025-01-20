'use client';

import { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import Swal from "sweetalert2";
import { RTSPkgSelectType } from "@/app/types/components/admin/componentsTypes";

function Page() {

    const [homeCats, setHomeCats] = useState<RTSPkgSelectType[]>([]);
    const [homeCatOpts, setHomeCatOpts] = useState<RTSPkgSelectType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [homeCatsId, setHomeCatsId] = useState<string>("");

    //eslint-disable-next-line
    const handleChangeSelect = (value: any) => {
        setHomeCats(value);
    }

    const getSavedCats = async (cb_new?: () => void, cb_update?: () => void) => {
        setIsLoading(true);
        let isCatsExist = false;
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/admin/categories/home-categories/read`, {
            method: "GET",
        });
        const body = await resp.json();
        if (body.success) {
            isCatsExist = true;
            setHomeCats(body.home_cats);
            setHomeCatsId(body.home_cats_id);
            if (cb_update) {
                cb_update();
            }
        } else {
            isCatsExist = false;
            if (cb_new) {
                cb_new();
            }
        }
        return isCatsExist;
    }

    const clearCats = async () => {
        const conf = confirm("Are you sure want to clear home page top categories ?");
        if (conf) {
            const baseURI = window.location.origin;
            const resp = await fetch(`${baseURI}/api/admin/categories/home-categories/clear`, {
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
    }

    const setHomeCatsDB = async () => {
        const cats: string[] = [];
        for (let i = 0; i < homeCats.length; i++) {
            cats.push(homeCats[i].value);
        }
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/admin/categories/home-categories/create-update`, {
            method: "POST",
            body: JSON.stringify({ home_cats: cats })
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
            setIsLoading(false);
        }
    }

    const updateHomeCatsDB = async () => {
        const cats: string[] = [];
        for (let i = 0; i < homeCats.length; i++) {
            cats.push(homeCats[i].value);
        }
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/admin/categories/home-categories/create-update`, {
            method: "POST",
            body: JSON.stringify({ home_cats: cats, home_cats_id: homeCatsId })
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
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (homeCats.length > 0) {
            getSavedCats(setHomeCatsDB, updateHomeCatsDB);
        } else {
            Swal.fire({
                title: "Error!",
                text: "Please Select Categories First!",
                icon: "error",
                timer: 2000
            });
        }
    }

    const getCats = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/admin/categories/bulk-actions/read-all`, {
            method: "GET",
        });
        const body = await resp.json();
        if (body.success) {
            const cts = body.cat_data;
            const opts: RTSPkgSelectType[] = [];
            for (let i = 0; i < cts.length; i++) {
                const obj = {
                    value: cts[i].category_id,
                    label: cts[i].category_title
                }
                opts.push(obj);
            }
            setHomeCatOpts(opts);
            setIsLoading(false);
        } else {
            Swal.fire({
                title: "Error!",
                text: body.message,
                icon: "error",
                timer: 4000
            });
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // const options: TwSelInt[] = [
        //     { value: "fox", label: "🦊 Fox" },
        //     { value: "Butterfly", label: "🦋 Butterfly" },
        //     { value: "Honeybee", label: "🐝 Honeybee" }
        // ];

        // setHomeCatOpts(options);
        getCats();
        getSavedCats();
    }, []);

    return (
        <>
            <div className="py-[25px]">
                <form onSubmit={handleSubmit}>
                    <div className="transition-all delay-75 border-[2px] border-solid p-[15px] md:p-[25px] border-zinc-300 bg-white dark:bg-zinc-800 dark:border-zinc-600">
                        <div className="pb-[20px]">
                            <Select
                                primaryColor={"indigo"}
                                value={homeCats}
                                onChange={handleChangeSelect}
                                options={homeCatOpts}
                                isMultiple={true}
                                isSearchable={true}
                                classNames={{
                                    menuButton: () => `flex cursor-pointer text-sm text-gray-500 border border-gray-300 shadow-sm transition-all duration-75 focus:outline-0 bg-zinc-100 hover:border-gray-400 dark:bg-zinc-900 dark:border-zinc-500`,
                                    menu: `font_noto_sans absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 dark:bg-zinc-900 dark:border-zinc-500`,
                                    tagItem: () => `bg-gray-200 border rounded-sm flex space-x-1 pl-1 dark:bg-zinc-800 dark:border-zinc-500 dark:text-zinc-200`,
                                    tagItemText: `text-zinc-900 font_noto_sans truncate cursor-default select-none dark:text-zinc-200`,
                                    listItem: () => `block font_noto_sans transition duration-200 px-3 py-3 cursor-pointer select-none truncate rounded text-zinc-500 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800`,
                                    searchContainer: `relative py-[10px] px-[15px]`,
                                    searchBox: `w-full font_noto_sans py-2 pl-8 pr-2 text-sm text-zinc-800 bg-gray-100 border border-gray-200 focus:outline-0 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-200`,
                                }}
                            />
                        </div>
                        <div className="text-right">
                            {
                                isLoading ?
                                    (<div className="spinner size-1"></div>)
                                    :
                                    (
                                        <>
                                            <button
                                                type="button"
                                                title="Clear"
                                                className="transition-all delay-75 inline-block px-[20px] md:px-[25px] py-[10px] md:py-[12px] text-center font-noto_sans font-semibold text-[16px] md:text-[18px] text-red-600"
                                                onClick={clearCats}
                                            >
                                                Clear
                                            </button>
                                            <button type="submit" title="Save Categories" className="transition-all delay-75 inline-block concard px-[20px] md:px-[25px] py-[10px] md:py-[12px] text-center text-white font-noto_sans font-semibold text-[16px] md:text-[18px] hover:shadow-lg">
                                                Save Categories
                                            </button>
                                        </>
                                    )
                            }
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Page;