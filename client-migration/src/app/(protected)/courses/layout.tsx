"use client";

import Footer from "@/components/navigation/Footer";
import { Navbar } from "@/components/navigation/Navbar";
import { usePathname } from "next/navigation";
import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // Hide navbar on lesson pages
  const isLessonPage = pathname?.includes("/lessons/");

  return (
    <>
      {!isLessonPage && <Navbar />}
      {children}
    </>
  );
}
