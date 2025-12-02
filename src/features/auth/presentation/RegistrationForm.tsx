import GeneralLoadingPage from '@/components/states/GeneralLoadingPage';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { logger } from '@/lib/loggers';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Eye,
  EyeClosed,
  GraduationCap,
  Lock,
  Mail,
  User,
  User2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../application/AuthContext';

const RegistrationForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const { loading, signUp, user, signInWithGoogle } = useAuth();

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      program: '',
      yearLevel: '',
    },
  });

  useEffect(() => {
    if (!loading && user) {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    }
  }, [user, loading, router, searchParams]);

  const handleSignUp = () => {
    if (!pendingFormData) return;

    signUp(pendingFormData.email, pendingFormData.password, {
      firstName: pendingFormData.firstName,
      lastName: pendingFormData.lastName,
      program: pendingFormData.program,
      yearLevel: pendingFormData.yearLevel,
    });

    setShowTermsDialog(false);
    setAgreedToTerms(false);
    setPendingFormData(null);
  };

  if (loading) {
    return <GeneralLoadingPage />;
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Form {...form}>
        <form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = form.getValues();

            // Validate form
            if (
              !formData.firstName ||
              !formData.lastName ||
              !formData.email ||
              !formData.password
            ) {
              return;
            }

            // Store form data and show terms dialog
            setPendingFormData(formData);
            setShowTermsDialog(true);
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
              <h1 className="sr-only">Acme Inc.</h1>
            </Link>
            <h1 className="text-xl font-bold text-primary">
              Welcome to CourseCraft
            </h1>
            <p className="text-xs text-center">
              Already have an account? <Link href={'/signin'}>Sign in</Link>
            </p>
          </div>
          <div className="relative grid gap-4 ">
            <div className="grid gap-2 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Juan"
                          required
                          {...field}
                          className={cn(
                            'rounded-lg border border-secondary p-5 pl-10 font-satoshi placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary'
                          )}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Dela Cruz"
                          required
                          {...field}
                          className={cn(
                            'rounded-lg border border-secondary p-5 pl-10 font-satoshi placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary'
                          )}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger
                            className={cn(
                              'rounded-lg w-full border border-secondary p-5 pl-10 font-satoshi focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary'
                            )}
                          >
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Computer Science">
                              Computer Science
                            </SelectItem>
                            <SelectItem value="Information Technology">
                              Information Technology
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Level</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger
                            className={cn(
                              'rounded-lg border  w-full border-secondary p-5 pl-10 font-satoshi focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary'
                            )}
                          >
                            <SelectValue placeholder="Select year level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1st Year">1st Year</SelectItem>
                            <SelectItem value="2nd Year">2nd Year</SelectItem>
                            <SelectItem value="3rd Year">3rd Year</SelectItem>
                            <SelectItem value="4th Year">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="user@gmail.com"
                        required
                        {...field}
                        className={cn(
                          'rounded-lg border border-secondary p-5 pl-10 font-satoshi placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary'
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
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="••••••••"
                        required
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        className={cn(
                          'rounded-lg border border-secondary p-5 pl-10 font-satoshi placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary'
                        )}
                      />
                      <Button
                        type="button"
                        className="absolute hover:bg-transparent text-secondary hover:text-secondary right-3 top-1/2 -translate-y-1/2 p-0"
                        variant={'ghost'}
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
                'w-full cursor-pointer rounded-lg bg-primary p-5 font-inter text-sm font-semibold text-primary-foreground hover:bg-foreground/80 hover:ease-in'
              )}
              type="submit"
            >
              Sign up
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
                logger.error('Google sign-in error:', err);
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
          Sign up with Google
        </Button>
      </div>
      <div className="text-center text-xs text-muted-foreground">
        By signing up, you agree to our{' '}
        <Link
          href="/terms"
          target="_blank"
          className="underline hover:text-primary"
        >
          Terms & Conditions
        </Link>{' '}
        and{' '}
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
              onClick={handleSignUp}
              disabled={!agreedToTerms}
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
