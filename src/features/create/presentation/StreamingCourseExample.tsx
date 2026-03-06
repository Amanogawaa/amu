"use client";

import { useState } from "react";
import { useStreamingGeneration } from "../application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Example component showing how to use streaming course generation
 * The streaming window will appear automatically and show real-time AI output
 */
export function StreamingCourseExample() {
  const { generateWithStreaming, isLoading } = useStreamingGeneration();

  const [formData, setFormData] = useState({
    topic: "react hooks",
    category: "Programming",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    duration: "1 hour",
    noOfChapters: 1,
    language: "English",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const course = await generateWithStreaming(formData);
      console.log("Course generated:", course);
      // You can navigate to the course or show a success message
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="topic">Course Topic</Label>
        <Input
          id="topic"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          placeholder="e.g., React Hooks"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          placeholder="e.g., Programming"
          required
        />
      </div>

      <div>
        <Label htmlFor="level">Level</Label>
        <Select
          value={formData.level}
          onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
            setFormData({ ...formData, level: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
          placeholder="e.g., 4 hours"
          required
        />
      </div>

      <div>
        <Label htmlFor="chapters">Number of Chapters</Label>
        <Input
          id="chapters"
          type="number"
          min={1}
          max={20}
          value={formData.noOfChapters}
          onChange={(e) =>
            setFormData({ ...formData, noOfChapters: parseInt(e.target.value) })
          }
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Generating..." : "Generate Course with Streaming"}
      </Button>

      <p className="text-sm text-muted-foreground">
        The streaming window will appear in the bottom-left corner showing
        real-time AI output as your course is being generated.
      </p>
    </form>
  );
}
