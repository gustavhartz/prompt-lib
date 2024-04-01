"use client";
import React from "react";

interface PromptActionProps {
  prompt: string;
}

const PromptAction: React.FC<PromptActionProps> = ({ prompt }) => {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(prompt);
    // Replace alert with a more sophisticated feedback mechanism as needed
    alert("Copied to clipboard!");
  };
  console.log("PromptActionProps", prompt);

  return (
    <div className="px-4 pt-4 pb-2">
      <button
        onClick={copyToClipboard}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Copy Prompt
      </button>
    </div>
  );
};

export default PromptAction;
