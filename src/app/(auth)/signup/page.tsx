'use client';

import RegistrationForm from '@/features/auth/presentation/RegistrationForm';
import { AuthRedirect } from '@/utils/AuthRedirect';

const SignupPage = () => {
  return (
    <>
      <AuthRedirect />
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-lg">
          <RegistrationForm />
        </div>
      </div>
    </>
  );
};

export default SignupPage;
