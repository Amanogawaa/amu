import { ChatDialog } from "@/components/chat/ChatDialog";
import ChatInput from "@/components/chat/ChatInput";
import CreateChat from "@/components/chat/CreateChat";
import MessageList from "@/components/chat/MessageLists";
import UserProfile from "@/components/chat/UserProfile";

const Chat = () => {
  return (
    <main className="bg-Frosty_Whisper/20 w-full flex flex-col justify-center items-center min-w-full p-5 pb-0 pt-0 overflow-y-hidden">
      <div className="flex justify-between gap-2 fixed top-5 right-5 left-5">
        <div className="flex justify-between items-center w-full max-w-[calc(100vw-2.5rem)] mx-auto">
          <h1>logo here</h1>
          <div className="flex gap-0.5 items-center">
            <CreateChat />
            <ChatDialog />
            <UserProfile />
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl flex flex-col max-h-[630px]">
        <MessageList />
        <ChatInput />
      </div>
    </main>
  );
};

export default Chat;
