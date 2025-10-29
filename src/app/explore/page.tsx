import { StarsIcon, User2Icon } from 'lucide-react';
import React from 'react';

// TODO: display only courses with published attr = true

const ExplorePage = () => {
  return (
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-5xl ">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <StarsIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                  EXPLORE COURSES
                </h1>
                <p className="text-muted-foreground text-lg">
                  Discover and explore a variety of courses tailored to your
                  interests and goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplorePage;
