"use client";
import React, { useState } from "react";
import {
  titleLengthCharLimit,
  tagsLengthCharLimit,
  descriptionLengthCharLimit,
  promptLengthCharLimit,
} from "@/app/api/prompt/route";

interface SubmitPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    prompt: string;
    tags: string[];
  }) => void;
  errorMessage: string;
}

const SubmitPromptModal: React.FC<SubmitPromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  errorMessage,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tags, setTags] = useState("");

  // Calculate remaining characters
  const remainingChars = {
    title: titleLengthCharLimit - title.length,
    description: descriptionLengthCharLimit - description.length,
    prompt: promptLengthCharLimit - prompt.length,
    tags: tagsLengthCharLimit - tags.length,
  };

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    onSubmit({ title, description, prompt, tags: tagsArray });
  };

  // Function to generate input classes based on character limit
  const getInputClasses = (remaining: number) =>
    `input w-full rounded ${
      remaining < 0 ? "border-red-500" : "border-gray-300"
    } border-2`;

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-2">
        <div className="border-b px-4 py-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Submit New Prompt</h3>
          <button onClick={onClose} className="text-black hover:text-red-500">
            &#10005;
          </button>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-center mt-2">{errorMessage}</p>
        )}
        <form onSubmit={handleFormSubmit} className="space-y-4 p-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={getInputClasses(remainingChars.title)}
              maxLength={titleLengthCharLimit}
            />
            <p
              className={`text-xs ${
                remainingChars.title < 0 ? "text-red-500" : "text-gray-500"
              } text-right`}
            >
              {remainingChars.title} characters left
            </p>
          </div>
          <div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={getInputClasses(remainingChars.description)}
              maxLength={descriptionLengthCharLimit}
            />
            <p
              className={`text-xs ${
                remainingChars.description < 0
                  ? "text-red-500"
                  : "text-gray-500"
              } text-right`}
            >
              {remainingChars.description} characters left
            </p>
          </div>
          <div>
            <textarea
              placeholder="Prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={getInputClasses(remainingChars.prompt)}
              maxLength={promptLengthCharLimit}
            />
            <p
              className={`text-xs ${
                remainingChars.prompt < 0 ? "text-red-500" : "text-gray-500"
              } text-right`}
            >
              {remainingChars.prompt} characters left
            </p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={getInputClasses(remainingChars.tags)}
              maxLength={tagsLengthCharLimit}
            />
            <p
              className={`text-xs ${
                remainingChars.tags < 0 ? "text-red-500" : "text-gray-500"
              } text-right`}
            >
              {remainingChars.tags} characters left
            </p>
          </div>
          <button
            type="submit"
            className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Submit Prompt
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitPromptModal;
