import ChatInput from "./ChatInput";
import MessageList from "./MessageLists";

const ChatMessage = () => {
  return (
    <div className="relative flex flex-col justify-center w-full rounded-lg max-h-[630px] h-full">
      <MessageList />
      <div className="w-full sticky bottom-0  bg-Icy_Mist h-32">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatMessage;
