import Link from 'next/link';
import ThemeCheckerSingle from '@/app/libs/themeCheckerSingle';
import { FaCaretLeft } from "react-icons/fa6";
import { FaCaretRight, FaLongArrowAltLeft } from "react-icons/fa";

export default function NotFound() {
    return (
        <>
            <ThemeCheckerSingle />
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-950 py-[50px] px-[20px]">
                <div className="concard max-w-[600px] w-full p-[2px]">
                    <div className='bg-zinc-100 dark:bg-zinc-900 px-[20px] py-[30px] md:py-[50px]'>
                        <div className="pb-[10px] md:pb-[20px] text-center">
                            <h1 className="transition-all delay-75 inline-block font-ubuntu font-bold text-[65px] md:text-[100px] text-grd-1 leading-[50px] md:leading-[85px]">
                                404
                            </h1>
                        </div>
                        <div className="pb-[5px] md:pb-[20px] text-center">
                            <h2 className="inline-block font-noto_sans font-semibold text-[18px] md:text-[30px] text-zinc-700 dark:text-zinc-200">
                                Page Not Found
                            </h2>
                        </div>
                        <div className="text-center">
                            <Link href="/" title="Go to home" className="inline-block underline underline-offset-2 font-noto_sans font-semibold text-[12px] md:text-[16px] text-zinc-700 hover:text-blue-500 dark:text-zinc-300 dark:hover:text-blue-500">
                                <div className="flex gap-x-[5px] items-center">
                                    <div>Go to home</div>
                                    <FaCaretRight size={16} className="translate-y-[2px]" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}