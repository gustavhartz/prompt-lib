"use client";
import React, { useState, ChangeEvent } from "react";
import PromptList from "./PromptList"; // Adjust import path as needed
import { Prompt } from "../interfaces/Prompt";

interface PromptsManagerProps {
  initialPrompts?: Prompt[];
}

const PromptsManager: React.FC<PromptsManagerProps> = ({
  initialPrompts = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Placeholder for a function to handle submitting a new prompt
  // This could open a modal, redirect to a form page, or inline form display
  const handleSubmitPrompt = () => {
    console.log("Submit prompt clicked");
    // Implement submission logic or redirection here
  };

  // Filter prompts based on search term
  const filteredPrompts = prompts.filter((prompt) =>
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <input
          type="search"
          placeholder="Search prompts..."
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-lg w-1/3"
        />
        <button
          onClick={handleSubmitPrompt}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Submit Prompt
        </button>
      </div>
      <PromptList initialPrompts={filteredPrompts} />
    </>
  );
};

export default PromptsManager;
