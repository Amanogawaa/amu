import { Navbar } from '@/components/navigation/Navbar';
import type React from 'react';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
