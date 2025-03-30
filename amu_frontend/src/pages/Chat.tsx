import { ChatDialog } from "@/components/chat/ChatDialog";
import ChatInput from "@/components/chat/ChatInput";
import CreateChat from "@/components/chat/CreateChat";
import MessageList from "@/components/chat/MessageLists";
import UserProfile from "@/components/chat/UserProfile";

const Chat = () => {
  return (
    <main className=" w-full min-h-svh flex flex-col justify-start items-center overflow-y-auto">
      <div className="flex justify-between gap-2 fixed top-0 left-0 right-0 z-50 sm:top-5 sm:right-5 sm:left-5 px-4 py-2 max-sm:bg-Frosty_Whisper/30 max-sm:backdrop-blur-xl sm:bg-transparent">
        <div className="flex justify-between items-center w-full max-w-[calc(100vw-2.5rem)] mx-auto">
          <h1>logo here</h1>
          <div className="flex gap-0.5 items-center">
            <CreateChat />
            <ChatDialog />
            <UserProfile />
          </div>
        </div>
      </div>

      <div className="w-full relative max-w-[90%] sm:max-w-3xl md:max-w-4xl h-screen flex flex-col z-20 mt-16  min-h-[calc(100vh-5rem)] ">
        <div className="flex-1 overflow-y-auto">
          <MessageList />
        </div>
        <div className="fixed bottom-0 left-0 min-md:max-w-[100%] xl:max-w-[70%] max-sm:w-full mx-auto right-0 z-10 py-1.5 px-4 sm:px-6 md:px-8">
          <ChatInput />
        </div>
      </div>
    </main>
  );
};

export default Chat;
