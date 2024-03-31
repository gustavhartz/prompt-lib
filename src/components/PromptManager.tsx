"use client";
import React, { useState, ChangeEvent } from "react";
import PromptList from "./PromptList"; // Adjust import path as needed
import { EnrichedPrompt } from "@/prisma/queries";
import SubmitPromptModal from "./SubmitPromptModal"; // Adjust the import path

interface PromptsManagerProps {
  initialPrompts?: EnrichedPrompt[];
}

const PromptsManager: React.FC<PromptsManagerProps> = ({
  initialPrompts = [],
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [prompts, setPrompts] = useState<EnrichedPrompt[]>(initialPrompts);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Placeholder for a function to handle submitting a new prompt
  // This could open a modal, redirect to a form page, or inline form display
  const handleSubmitPrompt = () => {
    setModalOpen(true);
  };

  // Filter prompts based on search term
  const filteredPrompts = prompts.filter((prompt) =>
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleModalSubmit = async (data: {
    title: string;
    description: string;
    prompt: string;
    tags: string[];
  }) => {
    try {
      const response = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "An error occurred");
        return;
      }

      // Handle success (e.g., close modal, clear error message, refresh prompts)
      setModalOpen(false);
      setErrorMessage("");
      // Refresh your prompts list to include the newly added prompt
    } catch (error) {
      setErrorMessage("Failed to submit prompt");
    }
  };

  return (
    <>
      <SubmitPromptModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        errorMessage={errorMessage}
      />
      <div>
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
      </div>
    </>
  );
};

export default PromptsManager;
