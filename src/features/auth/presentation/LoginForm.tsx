import { Button } from "@/src/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Lock, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const LoginForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.set("email", values.email);
    formData.set("password", values.password);
    formData.set("flow", "signIn");

    setLoading(true);

    void signIn("password", formData)
      .catch((err) => {
        setError("Invalid email or password");
        setLoading(false);
      })
      .then(() => {
        router.push("/");
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(formSubmit)}
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
            Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
          </p>
        </div>
        <div>
          <FieldGroup className="relative grid gap-5">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email" className="sr-only">
                    Email
                  </FieldLabel>
                  <div className="relative">
                    <User2 className="w-5 h-5 absolute text-secondary left-3 top-1/2 -translate-y-1/2 p-0" />
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="shanak.0@gmail.com"
                      autoComplete="off"
                      {...field}
                      className={cn(
                        "rounded-lg border border-secondary p-5 pl-10 placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary",
                      )}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password" className="sr-only">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute text-secondary  left-3 top-1/2 -translate-y-1/2 p-0" />
                    <Input
                      {...field}
                      id="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      autoComplete="off"
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
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
          </FieldGroup>
        </div>
      </form>

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
