'use client';

import { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import Swal from "sweetalert2";
import { RTSPkgSelectType } from "@/app/types/components/admin/componentsTypes";
import TokenChecker from "@/app/libs/tokenChecker";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";
import { callbackErrT1S1_ST1, callbackOnErrT1S1_ST1, callbackOnSucT1S1_ST1, QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";
import { useReadAllAdminCategories, useReadAllAdminHomeCategories } from "@/app/libs/tanstack-query/admin/queries/adminQueries";
import { useCreateUpdateHomeCategories, useDeleteAllAdminHomeCategories } from "@/app/libs/tanstack-query/admin/mutations/adminCategoriesMutations";

function Page() {

    const token = getCookie(adminAuthUserCookieName);
    const [homeCats, setHomeCats] = useState<RTSPkgSelectType[]>([]);
    const [homeCatOpts, setHomeCatOpts] = useState<RTSPkgSelectType[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    const [homeCatsId, setHomeCatsId] = useState<string>("");

    //eslint-disable-next-line
    const handleChangeSelect = (value: any) => {
        setHomeCats(value);
    }

    const getSavedCats = async (cb_new?: () => void, cb_update?: () => void) => {
        // setIsLoading(true);
        let isCatsExist = false;
        const baseURI = window.location.origin;
        const token = getCookie(adminAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/admin/categories/home-categories/read?token=${token}`, {
                method: "GET",
            });
            const body = await resp.json();
            if (body.success) {
                isCatsExist = true;
                // setHomeCats(body.home_cats);
                // setHomeCatsId(body.home_cats_id);
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

    const delAllHomCats = useDeleteAllAdminHomeCategories({
        token,
        errorCB: (resp) => callbackErrT1S1_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S1_ST1(resp),
        onSuccessCB: (resp) => callbackOnSucT1S1_ST1(resp)
    });

    const clearCats = async () => {
        const conf = confirm("Are you sure want to clear home page top categories ?");
        if (conf) {
            const tokenDel = getCookie(adminAuthUserCookieName);
            delAllHomCats.mutate({ token: tokenDel ?? "" });
        }
    }

    const creUpdHomCats = useCreateUpdateHomeCategories({
        token,
        errorCB: (resp) => callbackErrT1S1_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S1_ST1(resp),
        onSuccessCB: (resp) => callbackOnSucT1S1_ST1(resp)
    });

    const setHomeCatsDB = async () => {
        const cats: string[] = [];
        for (let i = 0; i < homeCats.length; i++) {
            cats.push(homeCats[i].value);
        }
        const tokenSub = getCookie(adminAuthUserCookieName);
        creUpdHomCats.mutate({ token: tokenSub ?? "", home_cats: cats });
    }

    const updateHomeCatsDB = async () => {
        const cats: string[] = [];
        for (let i = 0; i < homeCats.length; i++) {
            cats.push(homeCats[i].value);
        }
        const tokenSub = getCookie(adminAuthUserCookieName);
        creUpdHomCats.mutate({ token: tokenSub ?? "", home_cats: cats, home_cats_id: homeCatsId });
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

    const { data, isError, error, isSuccess, isLoading } = useReadAllAdminCategories(token ?? "");

    useEffect(() => {
        if (isSuccess) {
            if (data.cat_data && data.cat_data.length) {
                const cts = data.cat_data;
                //eslint-disable-next-line
                let opts: RTSPkgSelectType[] = [];
                for (let i = 0; i < cts.length; i++) {
                    const obj = {
                        value: cts[i].category_id,
                        label: cts[i].category_title
                    }
                    opts.push(obj);
                }
                setHomeCatOpts(opts);
            }
        }

        QF_TQ_UEF_CatchErrorCB(isError, error);
    }, [data, isSuccess, isError, error, setHomeCatOpts]);

    const getHomeSavedCats = useReadAllAdminHomeCategories(token ?? "");

    useEffect(() => {
        if (getHomeSavedCats.isSuccess) {
            const data = getHomeSavedCats.data;
            if (data.home_cats && data.home_cats.length) {
                setHomeCats(data.home_cats);
            } else {
                setHomeCats([]);
            }
            if (data.home_cats_id) {
                setHomeCatsId(data.home_cats_id);
            }
        }
    }, [getHomeSavedCats.data, getHomeSavedCats.isSuccess, getHomeSavedCats.isError, getHomeSavedCats.error, setHomeCats]);

    return (
        <>
            <TokenChecker is_admin={true} />
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
                                placeholder="Select ..."
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
                                ((isLoading && getHomeSavedCats.isLoading) || creUpdHomCats.isPending) ?
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