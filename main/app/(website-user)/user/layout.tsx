import type { Metadata } from "next";
// import "@/app/globals.css";
// import RedProv from "@/app/libs/redux-service/reduxProvider";
import UserAreaTopHeader from "@/app/components/userAreaTopHeader";
import UserAreaNavBar from "@/app/components/userAreaNavBar";
// import GoogleAuthSessionProvider from "@/app/libs/googleAuthSessionProvider";
// import CheckAuthUser from "@/app/libs/checkAuthUser";

export const metadata: Metadata = {
	title: "QuizFesto - User Area",
	description: "QuizeFesto is the online platform where you can participate on many quizzes created by our team and win excited prizes.",
	keywords: ["NextJS", "Quiz App"],
};

type Children = {
	children: React.ReactNode;
}

export default function RootLayout({ children, }: Readonly<Children>) {
	return (
		<div className="flex overflow-hidden">
			<UserAreaNavBar />
			<div className="transition-all delay-75 bg-zinc-100 min-h-screen flex-1 dark:bg-zinc-900">
				<UserAreaTopHeader />
				<div className="px-[15px]">
					{children}
				</div>
			</div>
		</div>
	);
}