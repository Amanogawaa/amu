import { IconCirclePlusFilled } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function CourseNavBar({
  items,
}: {
  items: {
    id: string;
    title: string;
    content: string;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="3"
              >
                {items.map((item) => (
                  <AccordionItem value={item.id} key={item.id} className="py-2">
                    <AccordionTrigger className="py-2 text-sm font-satoshi leading-6 hover:no-underline">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-2">
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
