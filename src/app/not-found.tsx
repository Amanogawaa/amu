'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileQuestion, Home, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularCourses = [
    { name: 'Introduction to Programming', href: '/explore' },
    { name: 'Web Development Basics', href: '/explore' },
    { name: 'Data Structures', href: '/explore' },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* 404 Animation */}
        <div className="relative">
          <div className="text-[150px] font-bold text-primary/10 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-primary/10 p-8">
              <FileQuestion className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/explore">
              <Search className="h-4 w-4" />
              Explore Courses
            </Link>
          </Button>
        </div>

        {/* Popular Courses */}
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-3">
            Or explore these popular topics:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularCourses.map((course, index) => (
              <Link
                key={index}
                href={course.href}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm"
              >
                {course.name}
                <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
