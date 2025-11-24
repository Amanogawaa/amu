"use client"

import RegistrationForm from "@/features/auth/presentation/RegistrationForm";

const SignupPage = () => {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default SignupPage;
