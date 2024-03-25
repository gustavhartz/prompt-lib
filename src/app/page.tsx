"use client";
import React, { useState, ChangeEvent } from "react";
import PageLayout from "../components/PageLayout"; // Adjust the path as necessary
import PromptList from "../components/PromptList";
import { samplePrompts } from "../utilities/samplePrompts"; // Ensure this import path is correct
import prisma from "../prisma";
import { Post, Prisma } from "@prisma/client"; // Assuming you have your Prisma client set up

interface HomeProps {
  prompts: ""; // Assuming your Post model corresponds to your prompts
}

export default function Home({ prompts }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle the search input change with proper typing
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Here you would typically debounce this function and call your API
    // to filter the prompts based on the search term.
    console.log("Search term:", event.target.value);
  };

  // Placeholder for a function to handle submitting a new prompt
  // This could open a modal, redirect to a form page, or inline form display
  const handleSubmitPrompt = () => {
    console.log("Submit prompt clicked");
    // Implement submission logic or redirection here
  };

  return (
    <PageLayout>
      <div className="container mx-auto my-8">
        <h1 className="text-center text-2xl font-bold mb-4">
          Trending Prompts
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Explore and contribute to the community-driven prompt library.
        </p>
        <div className="flex justify-between items-center mb-4">
          <input
            type="search"
            placeholder="Search prompts..."
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded-lg w-1/3" // Adjusted the width to 1/3 of the space
          />
          <button
            onClick={handleSubmitPrompt}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Submit Prompt
          </button>
        </div>
        <PromptList initialPrompts={samplePrompts} />
      </div>
    </PageLayout>
  );
}
