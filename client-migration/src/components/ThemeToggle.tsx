"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Card, CardContent } from "./ui/card";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4 text-muted-foreground" />
        <Switch id="theme-toggle" disabled />
        <Moon className="h-4 w-4 text-muted" />
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Card className="flex items-center gap-2 w-full">
      <CardContent className="flex justify-between items-center w-full">
        <Label>Theme</Label>
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-muted-foreground dark:text-muted transition-colors" />
          <Switch
            id="theme-toggle"
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
          />
          <Moon className="h-4 w-4 text-muted dark:text-foreground transition-colors" />
          <Label htmlFor="theme-toggle" className="sr-only">
            Toggle theme
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
