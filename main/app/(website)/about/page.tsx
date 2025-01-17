import Image from "next/image";
import { dump_event_timeline, dump_team_members } from "@/app/constant/datafaker";

export default function page() {
    return (
        <>
            <section className="transition-all delay-75 py-[100px] md:py-[150px] px-[15px] bg-white dark:bg-zinc-950">
                <div className="site-container">
                    <div className="flex flex-col lg:flex-row concard p-[4px]">
                        <div className="w-full md:flex-1 relative">
                            <Image src="/images/about-feimg.jpg" width={1200} height={800} className="block lg:hidden w-full h-auto" alt="photo" />
                            <div className="hidden lg:block absolute left-0 top-0 w-full h-full bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url('/images/about-feimg.jpg')` }}></div>
                        </div>
                        <div className="w-full md:flex-1 bg-white py-[20px] md:py-[25px] px-[15px] md:px-[30px] dark:bg-zinc-800">
                            <div className="pb-[10px]">
                                <h1 className="transition-all delay-75 font-noto_sans text-[25px] md:text-[30px] text-zinc-800 font-bold dark:text-zinc-200">
                                    About Us
                                </h1>
                            </div>
                            <div className="about-content-1">
                                <p>
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam molestiae consectetur quos sequi illum, quo modi non possimus alias eum ullam natus tempore hic tenetur doloremque similique? Voluptate nihil adipisci labore cumque, provident officiis amet exercitationem itaque autem, praesentium eligendi consectetur ut ipsam architecto modi molestias vel perspiciatis voluptas quisquam!
                                </p>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum eius modi aperiam odio voluptate explicabo aliquam? Expedita minima obcaecati sunt eius omnis vitae enim quibusdam necessitatibus magnam iure, reprehenderit rerum aliquid accusamus eos molestiae molestias, ea inventore esse perferendis neque voluptates nostrum? A itaque ut ipsa quae incidunt eligendi? Ut eos eum adipisci reiciendis, assumenda repellat magni, aspernatur ipsam quae vitae labore reprehenderit ipsa beatae mollitia libero commodi incidunt molestias earum similique provident impedit. Minima quo aliquid blanditiis, nemo rem vel ipsa repudiandae sequi fugit consectetur ad dolor! Nemo, aperiam aspernatur iure nostrum eos consequatur vero voluptatibus tenetur quos magni.
                                </p>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, nisi. Tempore, corporis ea ipsum iure omnis vitae tenetur recusandae impedit.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="transition-all delay-75 py-[50px] md:py-[100px] px-[15px] bg-zinc-100 dark:bg-zinc-900">
                <div className="site-container">
                    <div className="pb-[25px] md:pb-[50px]">
                        <div className="text-center">
                            <h3 className="transition-all delay-75 font-noto_sans text-[25px] md:text-[30px] text-zinc-800 font-semibold dark:text-zinc-200">
                                Our Event Timeline
                            </h3>
                        </div>
                    </div>

                    <div className="max-w-[280px] md:max-w-[400px] mx-auto">
                        <ul className="">
                            {
                                dump_event_timeline.map((item) => (
                                    <li key={item.id} className="relative flex items-baseline gap-6 pb-6 last:pb-0 min-w-[280px] md:min-w-[400px]">
                                        <div className="transition-all delay-75 before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-theme-color-1 before:dark:bg-theme-color-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="transition-all delay-75 bi bi-circle-fill fill-theme-color-1 dark:fill-theme-color-2" viewBox="0 0 16 16">
                                                <circle cx="8" cy="8" r="8" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="transition-all block my-0 delay-75 font-ubuntu text-[18px] md:text-[20px] font-semibold text-zinc-800 dark:text-zinc-200">
                                                {item.event_year}
                                            </p>
                                            <p className="transition-all block my-0 delay-75 font-ubuntu text-[14px] md:text-[16px] font-normal text-zinc-800 dark:text-zinc-200">
                                                {item.event_description}
                                            </p>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </section>

            <section className="transition-all delay-75 py-[50px] md:py-[100px] px-[15px] bg-zinc-200 dark:bg-zinc-800">
                <div className="site-container">
                    <div className="pb-[25px] md:pb-[50px]">
                        <div className="pb-[10px] text-center">
                            <h3 className="transition-all delay-75 font-noto_sans text-[25px] md:text-[30px] text-zinc-800 font-semibold dark:text-zinc-200">
                                Our Team Members & Directors
                            </h3>
                        </div>
                        <div className="max-w-[500px] mx-auto text-center">
                            <p className="transition-all delay-75 font-noto_sans text-[16px] md:text-[18px] text-zinc-800 font-normal dark:text-zinc-300">
                                We have dedicated team members who worked very hard to keep our company growing and profitable.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                        {
                            dump_team_members.map((item) => (
                                <div key={item.id} className="concard transition-all delay-75 p-[4px]">
                                    <Image src={item.team_member_photo} width={500} height={500} className="w-full h-auto" alt="photo" />
                                    <div className="px-[15px] md:px-[25px] py-[10px] md:py-[20px]">
                                        <div className="pb-[0px]">
                                            <h3 className="transition-all delay-75 text-white font-semibold text-[18px] md:text-[20px]">
                                                {item.team_member_name}
                                            </h3>
                                        </div>
                                        <div>
                                            <p className="transition-all delay-75 text-white font-normal text-[14px] md:text-[16px]">
                                                {item.team_designation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        </>
    )
}