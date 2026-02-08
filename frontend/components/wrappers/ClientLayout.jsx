"use client";

import { usePathname } from "next/navigation";

export default function ClientLayout({ children, header, footer }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname?.includes("/sign-in") || pathname?.includes("/sign-up");

  return (
    <>
      {header}
      <main className="min-h-screen">{children}</main>
      {!isAuthPage && footer}
    </>     
  );
}
