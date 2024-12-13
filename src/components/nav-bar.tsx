"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavBar() {
  const session = useSession();
  return (
    <div className="fixed top-0 w-full bg-white/30 bg-blur-lg">
      <nav className="flex items-center justify-between p-4 max-w-7xl h-[80px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-blue-500">
            CryptoLink
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="space-x-4">
            {!session.data ? (
              <Button
                onClick={() => signIn("google")}
                variant="outline"
                size="sm"
              >
                Sign in with google
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  tabIndex={-1}
                  className="focus:outline-none"
                >
                  <div className="flex items-center focus:outline-none space-x-4">
                    <h1 className="text-gray-400 text-right font-bold">
                      Hello, <br />{" "}
                      <span className="text-gray-600">
                        {" "}
                        {session?.data?.user?.name ?? "user"}!{" "}
                      </span>
                    </h1>
                    <Image
                      src={session?.data?.user?.image ?? ""}
                      alt="user image"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <h1 className="text-destructive">sign out</h1>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
