import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/style/index.css";
import {authUserInfo} from "@/actions/auth";

/**
 * 类似于vue的 index.html + main.js
 */
const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuth = await authUserInfo()
  console.log('isAuth',isAuth)
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
