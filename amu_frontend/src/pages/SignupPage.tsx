import { SignupForm } from "@/components/forms/signup-form";

const SignupPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-200px)] h-svh w-full items-center justify-center rounded-lg p-10 bg-Frosty_Whisper/20">
      <div className="flex max-w-4xl items-center">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto w-[350px] gap-6">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
