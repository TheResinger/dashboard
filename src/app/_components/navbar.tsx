"use client"

import { CircleUser, Menu, Package2, Search } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const activeRoute = "text-foreground hover:text-foreground transition-colors";
const inactiveRoute = "text-muted-foreground hover:text-foreground transition-colors";


export default function NavBar() {

    const { setTheme } = useTheme();

    const { data: session } = useSession();
    const pathName = usePathname();

    let trunacatedName = ""


    if (session) {
        let tempNameArray = session!.user!.name!.split(" ");
        let firstInitial = tempNameArray[0]![0]!.toUpperCase();
        let lastInitial = tempNameArray[tempNameArray.length - 1]![0]!.toUpperCase();
        trunacatedName = `${firstInitial}${lastInitial}`;
    }

    return (
        <header className="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                    href="/"
                    className={pathName === "/" ? activeRoute : inactiveRoute}
                >
                    Dashboard
                </Link>
                {session?.user.roles == "DashboardAdmin" ? <Link href={'/admin'} className={pathName === "/admin" ? activeRoute : inactiveRoute}>Admin</Link> : <></>}
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link
                            href="/"
                            className={pathName === "/" ? activeRoute : inactiveRoute}
                        >
                            Dashboard
                        </Link>
                        {session?.user.roles == "DashboardAdmin" ? <Link href={'/admin'} className={pathName === "/admin" ? activeRoute : inactiveRoute}>Admin</Link> : <></>}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative">
                        <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                        />
                    </div>
                </form>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {/* <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button> */}
                        <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src={session?.user.image ?? ""} alt="Avatar" />
                            <AvatarFallback>{trunacatedName ?? ""}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Mode Toggler</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark Mode</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("light")}>Light Mode</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Link href={"/api/auth/signout"} >Logout</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
