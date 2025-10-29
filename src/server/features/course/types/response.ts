export type Course = {
  id: string;
  name: string;
  description: string;
  category: string;
  level: string;
  topic: string;
  prequisites: string;
  language: string;
  learning_outcomes: string[];
  duration: string;
  no_of_chapters: number;
  banner_url: string;
  include_certificate: boolean;
  publish: boolean;
  subtitle: string;
  created_at: Date;
  updated_at: Date;
};

export type ListCoursesResponse = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Course[];
};
