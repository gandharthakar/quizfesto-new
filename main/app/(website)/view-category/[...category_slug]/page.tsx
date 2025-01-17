'use client';

import QuizCard from "@/app/components/quizCard";
// import { dump_quizzes_list } from "@/app/constant/datafaker"
import { RiSearch2Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import SitePagination from "@/app/components/sitePagination";
import { useParams } from "next/navigation";
import { QuizCardPropsType } from "@/app/types/pages/website/viewQuizDetailsPageTypes";
import { GFG } from "@/app/libs/helpers/helperFunctions";

function Page() {

    const params = useParams<{ category_slug: string }>();
    const cat_slug = params.category_slug;

    const dataPerPage = 6;
    const [srchInp, setSrchInp] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [quizData, setQuizData] = useState<QuizCardPropsType[]>([]);
    const [totalPages, setTotalPages] = useState<number>(Math.ceil(quizData.length / dataPerPage));
    const [quizList, setQuizList] = useState<QuizCardPropsType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [catName, setCatName] = useState<string>('Category');

    const handleSearchInputChange = (e: any) => {
        setSrchInp(e.target.value);
        if (srchInp.length === 1) {
            setCurrentPage(1);
            setQuizList(GFG(quizData, currentPage, dataPerPage));
            setTotalPages(Math.ceil(quizData.length / dataPerPage));
        }
    }

    const handleSearchInputKeyDown = (e: any) => {
        setSrchInp(e.target.value);
        if (e.key === "Backspace") {
            setCurrentPage(1);
            setQuizList(GFG(quizData, currentPage, dataPerPage));
            setTotalPages(Math.ceil(quizData.length / dataPerPage));
        }
    }

    const handleSearchLogic = (e: any) => {
        e.preventDefault();
        if (srchInp == '') {
            Swal.fire({
                title: "Error!",
                text: "Please enter search term first.",
                icon: "error",
                timer: 4000
            });
        } else {

            if (quizList.length > 0) {

                const res = quizData.filter((item) => {
                    const srch_res =
                        item.quiz_title.toLowerCase().includes(srchInp.toLowerCase()) ||
                        item.quiz_summary.toLowerCase().includes(srchInp.toLowerCase()) ||
                        item.quiz_categories?.some(item => item.category_slug.includes(srchInp.toLowerCase()))
                    return srch_res;
                });

                if (res.length > 0) {
                    setCurrentPage(1);
                    setTotalPages(Math.ceil(res.length / dataPerPage));
                    setQuizList(GFG(res, currentPage, dataPerPage));
                    if (srchInp == "") {
                        setCurrentPage(1);
                        setTotalPages(Math.ceil(quizData.length / dataPerPage));
                        setQuizList([]);
                    }
                } else {
                    if (srchInp == "") {
                        setCurrentPage(1);
                        setTotalPages(Math.ceil(quizData.length / dataPerPage));
                        setQuizList([]);
                    }
                    setCurrentPage(1);
                    setQuizList(GFG(res, currentPage, dataPerPage));
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
        setQuizList(GFG(quizData, newPage, dataPerPage));
    };

    const getQuizes = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/get-quizes/bulk-list/category-wise`, {
            method: "POST",
            body: JSON.stringify({ category_slug: cat_slug }),
            cache: 'no-store',
            next: { revalidate: 60 }
        });
        const body = await resp.json();
        if (body.success) {
            setIsLoading(false);
            setQuizList(GFG(body.quizes, currentPage, dataPerPage));
            setQuizData(body.quizes);
            setTotalPages(Math.ceil(body.quizes.length / dataPerPage));
            setCatName(body.category.category_title);
        } else {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getQuizes();
        // setQuizList(GFG(dump_quizzes_list, currentPage, dataPerPage));
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <section className="transition-all delay-75 pt-[100px] md:pt-[150px] pb-[50px] px-[15px] bg-zinc-100 dark:bg-zinc-900">
                <div className="site-container">
                    <div className="text-center">
                        <h1 className="transition-all delay-75 inline-block font-ubuntu text-[20px] md:text-[30px] break-words font-semibold text-zinc-900 dark:text-zinc-200">
                            {catName}
                        </h1>
                    </div>

                    <div className="pt-[20px] md:max-w-[350px] mx-auto">
                        <form onSubmit={handleSearchLogic}>
                            <div className="relative ">
                                <input
                                    type="text"
                                    name="Search"
                                    id="search"
                                    placeholder="Search ..."
                                    autoComplete="off"
                                    className="transition-all delay-75 block w-full bg-white border-[2px] border-solid border-zinc-400 pl-[15px] pr-[42px] md:pr-[50px] py-[8px] md:py-[10px] font-noto_sans text-[16px] md:text-[18px] font-semibold text-zinc-800 rounded-full focus:outline-0 placeholder-zinc-400 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-200"
                                    value={srchInp}
                                    onChange={handleSearchInputChange}
                                    onKeyDown={handleSearchInputKeyDown}
                                />
                                <div className="absolute right-[16px] md:right-[18px] top-[12px] md:top-[13px] z-[2]">
                                    <button
                                        type="submit"
                                        title="Search"
                                        className="transition-all delay-75 text-zinc-800 dark:text-zinc-200"
                                    >
                                        <RiSearch2Line size={25} className="w-[20px] h-[20px] md:w-[25px] md:h-[25px]" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <section className="transition-all delay-75 py-[50px] px-[15px] bg-zinc-200 dark:bg-zinc-800">
                <div className="site-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                        {
                            quizList.length > 0 ?
                                (
                                    <>
                                        {
                                            quizList.map((item) => (
                                                <QuizCard
                                                    key={item.quiz_id}
                                                    quiz_id={item.quiz_id}
                                                    quiz_title={item.quiz_title}
                                                    quiz_cover_photo={item.quiz_cover_photo}
                                                    quiz_categories={item.quiz_categories}
                                                    quiz_summary={item.quiz_summary}
                                                    quiz_total_question={item.quiz_total_question}
                                                    quiz_total_marks={item.quiz_total_marks}
                                                    quiz_display_time={item.quiz_display_time}
                                                    quiz_terms={item.quiz_terms}
                                                />
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

                    <SitePagination
                        totalPages={totalPages}
                        dataPerPage={dataPerPage}
                        currentPage={currentPage}
                        parentClassList="pt-[50px]"
                        onPageChange={handlePageChange}
                    />
                </div>
            </section>
        </>
    )
}

export default Page;