'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaFacebook } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { BsWhatsapp } from "react-icons/bs";
import { GrInstagram } from "react-icons/gr";
import SiteLogo from "@/public//images/quizfesto-logo-final.svg";

export default function Footer() {

    const pathname = usePathname();

    return (
        <>
            <footer className="transition-all delay-75 py-[50px] px-[15px] bg-white dark:bg-zinc-950">
                <div className="flex items-start flex-col md:flex-row justify-between gap-y-[20px] gap-x-[20px]">
                    <div className="w-full md:w-auto">
                        <div>
                            <Link href="/" title="QuizFesto Home" as="image">
                                <Image
                                    // src="/images/quizfesto-logo-final.svg"
                                    src={SiteLogo}
                                    alt="logo"
                                    width={180}
                                    // height={80}
                                    className="w-[135px] h-auto menu-ms-1:w-[180px]"
                                // loading="lazy"
                                // style={{ height: "auto" }}
                                />
                            </Link>
                        </div>
                        <div className="hidden md:block pt-[5px]">
                            <p className="transition-all delay-75 font-ubuntu text-zinc-800 text-[14px] dark:text-zinc-400">
                                &copy; {new Date().getFullYear()} All Rights Reserved.
                            </p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <div className="flex gap-x-[100px] gap-y-[10px] flex-wrap">
                            <div>
                                <ul className="footer-navs">
                                    <li className="last:pb-0 pb-[10px]">
                                        <Link href="/about" title="About" className={`transition-all delay-75 font-noto_sans text-[16px] font-semibold text-zinc-800 hover:text-theme-color-2 dark:text-zinc-200 dark:hover:text-theme-color-2 ${pathname === '/about' ? 'active' : ''}`}>
                                            About
                                        </Link>
                                    </li>
                                    <li className="last:pb-0 pb-[10px]">
                                        <Link href="/all-quizzes" title="All Quizzes" className={`transition-all delay-75 font-noto_sans text-[16px] font-semibold text-zinc-800 hover:text-theme-color-2 dark:text-zinc-200 dark:hover:text-theme-color-2 ${pathname === '/all-quizzes' ? 'active' : ''}`}>
                                            All Quizzes
                                        </Link>
                                    </li>
                                    <li className="last:pb-0 pb-[10px]">
                                        <Link href="/winners" title="Winners" className={`transition-all delay-75 font-noto_sans text-[16px] font-semibold text-zinc-800 hover:text-theme-color-2 dark:text-zinc-200 dark:hover:text-theme-color-2 ${pathname === '/winners' ? 'active' : ''}`}>
                                            Winners
                                        </Link>
                                    </li>
                                    <li className="last:pb-0 pb-[10px]">
                                        <Link href="/contact" title="Contact Us" className={`transition-all delay-75 font-noto_sans text-[16px] font-semibold text-zinc-800 hover:text-theme-color-2 dark:text-zinc-200 dark:hover:text-theme-color-2 ${pathname === '/contact' ? 'active' : ''}`}>
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul className="footer-navs">
                                    <li className="last:pb-0 pb-[10px]">
                                        <Link href="/faqs" title="Terms & Conditions" className={`transition-all delay-75 font-noto_sans text-[16px] font-semibold text-zinc-800 hover:text-theme-color-2 dark:text-zinc-200 dark:hover:text-theme-color-2 ${pathname === '/faqs' ? 'active' : ''}`}>
                                            FAQs
                                        </Link>
                                    </li>
                                    <li className="last:pb-0 pb-[10px]">
                                        <Link href="/terms" title="Terms & Conditions" className={`transition-all delay-75 font-noto_sans text-[16px] font-semibold text-zinc-800 hover:text-theme-color-2 dark:text-zinc-200 dark:hover:text-theme-color-2 ${pathname === '/terms' ? 'active' : ''}`}>
                                            Terms & Conditions
                                        </Link>
                                    </li>
                                    <li className="last:pb-0 pb-[10px]">
                                        <Link href="/privacy" title="Privacy Policy" className={`transition-all delay-75 font-noto_sans text-[16px] font-semibold text-zinc-800 hover:text-theme-color-2 dark:text-zinc-200 dark:hover:text-theme-color-2 ${pathname === '/privacy' ? 'active' : ''}`}>
                                            Privacy Policy
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <div className="pb-[10px] pt-[10px] md:pt-[0px]">
                                    <h6 className="transition-all delay-75 font-ubuntu font-bold text-[18px] md:text-[20px] text-zinc-800 dark:text-zinc-200">
                                        Social Network
                                    </h6>
                                </div>

                                <ul className="flex flex-wrap gap-x-[20px] md:gap-x-[20px] gap-y-[10px]">
                                    <li>
                                        <Link href="#" title="Follow us on Facebook" target="_blank">
                                            <FaFacebook size={30} className="transition-all delay-75 text-zinc-800 dark:text-zinc-200 w-[30px] h-[30px] md:w-[30px] md:h-[30px] hover:text-theme-color-2 dark:hover:text-theme-color-2" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" title="Follow us on Twitter" target="_blank">
                                            <BsTwitterX size={30} className="transition-all delay-75 text-zinc-800 dark:text-zinc-200 w-[30px] h-[30px] md:w-[30px] md:h-[30px] hover:text-theme-color-2 dark:hover:text-theme-color-2" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" title="Chat with us on WhatsApp" target="_blank">
                                            <BsWhatsapp size={30} className="transition-all delay-75 text-zinc-800 dark:text-zinc-200 w-[30px] h-[30px] md:w-[30px] md:h-[30px] hover:text-theme-color-2 dark:hover:text-theme-color-2" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" title="Follow us on Instagram" target="_blank">
                                            <GrInstagram size={30} className="transition-all delay-75 text-zinc-800 dark:text-zinc-200 w-[30px] h-[30px] md:w-[30px] md:h-[30px] hover:text-theme-color-2 dark:hover:text-theme-color-2" />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-[30px] block md:hidden">
                    <div className="transition-all delay-75 border-t border-solid border-zinc-400 pt-[10px]">
                        <p className="transition-all delay-75 font-ubuntu text-zinc-800 text-[14px] dark:text-zinc-400">
                            &copy; {new Date().getFullYear()} All Rights Reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    )
}