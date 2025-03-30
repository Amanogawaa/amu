import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

const MessageList = (): ReactNode => {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! How can I help you today?",
      isSent: true,
      timestamp: "2 minutes ago",
    },
    {
      text: "I'm having trouble with my order. Can you help me?",
      isSent: false,
      timestamp: "1 minute ago",
    },
    {
      text: "Hi there! How can I help you today?",
      isSent: true,
      timestamp: "2 minutes ago",
    },
    {
      text: "I'm having trouble with my order. Can you help me?",
      isSent: false,
      timestamp: "1 minute ago",
    },
    {
      text: "Hi there! How can I help you today?",
      isSent: true,
      timestamp: "2 minutes ago",
    },
    {
      text: "I'm having trouble with my order. Can you help me?",
      isSent: false,
      timestamp: "1 minute ago",
    },
    {
      text: "Hi there! How can I help you today?",
      isSent: true,
      timestamp: "2 minutes ago",
    },
    {
      text: "Hi there! How can I help you today?",
      isSent: true,
      timestamp: "2 minutes ago",
    },
    {
      text: "Hi there! How can I help you today?",
      isSent: true,
      timestamp: "2 minutes ago",
    },
    {
      text: "Hi there! How can I help you today?",
      isSent: true,
      timestamp: "2 minutes ago",
    },
    {
      text: "Hi there! How can I help you today?",
      isSent: true,
      timestamp: "2 minutes ago",
    },
    {
      text: "Hi there! How can I help you today?",
      isSent: true,
      timestamp: "2 minutes ago",
    },
    {
      text: "I'm having trouble with my order. Can you help me?",
      isSent: false,
      timestamp: "1 minute ago",
    },
    {
      text: "I'm having trouble with my order. Can you help me?",
      isSent: false,
      timestamp: "1 minute ago",
    },
    {
      text: "I'm having trouble with my order. Can you help me?",
      isSent: false,
      timestamp: "1 minute ago",
    },
    {
      text: "I'm having trouble with my order. Can you help me?",
      isSent: false,
      timestamp: "1 minute ago",
    },
    {
      text: "I'm having trouble with my order. Can you help me?",
      isSent: false,
      timestamp: "1 minute ago",
    },
  ]);

  return (
    <div className="flex flex-1 p-4 flex-col flex-grow-1 min-h-screen w-full pb-[144px]">
      <div className="space-y-4">
        {messages.map((message: any, index: any) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.isSent ? "items-end" : "items-start"
            } space-y-2`}
          >
            <div className="rounded-lg text-Evergreen_Dusk bg-Icy_Mist p-4">
              <div className="text-sm text-Evergreen_Dusk font-normal">
                {message.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
