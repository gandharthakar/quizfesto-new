// import type { Metadata } from "next";
import "@/app/globals.css";
import RedProv from "@/app/libs/redux-service/reduxProvider";
import CheckAuthUser from "@/app/libs/checkAuthUser";
import GoogleAuthSessionProvider from "@/app/libs/googleAuthSessionProvider";
import TSQProvider from "@/app/libs/tanstack-query/tansQueryProvider";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
							<TSQProvider>
								<ReactQueryDevtools initialIsOpen={false} />
								{children}
							</TSQProvider>
						</CheckAuthUser>
					</RedProv>
				</GoogleAuthSessionProvider>
			</body>
		</html>
	);
}