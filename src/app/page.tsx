import React from "react";
import PageLayout from "../components/PageLayout"; // Adjust the path as necessary
import PromptsManager from "@/components/PromptManager";
import { cache } from "react";
import { getTopPrompts } from "@/prisma/rawQueries";

interface HomeProps {
  prompts: ""; // Assuming your Post model corresponds to your prompts
}
export const getPromptsSSR = cache(async () => {
  //TODO: relevant to the user with their likes etc.
  const item = await getTopPrompts(20, 0);
  return item;
});

export default async function Home({ prompts }: HomeProps) {
  const topPrompts = await getPromptsSSR();
  return (
    <PageLayout>
      <div className="container mx-auto my-8">
        <h1 className="text-center text-2xl font-bold mb-4">
          Trending Prompts
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Explore and contribute to the community-driven prompt library.
        </p>
        <PromptsManager initialPrompts={topPrompts} />
      </div>
    </PageLayout>
  );
}
