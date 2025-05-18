import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/course/")({
  component: RouteComponent,
});

const items = [
  {
    id: 1,
    duration: "20 minutes",
    course: "Web Development",
    chapterNumber: 1,
    chapterTitle: "Introduction to HTML",
    image: "/avatar-40-01.jpg",
  },
  {
    id: 2,
    duration: "30 minutes",
    course: "Web Development",
    chapterNumber: 2,
    chapterTitle: "Styling with CSS",
    image: "/avatar-40-02.jpg",
  },
  {
    id: 3,
    duration: "25 minutes",
    course: "JavaScript Basics",
    chapterNumber: 1,
    chapterTitle: "Variables and Data Types",
    image: "/avatar-40-03.jpg",
  },
  {
    id: 4,
    duration: "35 minutes",
    course: "JavaScript Basics",
    chapterNumber: 2,
    chapterTitle: "Functions and Scope",
    image: "/avatar-40-05.jpg",
  },
];

function RouteComponent() {
  return (
    <section className="p-5">
      <Timeline>
        {items.map((item) => (
          <TimelineItem
            key={item.id}
            step={item.id}
            className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-8"
          >
            <TimelineHeader>
              <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
              <TimelineTitle className="mt-0.5 inline-flex justify-between items-center w-full">
                {item.chapterTitle}{" "}
                <span className="text-muted-foreground text-sm font-normal inline-flex items-center gap-0.5">
                  <Clock className="w-4 h-4" />
                  {item.duration}
                </span>
              </TimelineTitle>
              <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                {/* <img
                  src={item.image}
                  alt={item.title}
                  className="size-6 rounded-full"
                /> */}
                {item.id}
              </TimelineIndicator>
            </TimelineHeader>
            <TimelineContent className="text-foreground mt-2 rounded-lg border px-4 py-3">
              {item.chapterTitle}
              <TimelineDate className="mt-1 mb-0">{item.duration}</TimelineDate>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
