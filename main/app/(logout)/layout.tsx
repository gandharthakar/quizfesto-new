import type { Metadata } from "next";
// import "@/app/globals.css";
// import RedProv from "@/app/libs/redux-service/reduxProvider";
// import CheckAuthUser from "@/app/libs/checkAuthUser";
// import GoogleAuthSessionProvider from "@/app/libs/googleAuthSessionProvider";

export const metadata: Metadata = {
	title: "QuizFesto",
	description: "QuizeFesto is the online platform where you can participate on many quizzes created by our team and win excited prizes.",
	keywords: ["NextJS", "Quiz App"],
};

type Children = {
	children: React.ReactNode;
}

export default function RootLayout({ children, }: Readonly<Children>) {
	return (
		<div>
			{children}
		</div>
	);
}