import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../application/AuthContext';
import { cn } from '@/lib/utils';
import GeneralLoadingPage from '@/components/states/GeneralLoadingPage';
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { GalleryVerticalEnd, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const RegistrationForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { loading, signUp, user, signInWithGoogle } = useAuth();

  if (user) {
    redirect('/');
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {loading ? (
        <GeneralLoadingPage />
      ) : (
        <>
          <Form {...form}>
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
                signUp(form.getValues('email'), form.getValues('password'));
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
                      src="/amu.png"
                      width={64}
                      height={64}
                      alt="Amu Logo"
                    />
                  </div>
                  <h1 className="sr-only">Acme Inc.</h1>
                </Link>
                <h1 className="text-xl font-bold text-primary">
                  Welcome to Amu AI
                </h1>
                <p className="text-xs text-center">
                  Already have an account? <Link href={'/signin'}>Sign in</Link>
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
                        <Input
                          type="email"
                          placeholder="user@gmail.com"
                          required
                          {...field}
                          className={cn(
                            'rounded-lg border border-secondary p-5 font-satoshi placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary'
                          )}
                        />
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
                        <Input
                          type="password"
                          placeholder="••••••••"
                          required
                          {...field}
                          className={cn(
                            'rounded-lg border border-secondary p-5 font-satoshi placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary'
                          )}
                        />
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
            {/* <Button variant="outline" className="w-full" onClick={() => handleOAuthSignIn('facebook')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                </svg>
                Login with Facebook
              </Button> */}
            <Button
              variant="outline"
              className="w-full rounded-lg p-5 "
              onClick={async () => {
                try {
                  await signInWithGoogle();
                } catch (err: any) {
                  if (!err?.cancelled) {
                    console.error('Google sign-in error:', err);
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
        </>
      )}
    </div>
  );
};

export default RegistrationForm;
