"use client";

import { signIn, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  const session = useSession();
  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
        The crypto of tomorrow, <span className="text-blue-500">today</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Create a frictionless wallet with just a Google Account.
      </p>
      {session.data ? (
        <Link href="/exchange">
          <Button size="lg">Exchange</Button>
        </Link>
      ) : (
        <Button onClick={() => signIn("google")} size="lg" className="gap-2">
          Sign Up with Google
        </Button>
      )}
    </div>
  );
}
