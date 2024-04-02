import React, { useState } from "react";
import Link from "next/link";
import { FaArrowDown, FaArrowUp, FaFlag } from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns"; // For "xx days ago" format
import { EnrichedPrompt } from "@/prisma/queries";

interface PromptItemProps {
  prompt: EnrichedPrompt;
}

const PromptItem: React.FC<PromptItemProps> = ({ prompt }) => {
  // The deep link to the prompt detail page
  const promptDetailPath = `/prompt/${prompt.id}`;

  // Voting logic
  const [voteCooldown, setVoteCooldown] = useState(false);
  const [localUpVotes, setLocalUpVotes] = useState(Number(prompt.upVotes));
  const [localDownVotes, setLocalDownVotes] = useState(
    Number(prompt.downVotes),
  );

  const handleVote = async (voteType: "UPVOTE" | "DOWNVOTE" | "REPORT") => {
    if (voteCooldown) {
      alert("Please wait before voting again.");
      return;
    }

    setVoteCooldown(true);
    setTimeout(() => setVoteCooldown(false), 5000); // 5 second cooldown

    try {
      const response = await fetch("api/prompt/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: prompt.id, vote: voteType }),
      });

      if (!response.ok) {
        // Handle response error
        const errorData = await response.json();
        alert(errorData.message || "An error occurred");
      } else {
        // Update local vote counts for instant feedback
        if (voteType === "UPVOTE") {
          setLocalUpVotes((current) => current + 1);
        } else if (voteType === "DOWNVOTE") {
          setLocalDownVotes((current) => current + 1);
        }
      }
    } catch (error) {
      console.error("Failed to submit vote", error);
      alert("Failed to submit vote");
    }
  };

  return (
    <div className="border-b border-gray-200 p-4 rounded-md shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div className="text-xs text-gray-500">
          Created by: {prompt.author} |{" "}
          {formatDistanceToNow(new Date(prompt.createdAt))} ago
        </div>
        <div className="flex overflow-x-auto gap-1">
          {prompt.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-blue-600 bg-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <Link href={promptDetailPath}>
        <div className="block mt-2">
          <h3 className="text-xl font-semibold break-words">{prompt.title}</h3>
        </div>
      </Link>
      <p className="text-gray-600 mt-2">{prompt.description}</p>
      <div className="flex items-center justify-start mt-4 border-t border-gray-200 pt-2">
        <button
          onClick={() => handleVote("UPVOTE")}
          className="flex items-center text-green-500 mr-4"
        >
          <FaArrowUp className="text-lg" />
          <span className="ml-1">{localUpVotes}</span>
        </button>
        <button
          onClick={() => handleVote("DOWNVOTE")}
          className="flex items-center text-red-500 mr-4"
        >
          <FaArrowDown className="text-lg" />
          <span className="ml-1">{localDownVotes}</span>
        </button>
        <button
          onClick={() => handleVote("REPORT")}
          className="flex items-center text-gray-500"
        >
          <FaFlag className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default PromptItem;
