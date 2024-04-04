import React from "react";
import PromptItem from "./PromptItem";
import { EnrichedPrompt } from "@/prisma/queries";

interface PromptListProps {
  initialPrompts: EnrichedPrompt[];
}

const PromptList: React.FC<PromptListProps> = ({ initialPrompts }) => {
  const prompts = initialPrompts;

  return (
    <div>
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="mb-4 transform transition duration-200 ease-in-out bg-white border border-gray-200 rounded hover:scale-105 hover:bg-gray-50"
        >
          <PromptItem prompt={prompt} />
        </div>
      ))}
    </div>
  );
};

export default PromptList;
