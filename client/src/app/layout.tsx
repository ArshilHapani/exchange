import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import localFont from "next/font/local";

import SessionProvider from "@/components/provider/SessionProvider";
import Navbar from "@/components/nav-bar";
import ModalProvider from "@/components/provider/ModalProvider";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cryptolink",
  description: "Just like new link but crypto",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html data-theme="light" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <Navbar />
          <ModalProvider />
          <Toaster />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
