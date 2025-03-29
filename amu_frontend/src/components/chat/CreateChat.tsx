import React, { ReactNode } from "react";
import { SquarePen } from "lucide-react";

const CreateChat = (): ReactNode => {
  return (
    <button className="group bg-transparent hover:bg-custom_foreground/80 cursor-pointer rounded-full p-2.5">
      <SquarePen className="group-hover:text-white w-5 h-5 text-custom_foreground " />
    </button>
  );
};

export default CreateChat;
