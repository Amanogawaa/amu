import { useAppForm } from "@/hooks/use-form";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Lock, Mail } from "lucide-react";
import z from "zod";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        email: z.string().email("Please enter a valid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-14 py-5"></header>
      <div className="mx-auto w-[350px] gap-6">
        <h1 className="mb-3 text-center text-4xl font-satoshi font-semibold text-custom_foreground">
          sign up
        </h1>
        <p className="mb-3 text-nowrap text-sm text-center font-inter text-Evergreen_Dusk font-medium">
          welcome! signup and explore all the features.
        </p>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField
            name="email"
            children={(field) => (
              <field.AuthForm
                icon={Mail}
                label="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors?.[0]?.message
                    : undefined
                }
              />
            )}
          />
          <form.AppField
            name="password"
            children={(field) => (
              <field.AuthForm
                icon={Lock}
                label="password"
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors?.[0]?.message
                    : undefined
                }
              />
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <form.AuthButton
                text={isSubmitting ? "Signing up..." : "signup"}
                disabled={!canSubmit || isSubmitting}
              />
            )}
          />
        </form>
        <div className="mt-4 flex w-full items-center justify-center gap-2">
          <p className="text-center text-sm font-montserrat">
            already have an account?
          </p>
          <Link
            to="/signin"
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
