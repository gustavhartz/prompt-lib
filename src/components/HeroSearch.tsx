"use client";
import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation"; // Import useRouter for navigation
import { FaSearch } from "react-icons/fa"; // Importing search icon
import HeroSection from "./HeroSection";

const HeroSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter(); // Use the router for navigation

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Function to handle search submission
  const handleSubmitSearch = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Redirect user to search results page, passing searchTerm as query parameter
    // Adjust the path as needed for your search page
    const params = new URLSearchParams(searchParams);
    const term = searchTerm;
    if (term) {
      params.set("query", term);
      params.delete("page");
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Function to navigate to the submit prompt page
  const handleNavigateToSubmitPrompt = () => {
    router.push("/prompt/submit"); // Adjust the path as needed for your submit prompt page
  };

  return (
    <HeroSection
      title="The open source AI prompt library"
      description="Discover, share, and vote on community posts for ChatGPT, MidJourney, Etc."
    >
      <form
        onSubmit={handleSubmitSearch}
        className="flex justify-center items-center"
      >
        <div className="relative w-full md:w-1/3">
          <input
            type="search"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => {
              handleSearchChange(e.target.value);
            }}
            defaultValue={searchParams.get("query")?.toString()}
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
      <button
        onClick={handleNavigateToSubmitPrompt}
        className="bg-green-500 hover:bg-green-700 mt-4 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Submit Prompt
      </button>
    </HeroSection>
  );
};

export default HeroSearch;
