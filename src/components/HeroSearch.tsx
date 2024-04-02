"use client";
import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { FaSearch } from "react-icons/fa"; // Importing search icon

const HeroSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter(); // Use the router for navigation

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle search submission
  const handleSubmitSearch = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Redirect user to search results page, passing searchTerm as query parameter
    // Adjust the path as needed for your search page
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  // Function to navigate to the submit prompt page
  const handleNavigateToSubmitPrompt = () => {
    router.push("/prompt/submit"); // Adjust the path as needed for your submit prompt page
  };

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-blue-200 to-blue-500 animate-gradient-x p-12 text-center rounded-lg shadow-md overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          The open source AI prompt library
        </h1>
        <p className="text-white text-opacity-80 mb-6">
          Discover, share, and vote on community posts for ChatGPT, MidJourney,
          Etc.
        </p>
        <form
          onSubmit={handleSubmitSearch}
          className="flex justify-center items-center"
        >
          <div className="relative w-full md:w-1/3">
            <input
              type="search"
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-4 pr-10 py-2 w-full border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-xl text-gray-500 hover:text-gray-700"
            >
              <FaSearch />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroSearch;
