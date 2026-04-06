"use client";
import LoginForm from "@/src/features/auth/presentation/LoginForm";

export default function SignIn() {
  return (
    <>
      {/* <AuthRedirect /> */}
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
