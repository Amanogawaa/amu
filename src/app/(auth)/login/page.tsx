"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { login } from "./action";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";

const LoginPage = () => {
  const initialState: {
    data: object | null;
    errors: { email?: string; password?: string; general?: string } | null;
  } = { data: null, errors: null };
  const [state, formAction] = useActionState(login, initialState);
  const { pending } = useFormStatus();

  if (state.data) {
    redirect("/amu");
  }

  return (
    <section className="flex min-h-screen w-full items-center justify-center rounded-lg">
      <div className="flex max-w-4xl items-center">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto w-[350px] gap-6">
            <div className="flex flex-col gap-6">
              <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-14"></header>
              <div className="mx-auto flex w-full max-w-[350px] flex-col gap-2">
                <h1 className="text-center font-inter text-4xl font-semibold text-custom_foreground">
                  sign in
                </h1>
                <p className="text-center font-satoshi text-sm font-medium text-nowrap text-Evergreen_Dusk">
                  welcome! sign in to your account.
                </p>
              </div>
              <form action={formAction} className="grid w-full gap-4">
                <div className="relative grid gap-2">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-custom_foreground" />
                    <Label className="sr-only" aria-hidden="true">
                      Email
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={cn(
                        "rounded-xl border border-Winter_Teal p-6 pl-12 font-satoshi placeholder:text-sm focus:border-Winter_Teal focus:outline-none focus-visible:ring-0 active:border-Winter_Teal",
                        state.errors?.email && "border-red-500"
                      )}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-custom_foreground" />
                    <Label className="sr-only" aria-hidden="true">
                      Password
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      className={cn(
                        "rounded-xl border border-Winter_Teal p-6 pl-12 font-satoshi placeholder:text-sm focus:border-Winter_Teal focus:outline-none focus-visible:ring-0 active:border-Winter_Teal",
                        state.errors?.password && "border-red-500"
                      )}
                    />
                  </div>

                  <Button
                    className={cn(
                      "w-full cursor-pointer rounded-2xl bg-Evergreen_Dusk p-6 font-inter text-sm font-semibold text-white hover:bg-custom_foreground/80 hover:ease-in"
                    )}
                    type="submit"
                    disabled={pending}
                  >
                    {pending ? "..." : "sign in"}{" "}
                  </Button>

                  <div className="mt-2.5 flex w-full items-center justify-center gap-2">
                    <p className="text-center font-satoshi text-sm">
                      don&apos;t have an account?
                    </p>
                    <Link
                      href={"signup"}
                      className="cursor-pointer font-satoshi text-sm hover:underline"
                      aria-label="sign in for registered users"
                    >
                      sign up
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
