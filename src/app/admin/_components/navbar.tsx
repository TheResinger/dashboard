"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveRoute = "font-semibold text-primary";
const InactiveRoute = "";

export default function NavBar() {
  const pathName = usePathname();

  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground"
      x-chunk="dashboard-04-chunk-0"
    >
      <Link
        href="/admin"
        className={pathName === "/admin" ? ActiveRoute : InactiveRoute}
      >
        General
      </Link>
      <Link
        href="/admin/debug"
        className={pathName === "/admin/debug" ? ActiveRoute : InactiveRoute}
      >
        Debug
      </Link>
      <Link href="#">Integrations</Link>
      <Link href="#">Support</Link>
      <Link href="#">Organizations</Link>
      <Link href="#">Advanced</Link>
    </nav>
  );
}
