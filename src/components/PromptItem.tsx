import React from "react";
import { EnrichedPrompt } from "@/prisma/queries";
import PromptMetadata from "./Prompt/PromptMetadata";
import PromptContent from "./Prompt/PromptContent";
import PromptActionBar from "./Prompt/PromptActionBar";

interface PromptItemProps {
  prompt: EnrichedPrompt;
}

const PromptItem: React.FC<PromptItemProps> = ({ prompt }) => {
  // The deep link to the prompt detail page
  const promptDetailPath = `/prompt/${prompt.id}`;

  return (
    <div className="border-b border-gray-200 p-4 rounded-md shadow-sm bg-white">
      <PromptMetadata
        author={prompt.author}
        createdAt={prompt.createdAt}
        tags={prompt.tags}
      />
      <PromptContent
        title={prompt.title}
        description={prompt.description}
        link={promptDetailPath}
      />
      <p className="text-gray-600 mt-2">{prompt.description}</p>
      <PromptActionBar
        promptId={prompt.id}
        initialUpVotes={Number(prompt.upVotes)}
        initialDownVotes={Number(prompt.downVotes)}
      />
    </div>
  );
};

export default PromptItem;
