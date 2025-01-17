import UserAreaSettingsTabs from "@/app/components/userAreaSettingsTabs";
// import "@/app/globals.css";
// import RedProv from "@/app/libs/redux-service/reduxProvider";
// import GoogleAuthSessionProvider from "@/app/libs/googleAuthSessionProvider";
// import CheckAuthUser from "@/app/libs/checkAuthUser";

type Children = {
    children: React.ReactNode;
}

export default function RootLayout({ children, }: Readonly<Children>) {
    return (
        <div>
            <div className="py-[25px]">
                <div className="flex flex-col lg:flex-row gap-x-[25px]">
                    <UserAreaSettingsTabs />
                    <div className="w-full lg:flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}