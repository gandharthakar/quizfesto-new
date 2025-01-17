import type { Metadata } from "next";
// import "@/app/globals.css";
// import RedProv from "@/app/libs/redux-service/reduxProvider";

export const metadata: Metadata = {
	title: "QuizFesto - Quiz Playground.",
	description: "QuizeFesto is the online platform where you can participate on many quizzes created by our team and win excited prizes.",
	keywords: ["NextJS", "Quiz App"],
};

type Children = {
	children: React.ReactNode;
}

export default function RootLayout({ children, }: Readonly<Children>) {
	return (
		<div>{children}</div>
	)
}