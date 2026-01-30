"use client";

export default function ClientLayout({ children, header, footer }) {


    return (
        <>
            {header}
            <main className="min-h-screen">{children}</main>
            {footer}
        </>
    );
}
