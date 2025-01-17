// import type { Metadata } from "next";
import "@/app/globals.css";
import RedProv from "@/app/libs/redux-service/reduxProvider";
import CheckAuthUser from "@/app/libs/checkAuthUser";
import GoogleAuthSessionProvider from "@/app/libs/googleAuthSessionProvider";

type Children = {
	children: React.ReactNode;
}

export default function RootLayout({ children, }: Readonly<Children>) {
	return (
		<html lang="en" className="">
			<body className="">
				<GoogleAuthSessionProvider>
					<RedProv>
						<CheckAuthUser>
							{children}
						</CheckAuthUser>
					</RedProv>
				</GoogleAuthSessionProvider>
			</body>
		</html>
	);
}