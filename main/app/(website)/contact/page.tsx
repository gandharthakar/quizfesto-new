import { TfiEmail } from "react-icons/tfi";
import { MdOutlineHeadphones } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";

export default function Page() {
    return (
        <>
            <div className="transition-all delay-75 relative px-[15px] py-[100px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <div className="w-[400px] h-[400px] absolute left-[1%] top-[50%] bg-theme-color-1 blur-[70px] opacity-[0.1] dark:opacity-[0.1] z-[1] rounded-full translate-y-[-50%]"></div>
                <div className="w-[600px] h-[600px] absolute left-[20%] top-[50%] bg-theme-color-2 blur-[70px] opacity-[0.1] dark:opacity-[0.1] z-[1] rounded-full translate-y-[-50%]"></div>

                <div className="site-container relative z-[10]">
                    <div className="lg:min-h-[calc(100vh-200px)] flex items-start lg:items-center lg:justify-between gap-x-[50px] gap-y-[20px] flex-col lg:flex-row">
                        <div className="w-full lg:flex-1">
                            <h1 className="transition-all delay-75 font-ubuntu text-[25px] md:text-[50px] text-zinc-800 font-bold dark:text-zinc-200">
                                {`Let's Talk!`}
                            </h1>
                        </div>

                        <div className="w-full lg:flex-1">
                            <div className="last:pb-0 pb-[20px]">
                                <div className="concard transition-all delay-75 border-[2px] border-white py-[20px] md:py-[25px] px-[15px] md:px-[30px]">
                                    <div className="pb-[10px]">
                                        <TfiEmail size={20} className="w-[35px] h-[35px] text-white" />
                                    </div>
                                    <div className="pb-[10px]">
                                        <h2 className="transition-all delay-75 font-ubuntu font-semibold text-[20px] md:text-[25px] text-white">
                                            Email
                                        </h2>
                                    </div>
                                    <div>
                                        <p className="transition-all delay-75 font-ubuntu font-normal text-[16px] md:text-[18px] text-white">
                                            info@quizfesto.com <br />
                                            support@quizfesto.com <br />
                                            contact@quizfesto.com 
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="last:pb-0 pb-[20px]">
                                <div className="concard transition-all delay-75 border-[2px] border-white py-[20px] md:py-[25px] px-[15px] md:px-[30px]">
                                    <div className="pb-[10px]">
                                        <MdOutlineHeadphones size={20} className="w-[35px] h-[35px] text-white" />
                                    </div>
                                    <div className="pb-[10px]">
                                        <h2 className="transition-all delay-75 font-ubuntu font-semibold text-[20px] md:text-[25px] text-white">
                                            Contact
                                        </h2>
                                    </div>
                                    <div>
                                        <p className="transition-all delay-75 font-ubuntu font-normal text-[16px] md:text-[18px] text-white">
                                            +91 1234567890 <br />
                                            +1 120-000-555
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="last:pb-0 pb-[20px]">
                                <div className="concard transition-all delay-75 border-[2px] border-white py-[20px] md:py-[25px] px-[15px] md:px-[30px]">
                                    <div className="pb-[10px]">
                                        <MdOutlineLocationOn size={20} className="w-[35px] h-[35px] text-white" />
                                    </div>
                                    <div className="pb-[10px]">
                                        <h2 className="transition-all delay-75 font-ubuntu font-semibold text-[20px] md:text-[25px] text-white">
                                            Head Office
                                        </h2>
                                    </div>
                                    <div>
                                        <p className="transition-all delay-75 font-ubuntu font-normal text-[16px] md:text-[18px] text-white">
                                            25 Feet Street, 2nd Floor, <br />
                                            Cambridge, MA 02141 <br />
                                            United Status
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}