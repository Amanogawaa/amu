"use client";

import { CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

interface LessonArticleContentProps {
  content: string;
}

export const LessonArticleContent = ({
  content,
}: LessonArticleContentProps) => {
  return (
    <CardContent className="pt-6">
      <div
        className="prose prose-slate dark:prose-invert max-w-none 
          prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-xl prose-pre:overflow-x-auto
          prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-img:rounded-lg prose-img:shadow-md"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              const isInline = !match;

              if (isInline) {
                return (
                  <code
                    className="rounded bg-muted text-foreground font-medium"
                    {...rest}
                  >
                    {children}
                  </code>
                );
              }

              const codeString = String(children).replace(/\n$/, "");

              return (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1] || "text"}
                  PreTag="div"
                  showLineNumbers={true}
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.75rem",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    padding: "1rem",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                    },
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </CardContent>
  );
};
