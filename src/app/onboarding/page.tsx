"use client";
import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Onboarding() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let res = await fetch("/api/management/onboarding", {
        method: "POST",
        body: JSON.stringify({ username: username }),
      });
      let json = await res.json();
      if (res.status === 200) {
        toast.success("Username submitted!");
        router.push("/");
      } else {
        toast.error(json.message);
      }
    } catch (e) {
      toast.error("Failed to submit username");
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Welcome to PromptLib!</h1>
        <p>Please choose a username to complete your profile:</p>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className="border p-2 rounded-lg mr-2"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </PageLayout>
  );
}
