'use client';

import Footer from '@/components/navigation/Footer';
import { Navbar } from '@/components/navigation/Navbar';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isCourseDetail =
    typeof pathname === 'string' && /^\/my-learning\/[^/]+/.test(pathname);

  return (
    <>
      <Navbar smartHide={isCourseDetail} />
      {children}
    </>
  );
}
