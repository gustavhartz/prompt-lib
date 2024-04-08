"use client";
import React, { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaFlag,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa6";
import toast from "react-hot-toast";
import { VoteType } from "@prisma/client";

interface PromptActionBarProps {
  promptId: string;
  initialUpVotes: number;
  initialDownVotes: number;
  isLiked: boolean; // Assume this is passed as a prop for simplicity
}

const PromptActionBar: React.FC<PromptActionBarProps> = ({
  promptId,
  initialUpVotes,
  initialDownVotes,
  isLiked: initialIsLiked,
}) => {
  const [voteCooldown, setVoteCooldown] = useState(false);
  const [localUpVotes, setLocalUpVotes] = useState(initialUpVotes);
  const [localDownVotes, setLocalDownVotes] = useState(initialDownVotes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

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
      toast.error("Failed to submit vote");
    }
  };

  const handleLike = async () => {
    try {
      const action = isLiked ? "unlike" : "like";
      const response = await fetch("/api/prompt/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: promptId,
          action,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "An error occurred");
        return;
      }

      setIsLiked(!isLiked);
      toast.success(`Prompt ${isLiked ? "unliked" : "liked"} successfully`);
    } catch (error) {
      toast.error("Failed to like/unlike prompt");
    }
  };

  return (
    <div className="flex items-center justify-start mt-4 border-t border-gray-200 pt-2 space-x-4">
      {/* Like button */}
      <button onClick={handleLike} className="flex items-center">
        {isLiked ? (
          <FaHeart className="text-red-500 text-lg" />
        ) : (
          <FaRegHeart className="text-lg" />
        )}
        <span className="ml-1">Like</span>
      </button>

      {/* Upvote and Downvote buttons remain unchanged */}
      <button
        onClick={() => handleVote("UPVOTE")}
        className="flex items-center text-green-500"
      >
        <FaArrowUp className="text-lg" />
        <span className="ml-1">{localUpVotes}</span>
      </button>
      <button
        onClick={() => handleVote("DOWNVOTE")}
        className="flex items-center text-red-500"
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
  );
};

export default PromptActionBar;
