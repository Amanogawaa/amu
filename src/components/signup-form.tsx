import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Lock, Mail, UserRound } from "lucide-react";
import { Label } from "./ui/label";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <header className=" mx-auto flex w-full max-w-7xl items-center justify-between px-14 py-5"></header>
      <div className="mx-auto w-[350px] gap-6">
        <h1 className="mb-3 text-center text-4xl font-satoshi font-semibold text-custom_foreground">
          sign up
        </h1>
        <p className="mb-3 text-nowrap text-sm text-center font-inter text-Evergreen_Dusk font-medium">
          welcome! signup and explore all the features.
        </p>
        <form className="grid gap-4  text-cforeground">
          <div className="relative grid gap-2">
            <UserRound className="pointer-events-none  text-custom_foreground absolute inset-y-3.5 left-0 flex w-7 items-center pl-3 " />
            <Label className="sr-only" aria-hidden="true">
              Username
            </Label>
            <Input
              id="username"
              type="username"
              placeholder="username"
              required
              className="rounded-xl border placeholder:text-sm border-Winter_Teal p-6 pl-8 active:border-Winter_Teal focus:border-Winter_Teal focus:outline-none focus-visible:ring-0"
            />
          </div>

          <div className="relative grid gap-2">
            <Mail className="pointer-events-none  text-custom_foreground absolute inset-y-3.5 left-0 flex w-7 items-center pl-3 " />
            <Label className="sr-only" aria-hidden="true">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email"
              required
              className="rounded-xl border placeholder:text-sm border-Winter_Teal p-6 pl-8 active:border-Winter_Teal focus:border-Winter_Teal focus:outline-none focus-visible:ring-0"
            />
          </div>

          <div className="relative grid gap-2">
            <Lock className="pointer-events-none absolute text-caccent inset-y-3.5 left-0 flex w-7 items-center pl-3 " />
            <Label className="sr-only" aria-hidden="true">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              placeholder="password"
              className="rounded-xl border placeholder:text-sm border-Winter_Teal p-6 pl-8 active:border-Winter_Teal focus:border-Winter_Teal focus:outline-none focus-visible:ring-0"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-Evergreen_Dusk rounded-2xl cursor-pointer p-6 text-sm font-inter font-semibold text-white hover:bg-custom_foreground/80 hover:ease-in"
          >
            signup
          </Button>
        </form>
        <div className="mt-4 flex w-full items-center justify-center gap-2">
          <p className=" text-center text-sm font-montserrat">
            already have an account?
          </p>
          <Link
            to="/auth/signin"
            className="hover:underline cursor-pointer text-sm"
            aria-label="sign in for registered users"
          >
            signin
          </Link>
        </div>
      </div>
    </div>
  );
}
