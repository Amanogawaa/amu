import GeneralLoadingPage from "@/components/states/GeneralLoadingPage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../application/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { logger } from "@/lib/loggers";
import { Eye, EyeClosed, Lock, User2, UserCircle } from "lucide-react";
import { Value } from "@radix-ui/react-select";

const LoginForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const { loading, signIn, signInWithGoogle, user } = useAuth();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!loading && user) {
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    }
  }, [user, loading, router, searchParams]);

  if (loading) {
    return <GeneralLoadingPage />;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            signIn(form.getValues("email"), form.getValues("password"));
          }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Image
                  src="/coursecraft.png"
                  width={64}
                  height={64}
                  alt="CourseCraft Logo"
                />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </Link>
            <h1 className="text-xl font-bold text-primary">
              Welcome to CourseCraft
            </h1>
            <p className="text-xs text-center">
              Don&apos;t have an account? <Link href="/signup">Sign up</Link>
            </p>
          </div>
          <div className="relative grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User2 className="w-5 h-5 absolute text-secondary left-3 top-1/2 -translate-y-1/2 p-0" />
                      <Input
                        type="email"
                        placeholder="user@gmail.com"
                        required
                        {...field}
                        className={cn(
                          "rounded-lg border border-secondary p-5 pl-10 placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary",
                        )}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="w-5 h-5 absolute text-secondary  left-3 top-1/2 -translate-y-1/2 p-0" />
                      <Input
                        placeholder="••••••••"
                        required
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className={cn(
                          "rounded-lg border border-secondary p-5 pl-10 placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary",
                        )}
                      />
                      <Button
                        type="button"
                        className="absolute hover:bg-transparent text-secondary hover:text-secondary right-3 top-1/2 -translate-y-1/2 p-0"
                        variant={"ghost"}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeClosed /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className={cn(
                "w-full cursor-pointer rounded-lg bg-primary p-5 font-inter text-sm font-semibold text-primary-foreground hover:bg-foreground/80 hover:ease-in",
              )}
              type="submit"
            >
              Sign in
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          className="w-full rounded-lg p-5 "
          onClick={async () => {
            try {
              await signInWithGoogle();
            } catch (err: any) {
              if (!err?.cancelled) {
                logger.error("Google sign-in error:", err);
              }
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Sign in with Google
        </Button>
      </div>
      <div className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our{" "}
        <Link
          href="/terms"
          target="_blank"
          className="underline hover:text-primary"
        >
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          target="_blank"
          className="underline hover:text-primary"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
