"use client";

import { usePathname } from "next/navigation";

export default function ClientLayout({ children, header, footer }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            {header}
            <main className="min-h-screen">{children}</main>
            {footer}
        </>
    );
}
