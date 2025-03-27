import { SigninForm } from "@/components/forms/signin-form";

const SigninPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-200px)] h-svh w-full items-center justify-center rounded-lg p-10 bg-Frosty_Whisper">
      <div className="flex max-w-4xl items-center">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto w-[350px] gap-6">
            <SigninForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
