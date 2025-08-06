import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFileRoute } from "@tanstack/react-router";
import { SendIcon } from "lucide-react";
import { useId } from "react";

export const Route = createFileRoute("/amu/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const id = useId();
  return (
    <main className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center w-full h-full gap-2 p-4 border border-muted">
        <h1 className="text-3xl font-satoshi font-medium text-Evergreen_Dusk">
          what can i help you to learn today?
        </h1>
        <p className="text-lg font-satoshi text-Winter_Teal">
          enter a topic below to generate a personalized course for it
        </p>
        <div className="*:not-first:mt-2 max-w-xl w-full">
          <div className="relative">
            <Input
              id={id}
              className="pe-10 ps-5 py-8 px-4 rounded-full"
              placeholder="e.g. intro to python"
              type="text"
            />
            <button
              className="text-muted-foreground/80 hover:text-Evergreen_Dusk focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-5 flex h-full w-9  items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="course generator"
            >
              <SendIcon size={16} aria-hidden="true" />
            </button>
          </div>
          <Select>
            <SelectTrigger className="rounded-full mx-auto focus-visible:ring-2 focus-visible:ring-Evergreen_Dusk/50">
              <SelectValue placeholder="difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">beginner</SelectItem>
              <SelectItem value="intermidiate">intermidiate</SelectItem>
              <SelectItem value="advanced">advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </main>
  );
}
