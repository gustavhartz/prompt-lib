// samplePrompts.ts
import { Prompt } from "../interfaces/Prompt";
import PageLayout from "../components/PageLayout"; // Adjust the path as necessary

const samplePrompts: Prompt[] = [
  {
    id: 1,
    rank: 1,
    title: "The Philosophical Paradox",
    description: "A prompt that explores the famous Ship of Theseus paradox.",
    tags: ["philosophy", "paradox", "thought-experiment"],
    upVotes: 120,
    downVotes: 10,
    userVote: 0,
    isFavorite: false,
    author: "User123",
  },
  {
    id: 2,
    rank: 2,
    title: "The Ultimate Recipe Generator",
    description:
      "This prompt asks the AI to create unique recipes based on the ingredients in your pantry.",
    tags: ["cooking", "AI", "creativity"],
    upVotes: 95,
    downVotes: 5,
    userVote: 1,
    isFavorite: true,
    author: "ChefAI",
  },
  {
    id: 3,
    rank: 3,
    title: "The Time Travel Conundrum",
    description:
      "A narrative prompt challenging the AI to construct a story where time travel creates a closed causal loop.",
    tags: ["science-fiction", "time-travel", "storytelling"],
    upVotes: 87,
    downVotes: 3,
    userVote: -1,
    isFavorite: false,
    author: "SciFiFan42",
  },
  // ... add more samples as needed
];
// pages/index.tsx
import React from "react";
import PromptList from "../components/PromptList";

export default function Home() {
  const loadMorePrompts = () => {
    // Here you would typically update the state with the new prompts fetched from the API
    console.log("Load more prompts");
  };

  return (
    <PageLayout>
      <div className="container mx-auto my-8">
        <PromptList initialPrompts={samplePrompts} />
      </div>
    </PageLayout>
  );
}
