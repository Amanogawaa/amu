import { User2Icon } from 'lucide-react';
import React from 'react';

// TODO: here will be account settings and preferences management, where user will be able to update their profile and choose their profile image

// TODO: the image will be uploaded and displayed here, user can choose from a set of predefined images or upload their own

const AccountPage = () => {
  return (
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-5xl ">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <User2Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                  ACCOUNT
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountPage;
