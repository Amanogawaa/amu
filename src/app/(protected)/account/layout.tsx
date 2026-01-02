import { Navbar } from "@/components/navigation/Navbar";
import { ProfileSidebar } from "@/features/user/presentation/components";
import type React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <section className="flex flex-col min-h-screen w-full pb-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mt-10 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                MY ACCOUNT
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Manage your profile, track progress, and adjust settings
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProfileSidebar />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </section>
    </>
  );
}
