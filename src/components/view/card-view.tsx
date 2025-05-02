import { BookOpen, EllipsisVertical } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CourseCard = () => {
  return (
    <section className="flex h-full w-full py-5 px-3">
      <div className="container">
        <p className="mb-4 text-lg text-muted-foreground font-satoshi">
          your courses
        </p>
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-lg bg-accent p-5 flex flex-col gap-5">
            <div className="flex flex-col justify-center items-start gap-1">
              <div className="flex justify-between w-full">
                {" "}
                <Badge className="bg-white text-green-500 ">
                  beginner
                </Badge>{" "}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical className="w-4 h-4" />{" "}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>start course</DropdownMenuItem>
                    <DropdownMenuItem>delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h1 className="leading-7 text-muted-foreground text-base font-inter">
                intro to react: a beginner's guide
              </h1>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-satoshi">34 lesson</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-light font-inter">80%</span>
                <div className="w-10">
                  <div className="h-2 rounded-full overflow-hidden bg-gray-300">
                    <div className="h-full rounded-full bg-green-600 w-[75%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseCard;
