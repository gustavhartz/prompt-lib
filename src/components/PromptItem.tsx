// components/PromptItem.tsx
import React from "react";
import Link from "next/link"; // Import the Link component from Next.js
import {
  FaRegHeart,
  FaHeart,
  FaArrowDown,
  FaArrowUp,
  FaFlag,
} from "react-icons/fa6";
import { EnrichedPrompt } from "@/prisma/queries";

interface PromptItemProps {
  prompt: EnrichedPrompt;
  // Functions to handle upvote, downvote, and favorite could be passed as props
}

const PromptItem: React.FC<PromptItemProps> = ({ prompt }) => {
  // Placeholder functions - you'll need to replace these with real implementations
  const handleUpvote = () => console.log("Upvoted");
  const handleDownvote = () => console.log("Downvoted");
  const handleFavorite = () => console.log("Favorited");
  const handleFlag = () => console.log("Flagged");

  // redirect path
  const promptDetailPath = `/prompt/${prompt.id}`;
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <Link
          href={promptDetailPath}
          className="flex items-center space-x-4 flex-1"
        >
          <div className="ml-4 flex-1">
            <h3 className="text-xl font-semibold">
              {prompt.title}
              <span className="text-xs text-gray-500 font-normal ml-2">
                {prompt.author}
              </span>
            </h3>
            <p className="text-gray-600">{prompt.description}</p>
            <div className="flex mt-2">
              {prompt.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-blue-600 bg-blue-200 last:mr-0 mr-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleFavorite}
          className={`text-2xl ${
            prompt.isFavorite ? "text-red-500" : "text-gray-400"
          } transition-transform transform hover:scale-110`}
        >
          {prompt.isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
        <button
          onClick={handleUpvote}
          className="text-green-500 flex items-center transition-transform transform hover:scale-110"
        >
          <FaArrowUp className="text-xl" />
          <span className="text-sm font-bold ml-1">{prompt.upVotes}</span>
        </button>
        <button
          onClick={handleDownvote}
          className="text-red-500 flex items-center transition-transform transform hover:scale-110"
        >
          <FaArrowDown className="text-xl" />
          <span className="text-sm font-bold ml-1">{prompt.downVotes}</span>
        </button>
        <button
          onClick={handleFlag}
          className="text-gray-500 text-xl transition-transform transform hover:scale-110"
        >
          <FaFlag />
        </button>
      </div>
    </div>
  );
};

export default PromptItem;
