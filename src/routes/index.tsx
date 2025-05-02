import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <section className="min-h-svh w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center gap-4 p-4">
        <h1 className="text-4xl font-bold font-satoshi text-stone-700">
          welcome to amu: your ai course generator!
        </h1>
        <p className="text-lg font-inter text-stone-500 max-w-80 font-medium">
          master your studies with personalized ai tools—summaries, quizzes, and
          more!{" "}
        </p>
        <Button className=" bg-Evergreen_Dusk rounded-2xl cursor-pointer p-6 text-sm font-inter font-semibold text-white hover:bg-custom_foreground/80 hover:ease-in">
          get started
        </Button>
      </div>
    </section>
  );
}
