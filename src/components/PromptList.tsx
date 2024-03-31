"use client";
import React, { useState, useEffect } from "react";
import PromptItem from "./PromptItem";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import the loading icon
import { EnrichedPrompt } from "@/prisma/queries";

interface PromptListProps {
  initialPrompts: EnrichedPrompt[];
}

const PromptList: React.FC<PromptListProps> = ({ initialPrompts }) => {
  const [prompts, setPrompts] = useState<EnrichedPrompt[]>(initialPrompts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // State to track if more items are available

  useEffect(() => {
    const onScroll = async () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        // Adjusted for better trigger
        setIsLoading(true);
        // Mock fetch function (replace with your API call)
        const newPrompts = await fetchMorePrompts();
        if (newPrompts.length === 0) {
          setHasMore(false); // No more prompts to load
        } else {
          setPrompts((prevPrompts) => [...prevPrompts, ...newPrompts]);
        }
        setIsLoading(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Placeholder function to simulate fetching more prompts
  const fetchMorePrompts = async (): Promise<EnrichedPrompt[]> => {
    // Replace with your API call
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Mock loading delay
    return []; // Return an empty array to simulate no more prompts
  };

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
      {isLoading && (
        <div className="flex justify-center items-center">
          <AiOutlineLoading3Quarters className="animate-spin text-xl" />
        </div>
      )}
      {!hasMore && !isLoading && (
        <div className="text-center text-gray-500 text-sm mt-4">
          You have reached the end
        </div>
      )}
    </div>
  );
};

export default PromptList;
