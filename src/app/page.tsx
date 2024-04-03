import React from "react";
import PageLayout from "../components/PageLayout"; // Adjust the path as necessary
import { cache } from "react";
import { getPrompts, searchPrompts } from "@/prisma/queries";
import HeroSearch from "@/components/HeroSearch";
import PromptList from "@/components/PromptList";
import { logger } from "@/utils/logger";

interface HomeProps {
  searchParams: { query?: string; page?: string; results?: string };
}
export const getPromptsSSR = cache(
  async (query?: string, results?: number, page?: number) => {
    if (query) {
      return await searchPrompts(results, page, query);
    }
    return await getPrompts(results, page);
  },
);

export default async function Home(props: HomeProps) {
  const { query, results, page } = props.searchParams;
  // ensure results and page are numbers or default to 20 and 0
  let parsedResults = 20;
  let parsedPage = 0;
  try {
    parsedResults = parseInt(results || "20");
    parsedPage = parseInt(page || "0");
  } catch (e) {
    logger.error(e);
  }
  const topPrompts = await getPromptsSSR(query, parsedResults, parsedPage);

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
