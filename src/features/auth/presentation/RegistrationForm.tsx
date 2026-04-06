import { Button } from "@/src/components/ui/button";

import GeneralLoadingPage from "@/src/components/states/GeneralLoadingPage";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { Eye, EyeClosed, GraduationCap, Lock, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const RegistrationForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthActions();

  const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    program: z.string().min(1, "Program is required"),
    yearLevel: z.string().min(1, "Year level is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      program: "",
      yearLevel: "",
    },
  });

  const formSubmit = (values: z.infer<typeof formSchema>) => {
    setPendingFormData(values);
    setShowTermsDialog(true);
  };

  const handleAcceptTerms = () => {
    if (!pendingFormData) return;

    setLoading(true);
    setError(null);
    setShowTermsDialog(false);

    const formData = new FormData();

    formData.set("firstName", pendingFormData.firstName);
    formData.set("lastName", pendingFormData.lastName);
    formData.set("email", pendingFormData.email);
    formData.set("password", pendingFormData.password);
    formData.set("program", pendingFormData.program);
    formData.set("yearLevel", pendingFormData.yearLevel);
    formData.set("flow", "signUp");

    void signIn("password", formData)
      .catch((err) => {
        setError("Failed to create account. Please try again.");
        setLoading(false);
      })
      .then(() => {
        router.push("/");
      });
  };

  if (loading) {
    return <GeneralLoadingPage />;
  }

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
            <h1 className="sr-only">Acme Inc.</h1>
          </Link>
          <h1 className="text-xl font-bold text-primary">
            Welcome to CourseCraft
          </h1>
          <p className="text-xs text-center">
            Already have an account? <Link href={"/sign-in"}>Sign in</Link>
          </p>
        </div>
        <FieldGroup className="relative grid gap-4 ">
          <div className="grid gap-2 sm:grid-cols-2">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="firstName" className="sr-only">
                    First Name
                  </FieldLabel>
                  <div className="relative">
                    <User2 className="w-5 h-5 absolute text-secondary left-3 top-1/2 -translate-y-1/2 p-0" />
                    <Input
                      {...field}
                      id="firstName"
                      aria-invalid={fieldState.invalid}
                      placeholder="First Name"
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
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lastName" className="sr-only">
                    Last Name
                  </FieldLabel>
                  <div className="relative">
                    <User2 className="w-5 h-5 absolute text-secondary left-3 top-1/2 -translate-y-1/2 p-0" />
                    <Input
                      {...field}
                      id="lastName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Last Name"
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
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Controller
              name="program"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="program" className="sr-only">
                    Program
                  </FieldLabel>

                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={cn(
                          "rounded-lg w-full border border-secondary p-5 pl-10 font-satoshi focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary flex items-center",
                        )}
                      >
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        <SelectItem
                          value="Computer Science"
                          className="rounded-none"
                        >
                          Computer Science
                        </SelectItem>
                        <SelectItem
                          value="Information Technology"
                          className="rounded-none"
                        >
                          Information Technology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Field>
              )}
            />
            <Controller
              name="yearLevel"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="yearLevel" className="sr-only">
                    Year Level
                  </FieldLabel>

                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={cn(
                          "rounded-lg w-full border border-secondary p-5 pl-10 font-satoshi focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary flex items-center",
                        )}
                      >
                        <SelectValue placeholder="Select year level" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        <SelectItem value="1st Year" className="rounded-none">
                          1st Year
                        </SelectItem>
                        <SelectItem value="2nd Year" className="rounded-none">
                          2nd Year
                        </SelectItem>
                        <SelectItem value="3rd Year" className="rounded-none">
                          3rd Year
                        </SelectItem>
                        <SelectItem value="4th Year" className="rounded-none">
                          4th Year
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Field>
              )}
            />
          </div>

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
            Sign up
          </Button>
        </FieldGroup>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        By signing up, you agree to our{" "}
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

      {/* Terms and Conditions Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Terms and Conditions
            </DialogTitle>
            <DialogDescription>
              Please read and agree to our terms and conditions before creating
              your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">
                1. Acceptance of Terms
              </h3>
              <p className="text-muted-foreground">
                By accessing and using CourseCraft, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">
                2. Use of Service
              </h3>
              <p className="text-muted-foreground">
                CourseCraft provides an AI-powered learning management system.
                You agree to use this service for lawful purposes only and in a
                way that does not infringe the rights of others or restrict
                their use and enjoyment of the service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. User Accounts</h3>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You agree to notify us immediately of any unauthorized
                use of your account.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">
                4. Intellectual Property
              </h3>
              <p className="text-muted-foreground">
                All content, features, and functionality of CourseCraft are and
                will remain the exclusive property of CourseCraft and its
                licensors. You may not reproduce, distribute, or create
                derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. Privacy</h3>
              <p className="text-muted-foreground">
                Your use of CourseCraft is also governed by our Privacy Policy.
                Please review our Privacy Policy to understand our practices
                regarding your personal information.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">
                6. User-Generated Content
              </h3>
              <p className="text-muted-foreground">
                You retain all rights to the content you create and upload to
                CourseCraft. By uploading content, you grant us a license to
                use, display, and distribute your content within the platform.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">
                7. Limitation of Liability
              </h3>
              <p className="text-muted-foreground">
                CourseCraft shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use of or inability to use the service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">
                8. Changes to Terms
              </h3>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. We will
                notify users of any material changes. Your continued use of the
                service after such modifications constitutes your acceptance of
                the updated terms.
              </p>
            </section>
          </div>

          <div className="flex items-center space-x-2 py-4 border-t">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked: boolean) => setAgreedToTerms(checked)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and agree to the Terms and Conditions and Privacy
              Policy
            </label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowTermsDialog(false);
                setAgreedToTerms(false);
                setPendingFormData(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!agreedToTerms}
              onClick={handleAcceptTerms}
              className="bg-primary hover:bg-primary/90"
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationForm;
