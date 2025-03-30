import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowUp } from "lucide-react";
import { useFormState } from "react-dom";

const ChatInput = (onSendMessage: any): ReactNode => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="w-full flex flex-col mx-auto items-center justify-center min-h-28 h-fit bg-Frosty_Whisper px-2 py-3 rounded-4xl gap-2">
      <input
        type="text"
        placeholder="yahallo!, how can I help you?"
        aria-label="Type your message here"
        className="input w-full placeholder:text-lg text-base border-none`` focus:border-none focus:outline-none focus:ring-0 active:border-none active:outline-0 active:ring-0 bg-transparent text-black outline-0 ring-0 px-6"
      />
      <div className="w-full flex justify-end gap-1 items-center mr-10">
        <button className="rounded-full p-3.5 cursor-pointer hover:bg-tertiary-hover bg-white text-black">
          <ArrowUp className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
