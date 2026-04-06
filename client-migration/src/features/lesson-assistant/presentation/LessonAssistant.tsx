"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Bot, MessageSquare, Send, Sparkles, Trash2, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLessonAssistant } from "../application/useLessonAssistant";

interface LessonAssistantProps {
  lessonId: string;
  lessonTitle?: string;
}

export const LessonAssistant = ({
  lessonId,
  lessonTitle,
}: LessonAssistantProps) => {
  const {
    messages,
    isLoading,
    isInitializing,
    suggestedQuestions,
    sendMessage,
    clearMessages,
  } = useLessonAssistant(lessonId);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 z-50"
          title="Open Lesson Assistant"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col h-screen overflow-hidden">
        <SheetHeader className="p-6 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <SheetTitle>Lesson Assistant</SheetTitle>
              <SheetDescription>
                {lessonTitle
                  ? `Get help with "${lessonTitle}"`
                  : "Ask questions about this lesson"}
              </SheetDescription>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearMessages}
                title="Clear conversation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SheetHeader>
        <Separator className="flex-shrink-0" />

        {/* Messages Area - Scrollable */}
        <ScrollArea className="flex-1 overflow-hidden">
          <div className="p-6 h-full flex flex-col">
            {isInitializing ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Bot className="h-12 w-12 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    Initializing Assistant...
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Setting up your personalized lesson assistant
                  </p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="p-4 rounded-full bg-primary/10">
                  <MessageSquare className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="font-semibold text-lg">
                    How can I help you today?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ask me anything about this lesson, request explanations, or
                    get examples to better understand the concepts.
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <p className="text-sm font-medium text-left">Try asking:</p>
                  <div className="flex flex-col gap-2">
                    {suggestedQuestions.map((question) => (
                      <Button
                        key={question.id}
                        variant="outline"
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleSuggestedQuestion(question.text)}
                        disabled={isInitializing}
                      >
                        <span className="text-sm">{question.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <Card
                      className={cn(
                        "p-4 max-w-[80%]",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                        {message.role === "assistant" &&
                          isLoading &&
                          message.id.startsWith("temp-assistant") && (
                            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
                          )}
                      </p>
                      <p
                        className={cn(
                          "text-xs mt-2",
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </Card>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background flex-shrink-0">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about this lesson..."
              className="resize-none min-h-[20px] h-full"
              disabled={isLoading || isInitializing}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || isInitializing}
              size="icon"
              className="h-[60px] w-[60px] flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
