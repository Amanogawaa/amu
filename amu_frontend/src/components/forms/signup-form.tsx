import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRound, Mail, Lock } from "lucide-react";
import { Link } from "react-router";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <header className=" mx-auto flex w-full max-w-7xl items-center justify-between px-14 py-5"></header>
      <div className="mx-auto w-[350px] gap-6">
        <h1 className="mb-3 text-center text-4xl font-inter font-semibold text-Midnight_Pine">
          sign up
        </h1>
        <p className="mb-3 text-nowrap text-base text-center font-montserrat text-Evergreen_Dusk font-medium">
          welcome! signup and explore all the features.
        </p>
        <form className="grid gap-4  text-cforeground">
          <div className="relative grid gap-2">
            <UserRound className="pointer-events-none  text-Midnight_Pine absolute inset-y-3.5 left-0 flex w-7 items-center pl-3 " />
            <Input
              id="username"
              type="username"
              placeholder="username"
              required
              className="rounded-xl border placeholder:text-base border-Winter_Teal p-6 pl-8 active:border-Winter_Teal focus:border-Winter_Teal focus:outline-none focus-visible:ring-0"
            />
          </div>

          <div className="relative grid gap-2">
            <Mail className="pointer-events-none  text-Midnight_Pine absolute inset-y-3.5 left-0 flex w-7 items-center pl-3 " />
            <Input
              id="email"
              type="email"
              placeholder="email"
              required
              className="rounded-xl border placeholder:text-base border-Winter_Teal p-6 pl-8 active:border-Winter_Teal focus:border-Winter_Teal focus:outline-none focus-visible:ring-0"
            />
          </div>

          <div className="relative grid gap-2">
            <Lock className="pointer-events-none absolute text-caccent inset-y-3.5 left-0 flex w-7 items-center pl-3 " />
            <Input
              id="password"
              type="password"
              required
              placeholder="password"
              className="rounded-xl border placeholder:text-base border-Winter_Teal p-6 pl-8 active:border-Winter_Teal focus:border-Winter_Teal focus:outline-none focus-visible:ring-0"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-Evergreen_Dusk rounded-2xl cursor-pointer p-6 text-base font-inter font-semibold text-white hover:bg-Midnight_Pine/80 hover:ease-in"
          >
            signup
          </Button>
        </form>
        <div className="mt-4 flex w-full items-center justify-center gap-2">
          <p className=" text-center text-base font-montserrat">
            already have an account?
          </p>
          <Link
            to={"/signin"}
            className="hover:underline cursor-pointer text-base"
          >
            signin
          </Link>
        </div>
      </div>
    </div>
  );
}
