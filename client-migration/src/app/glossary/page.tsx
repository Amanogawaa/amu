import { Navbar } from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technical Glossary | CourseCraft',
  description:
    'A comprehensive reference of technical terms and concepts used in software development and online learning platforms.',
};

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  examples?: string[];
}

const glossaryTerms: GlossaryTerm[] = [
  // Development & Programming
  {
    term: 'API (Application Programming Interface)',
    definition:
      'A set of rules and protocols that allows different software applications to communicate with each other. It defines the methods and data structures that developers can use to interact with a service or library.',
    category: 'Development',
    examples: ['REST API', 'GraphQL API', 'Firebase API'],
  },
  {
    term: 'Capstone Project',
    definition:
      'A comprehensive final project that demonstrates mastery of all skills learned throughout a course. It synthesizes knowledge from multiple modules into a single practical application.',
    category: 'Education',
  },
  {
    term: 'CRUD Operations',
    definition:
      'The four basic operations for managing data: Create (add new data), Read (retrieve data), Update (modify existing data), and Delete (remove data).',
    category: 'Development',
    examples: [
      'Creating a user account',
      'Reading user profile',
      'Updating settings',
      'Deleting a post',
    ],
  },
  {
    term: 'Deliverables',
    definition:
      'The tangible outputs or artifacts that must be submitted upon completion of a project, such as code repositories, documentation, or deployed applications.',
    category: 'Education',
  },
  {
    term: 'Deployment',
    definition:
      'The process of making a software application available for use in a production environment, typically involving uploading code to a server or cloud platform.',
    category: 'Development',
    examples: ['Vercel deployment', 'Render deployment', 'AWS deployment'],
  },
  {
    term: 'Evaluation Criteria',
    definition:
      'Specific standards or metrics used to assess the quality and completeness of a project, often with assigned weights indicating relative importance.',
    category: 'Education',
  },
  {
    term: 'Framework',
    definition:
      'A pre-built foundation of code that provides structure and common functionality for developing applications, allowing developers to focus on unique features rather than basic infrastructure.',
    category: 'Development',
    examples: ['React', 'Next.js', 'Express', 'Django'],
  },
  {
    term: 'Learning Objectives',
    definition:
      'Specific, measurable goals that describe what students should be able to do or understand after completing a lesson or module.',
    category: 'Education',
  },
  {
    term: 'Middleware',
    definition:
      'Software that acts as a bridge between different applications or components, often processing requests before they reach their final destination.',
    category: 'Development',
    examples: [
      'Authentication middleware',
      'Logging middleware',
      'Error handling middleware',
    ],
  },
  {
    term: 'Module',
    definition:
      'A self-contained unit of a course that focuses on a specific topic or skill area, typically containing multiple chapters or lessons.',
    category: 'Education',
  },
  {
    term: 'Prerequisites',
    definition:
      'Knowledge, skills, or conditions that must be met before starting a particular lesson, module, or project.',
    category: 'Education',
  },
  {
    term: 'Repository (Repo)',
    definition:
      'A central location where code and related files are stored, managed, and version-controlled, typically using systems like Git.',
    category: 'Development',
    examples: ['GitHub repository', 'GitLab repository'],
  },
  {
    term: 'REST (Representational State Transfer)',
    definition:
      'An architectural style for designing networked applications, using standard HTTP methods (GET, POST, PUT, DELETE) to interact with resources.',
    category: 'Development',
  },
  {
    term: 'Schema',
    definition:
      'A blueprint or structure that defines how data should be organized, including data types, relationships, and constraints.',
    category: 'Development',
    examples: ['Database schema', 'JSON schema', 'GraphQL schema'],
  },
  {
    term: 'SDK (Software Development Kit)',
    definition:
      'A collection of tools, libraries, documentation, and code samples that help developers build applications for a specific platform or service.',
    category: 'Development',
    examples: ['Firebase SDK', 'Google Cloud SDK', 'AWS SDK'],
  },

  // Technical Infrastructure
  {
    term: 'Authentication',
    definition:
      'The process of verifying the identity of a user or system, typically through credentials like username and password.',
    category: 'Security',
  },
  {
    term: 'Authorization',
    definition:
      'The process of determining what actions or resources an authenticated user is allowed to access.',
    category: 'Security',
  },
  {
    term: 'Backend',
    definition:
      'The server-side portion of an application that handles data processing, business logic, and database interactions, invisible to end users.',
    category: 'Architecture',
  },
  {
    term: 'CI/CD (Continuous Integration/Continuous Deployment)',
    definition:
      'Automated practices for regularly integrating code changes and deploying them to production environments.',
    category: 'DevOps',
  },
  {
    term: 'Container',
    definition:
      'A lightweight, standalone package that includes everything needed to run a piece of software, ensuring consistency across different environments.',
    category: 'DevOps',
    examples: ['Docker container', 'Kubernetes pod'],
  },
  {
    term: 'Database',
    definition:
      'An organized collection of structured data stored electronically, allowing for efficient storage, retrieval, and manipulation.',
    category: 'Data',
    examples: ['PostgreSQL', 'MongoDB', 'MySQL', 'Firebase'],
  },
  {
    term: 'Environment Variables',
    definition:
      'Configuration values stored outside of code that can change between different environments (development, staging, production), often containing sensitive information.',
    category: 'Configuration',
  },
  {
    term: 'Frontend',
    definition:
      'The client-side portion of an application that users interact with directly, including the user interface and user experience elements.',
    category: 'Architecture',
  },
  {
    term: 'JSON (JavaScript Object Notation)',
    definition:
      'A lightweight data format used for storing and exchanging data, easy for both humans to read and machines to parse.',
    category: 'Data',
  },
  {
    term: 'ORM (Object-Relational Mapping)',
    definition:
      'A technique that allows developers to interact with databases using object-oriented programming concepts rather than writing SQL queries directly.',
    category: 'Development',
  },

  // AI & Machine Learning
  {
    term: 'AI (Artificial Intelligence)',
    definition:
      'Computer systems designed to perform tasks that typically require human intelligence, such as learning, reasoning, and problem-solving.',
    category: 'AI/ML',
  },
  {
    term: 'Model',
    definition:
      'In machine learning, a trained algorithm that can make predictions or decisions based on input data.',
    category: 'AI/ML',
    examples: ['Language model', 'Prediction model', 'Classification model'],
  },
  {
    term: 'Prompt',
    definition:
      'Input text or instructions given to an AI system to generate a specific response or perform a task.',
    category: 'AI/ML',
  },
  {
    term: 'Training Data',
    definition:
      'The dataset used to teach a machine learning model by showing it examples of inputs and desired outputs.',
    category: 'AI/ML',
  },

  // Web Development
  {
    term: 'Component',
    definition:
      'A reusable, self-contained piece of code that represents a part of the user interface, typically in modern web frameworks.',
    category: 'Web Development',
  },
  {
    term: 'DOM (Document Object Model)',
    definition:
      'A programming interface that represents the structure of a web page as a tree of objects, allowing scripts to dynamically access and update content.',
    category: 'Web Development',
  },
  {
    term: 'Responsive Design',
    definition:
      'An approach to web design that ensures websites look and function well across different screen sizes and devices.',
    category: 'Web Development',
  },
  {
    term: 'Server-Side Rendering (SSR)',
    definition:
      'A technique where web pages are generated on the server before being sent to the client, improving initial load time and SEO.',
    category: 'Web Development',
  },
  {
    term: 'State Management',
    definition:
      'The practice of managing and synchronizing data across different parts of an application, ensuring consistency.',
    category: 'Web Development',
    examples: ['React State', 'Redux', 'Zustand'],
  },

  // Data Science & Analytics
  {
    term: 'Data Preprocessing',
    definition:
      'The process of cleaning, transforming, and organizing raw data into a format suitable for analysis or machine learning.',
    category: 'Data Science',
  },
  {
    term: 'Visualization',
    definition:
      'The graphical representation of data and information using visual elements like charts, graphs, and maps.',
    category: 'Data Science',
  },

  // Software Engineering Practices
  {
    term: 'Agile',
    definition:
      'A project management methodology that emphasizes iterative development, flexibility, and collaboration.',
    category: 'Methodology',
  },
  {
    term: 'Code Review',
    definition:
      'The systematic examination of source code by peers to identify bugs, improve quality, and share knowledge.',
    category: 'Best Practices',
  },
  {
    term: 'Debug',
    definition:
      'The process of identifying, analyzing, and fixing errors or bugs in software code.',
    category: 'Development',
  },
  {
    term: 'Refactoring',
    definition:
      'Restructuring existing code to improve its design, readability, or performance without changing its external behavior.',
    category: 'Best Practices',
  },
  {
    term: 'Version Control',
    definition:
      'A system that tracks changes to files over time, allowing developers to collaborate and maintain a history of modifications.',
    category: 'Development',
    examples: ['Git', 'GitHub', 'GitLab'],
  },

  // Performance & Optimization
  {
    term: 'Caching',
    definition:
      'Storing frequently accessed data in a temporary storage location for faster retrieval, improving application performance.',
    category: 'Performance',
  },
  {
    term: 'Lazy Loading',
    definition:
      'A design pattern that delays loading resources until they are actually needed, improving initial page load time.',
    category: 'Performance',
  },
  {
    term: 'Rate Limiting',
    definition:
      'Controlling the number of requests a user or system can make to an API within a specific time period to prevent abuse.',
    category: 'Performance',
  },

  // General Technical Terms
  {
    term: 'Edge Case',
    definition:
      'An unusual or extreme scenario that occurs at the boundaries of operating parameters, often requiring special handling.',
    category: 'Development',
  },
  {
    term: 'Scalability',
    definition:
      "A system's ability to handle increased load or growth without compromising performance or requiring significant redesign.",
    category: 'Architecture',
  },
  {
    term: 'Technical Debt',
    definition:
      'The implied cost of future rework caused by choosing quick or easy solutions now instead of better approaches that would take longer.',
    category: 'Best Practices',
  },
  {
    term: 'Webhook',
    definition:
      'A method for one application to send real-time data to another application when a specific event occurs.',
    category: 'Development',
  },
];

const categories = Array.from(
  new Set(glossaryTerms.map((term) => term.category))
).sort();

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="bg-gradient-to-b from-background to-muted/40">
        {/* Header Section */}
        <section className="relative overflow-hidden px-6 py-20">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.25),_transparent_55%)]" />
          <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              <BookOpen className="h-4 w-4" />
              Technical Glossary
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Technical Terms Reference
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              A comprehensive guide to technical terms and concepts used
              throughout CourseCraft. Clear definitions to help you understand
              the language of software development and online learning.
            </p>
          </div>
        </section>

        {/* Glossary Content */}
        <section className="px-6 py-16">
          <div className="mx-auto w-full max-w-5xl">
            {/* Categories Navigation */}
            <div className="mb-12 rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <a
                    key={category}
                    href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center rounded-full border border-border/60 bg-background px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                  >
                    {category}
                  </a>
                ))}
              </div>
            </div>

            {/* Terms by Category */}
            <div className="space-y-12">
              {categories.map((category) => {
                const termsInCategory = glossaryTerms.filter(
                  (term) => term.category === category
                );
                return (
                  <div
                    key={category}
                    id={category.toLowerCase().replace(/\s+/g, '-')}
                  >
                    <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-border flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {termsInCategory.length}
                      </span>
                      {category}
                    </h2>
                    <div className="space-y-6">
                      {termsInCategory.map(({ term, definition, examples }) => (
                        <article
                          key={term}
                          className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
                        >
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {term}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-3">
                            {definition}
                          </p>
                          {examples && examples.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                Examples:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {examples.map((example) => (
                                  <span
                                    key={example}
                                    className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                                  >
                                    {example}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back to Top */}
            <div className="mt-16 text-center">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                ↑ Back to top
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
