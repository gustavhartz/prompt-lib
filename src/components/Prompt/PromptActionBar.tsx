"use client";
import React, { useState } from "react";
import { FaArrowDown, FaArrowUp, FaFlag } from "react-icons/fa6";
import { VoteType } from "@prisma/client";
import toast from "react-hot-toast";

interface PromptActionBarProps {
  promptId: string;
  initialUpVotes: number;
  initialDownVotes: number;
}

const PromptActionBar: React.FC<PromptActionBarProps> = ({
  promptId,
  initialUpVotes,
  initialDownVotes,
}) => {
  const [voteCooldown, setVoteCooldown] = useState(false);
  const [localUpVotes, setLocalUpVotes] = useState(initialUpVotes);
  const [localDownVotes, setLocalDownVotes] = useState(initialDownVotes);

  const handleVote = async (voteType: VoteType) => {
    if (voteCooldown) {
      toast.error("Please wait 5 seconds before voting again");
      return;
    }

    setVoteCooldown(true);
    setTimeout(() => setVoteCooldown(false), 5000); // 5 second cooldown

    try {
      const response = await fetch("/api/prompt/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId,
          vote: voteType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "An error occurred");
        return;
      }

      if (voteType === "UPVOTE") {
        setLocalUpVotes((current) => current + 1);
      } else if (voteType === "DOWNVOTE") {
        setLocalDownVotes((current) => current + 1);
      }
      // Reporting logic can be implemented or handled differently as needed
    } catch (error) {
      console.error("Failed to submit vote", error);
      toast.error("Failed to submit vote");
    }
  };

  return (
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
        <span className="ml-1">Report</span>
      </button>
    </div>
  );
};

export default PromptActionBar;
