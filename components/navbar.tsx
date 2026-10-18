"use client";

import { Briefcase, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { escapeApplescriptStringFragment } from "next/dist/next-devtools/server/launch-editor";

export default function Navbar(): JSX.Element {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="container mx-auto flex h-16 px-4 items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold text-primary"
                >
                    <Briefcase />
                    Job Tracker
                </Link>
                <div className="flex items-center gap-4">
                    {isPending ? (
                        <LoaderCircle className="mr-3 size-5 animate-spin text-primary" />
                    ) : session?.user ? (
                        <>
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    className="text-gray-700 hover:text-black"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarFallback className="bg-primary text-white">
                                            {session.user.name[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p
                                                    title={session.user.name}
                                                    className="truncate text-sm font-medium leading-none text-black"
                                                >
                                                    {session.user.name}
                                                </p>
                                                <p
                                                    title={session.user.email}
                                                    className="truncate text-xs leading-none text-muted-foreground"
                                                >
                                                    {session.user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={async () => {
                                                const result = await signOut();
                                                if(result.error)
                                                    alert("Error while signing out");
                                                else
                                                    router.push("/account/sign-in");
                                            }}
                                        >
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link href="/account/sign-in">
                                <Button
                                    variant="ghost"
                                    className="text-gray-700 hover:text-black"
                                >
                                    Log In
                                </Button>
                            </Link>

                            <Link href="/account/sign-up">
                                <Button className="hover:bg-primary/90">
                                    Start for free
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
