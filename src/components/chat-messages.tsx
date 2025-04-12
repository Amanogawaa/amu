import React from "react";

const ChatMessages = () => {
  const messages = [
    {
      id: 1,
      text: "Can be verified on any platform using docker lorem ipsum dolor sit amet, consectetur adipiscing elit.Can be verified on any platform using docker lorem ipsum dolor sit amet, consectetur adipiscing elitCan be verified on any platform using docker lorem ipsum dolor sit amet, consectetur adipiscing elitCan be verified on any platform using docker lorem ipsum dolor sit amet, consectetur adipiscing elitCan be verified on any platform using docker lorem ipsum dolor sit amet, consectetur adipiscing elitCan be verified on any platform using docker lorem ipsum dolor sit amet, consectetur adipiscing elitCan be verified on any platform using docker lorem ipsum dolor sit amet, consectetur adipiscing elit",
      isUser: false,
    },
    {
      id: 2,
      text: "Your error message says permission denied, npm global installs must be given root privileges.",
      isUser: true,
    },
    {
      id: 3,
      text: "Have you tried running it with sudo?",
      isUser: false,
    },
    {
      id: 4,
      text: "Yeah, but I’m hesitant to use sudo for npm installs.",
      isUser: true,
    },
    {
      id: 5,
      text: "You could try using nvm to manage node versions instead.",
      isUser: false,
    },
    {
      id: 6,
      text: "That sounds promising! How do I set it up?",
      isUser: true,
    },
    {
      id: 7,
      text: "Just run: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash",
      isUser: false,
    },
    {
      id: 8,
      text: "Got it, installing now.",
      isUser: true,
    },
    {
      id: 9,
      text: "After that, you can install node with: nvm install node",
      isUser: false,
    },
    {
      id: 10,
      text: "Worked like a charm! Thanks!",
      isUser: true,
    },
    {
      id: 11,
      text: "No problem! Anything else you need help with?",
      isUser: false,
    },
    {
      id: 12,
      text: "Actually, I’m getting a weird error with my React build.",
      isUser: true,
    },
    {
      id: 13,
      text: "Can you share the error message?",
      isUser: false,
    },
    {
      id: 14,
      text: "It says: 'Module not found: Error: Can’t resolve './src/App''",
      isUser: true,
    },
    {
      id: 15,
      text: "Check if your App.js file exists in the src folder and the case matches.",
      isUser: false,
    },
    {
      id: 16,
      text: "Ugh, silly typo. Fixed it, thanks!",
      isUser: true,
    },
    {
      id: 17,
      text: "Happens to the best of us! All good now?",
      isUser: false,
    },
    {
      id: 18,
      text: "Yep, build’s running smoothly.",
      isUser: true,
    },
    {
      id: 19,
      text: "Awesome! Let me know if you hit any other snags.",
      isUser: false,
    },
    {
      id: 20,
      text: "Will do, appreciate the help!",
      isUser: true,
    },
  ];

  const messagePairs = [];
  for (let i = 0; i < messages.length; i += 2) {
    messagePairs.push([messages[i], messages[i + 1]].filter(Boolean));
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-8 overflow-y-auto min-h-screen">
      {messagePairs.map((pair, index) => (
        <div key={index} className="flex flex-col space-y-4">
          {pair.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col py-5 ${
                message.isUser ? "items-end order-1" : "items-start order-2"
              }`}
            >
              <div
                className={` p-4 ${
                  message.isUser
                    ? "text-right text-gray-800 font-medium bg-stone-300 w-fit rounded-lg "
                    : "text-left text-gray-900 font-medium w-ful"
                }`}
              >
                <p className="text-base leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}
          <div className="w-full border-b border-gray-200" />
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
