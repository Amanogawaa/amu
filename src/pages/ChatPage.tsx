import ChatHeader from "@/components/chat-header";
import ChatInput from "@/components/chat-input";
import ChatMessages from "@/components/chat-messages";

const ChatPage = () => {
  return (
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen w-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 mx-auto w-full max-w-[900px] py-4 ">
        <ChatMessages />
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatPage;
