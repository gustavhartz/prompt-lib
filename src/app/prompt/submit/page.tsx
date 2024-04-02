"use client";
import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import {
  titleLengthCharLimit,
  tagsLengthCharLimit,
  descriptionLengthCharLimit,
  promptLengthCharLimit,
} from "@/app/api/prompt/route";
import PageLayout from "@/components/PageLayout";
import { useUser } from "@auth0/nextjs-auth0/client";

const SubmitPromptPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tags, setTags] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { user, isLoading } = useUser();

  // if user is not authenticated, redirect to login page
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    router.push("/api/auth/login");
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    try {
      // Adjust API endpoint as necessary
      const response = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, prompt, tags: tagsArray }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "An error occurred");
        return;
      }

      // Redirect to a success page or the main page after successful submission
      router.push("/");
    } catch (error) {
      setErrorMessage("Failed to submit prompt");
    }
  };

  // Utility function to get input classes based on character limits
  const getInputClasses = (remaining: number) =>
    `w-full rounded border-2 p-2 ${
      remaining < 0 ? "border-red-500" : "border-blue-200"
    }`;

  return (
    <PageLayout>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow text-gray-700">
        <h1 className="text-2xl font-bold mb-4">Submit a New Prompt</h1>
        <p className="text-m mb-4">
          If you want the credit of your submission please sign in first
        </p>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              className={getInputClasses(titleLengthCharLimit - title.length)}
            />
            <div className="text-right text-xs">
              {titleLengthCharLimit - title.length} characters left
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              className={getInputClasses(
                descriptionLengthCharLimit - description.length,
              )}
            />
            <div className="text-right text-xs">
              {descriptionLengthCharLimit - description.length} characters left
            </div>
          </div>
          <div>
            <label htmlFor="prompt" className="block">
              Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setPrompt(e.target.value)
              }
              className={getInputClasses(promptLengthCharLimit - prompt.length)}
            />
            <div className="text-right text-xs">
              {promptLengthCharLimit - prompt.length} characters left
            </div>
          </div>
          <div>
            <label htmlFor="tags" className="block">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTags(e.target.value)
              }
              className={getInputClasses(tagsLengthCharLimit - tags.length)}
            />
            <div className="text-right text-xs">
              {tagsLengthCharLimit - tags.length} characters left
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default SubmitPromptPage;
