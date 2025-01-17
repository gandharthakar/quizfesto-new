import Image from "next/image";
import Link from "next/link";
import ThemeSwitchUserAreaTopHeader from "./themeSwitchUserAreaTopHeader";
import UserAreaMenuToggleButton from "./userAreaMenuToggleButton";

export default function UserAreaTopHeader() {
    return (
        <div className="transition-all delay-75 flex items-center justify-between bg-white px-[15px] py-[15px] gap-x-[15px] border-b border-solid border-zinc-300 dark:bg-zinc-950 dark:border-zinc-700">
            <div className="">
                <Link href="/" title="Home">
                    <Image src="/images/quizfesto-logo-final.svg" width={130} height={27} alt="logo" priority={true} />
                </Link>
            </div>

            <div className="flex gap-x-[15px]">
                <div>
                    <ThemeSwitchUserAreaTopHeader />
                </div>
                <div className="block lg:hidden">
                    <UserAreaMenuToggleButton />
                </div>
            </div>
        </div>
    )
}