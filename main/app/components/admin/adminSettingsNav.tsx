'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { JWTDecAdmin } from "@/app/types/commonTypes";

function AdminSettingsNav() {

    const pathName = usePathname();
    // const params = useParams();
    // const auid = params.userid;
    const [auid, setAuid] = useState<string>("");

    useEffect(() => {

        const gtco = getCookie("is_admin_user");
        let admin_id: JWTDecAdmin = {
            is_admin_user: '',
            exp: 0,
            iat: 0
        };
        if (gtco) {
            admin_id = jwtDecode(gtco);
            setAuid(admin_id.is_admin_user);
        }

    }, []);

    return (
        <div className="max-w-[calc(100vw-40px)] overflow-x-auto">
            <ul className="admin-settings-nav">
                <li>
                    <Link
                        href={`/admin/settings/${auid}`}
                        title="General"
                        className={`nav-item ${pathName === `/admin/settings/${auid}` ? 'active' : ''}`}
                    >
                        General
                    </Link>
                </li>
                <li>
                    <Link
                        href={`/admin/settings/password/${auid}`}
                        title="Password"
                        className={`nav-item ${pathName === `/admin/settings/password/${auid}` ? 'active' : ''}`}
                    >
                        Password
                    </Link>
                </li>
                <li>
                    <Link
                        href={`/admin/settings/phone/${auid}`}
                        title="Phone"
                        className={`nav-item ${pathName === `/admin/settings/phone/${auid}` ? 'active' : ''}`}
                    >
                        Phone
                    </Link>
                </li>
                <li>
                    <Link
                        href={`/admin/settings/change-photo/${auid}`}
                        title="Change Photo"
                        className={`nav-item ${pathName === `/admin/settings/change-photo/${auid}` ? 'active' : ''}`}
                    >
                        Change Photo
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default AdminSettingsNav;