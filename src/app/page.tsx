import React from "react";
import PageLayout from "../components/PageLayout"; // Adjust the path as necessary
import { cache } from "react";
import { getPrompts } from "@/prisma/queries";
import { getSession } from "@auth0/nextjs-auth0";
import HeroSearch from "@/components/HeroSearch";
import PromptList from "@/components/PromptList";

interface HomeProps {
  prompts: ""; // Assuming your Post model corresponds to your prompts
}
export const getPromptsSSR = cache(async () => {
  //TODO: relevant to the user with their likes etc.
  const prompts = await getPrompts(20, 0);

  return prompts;
});

export default async function Home({ prompts }: HomeProps) {
  const topPrompts = await getPromptsSSR();
  return (
    <PageLayout>
      <div className="container mx-auto my-8 flex flex-col min-h-screen">
        <HeroSearch />
        <div className="mt-8 flex-1">
          <PromptList initialPrompts={topPrompts} />
        </div>
      </div>
    </PageLayout>
  );
}
