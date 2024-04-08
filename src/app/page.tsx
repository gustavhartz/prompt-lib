import React from "react";
import PageLayout from "../components/PageLayout"; // Adjust the path as necessary
import { cache } from "react";
import { getPrompts, searchPrompts } from "@/prisma/queries";
import HeroSearch from "@/components/HeroSearch";
import PromptList from "@/components/PromptList";
import { logger } from "@/utils/logger";
import Pagination from "@/components/Pagination";
import { getSession } from "@auth0/nextjs-auth0";
interface HomeProps {
  searchParams: { query?: string; page?: string; results?: string };
}
export const getPromptsSSR = cache(
  async (query?: string, results?: number, page?: number, userId?: string) => {
    if (query) {
      return await searchPrompts(results, page, query, userId);
    }
    let data = await getPrompts(results, page, userId);
    return data;
  },
);

export default async function Home(props: HomeProps) {
  const { query, results, page } = props.searchParams;
  // ensure results and page are numbers or default to 20 and 0
  let parsedResults = 20;
  let parsedPage = 0;
  try {
    parsedResults = parseInt(results || "20");
    // Page is 0 indexed
    parsedPage = parseInt(page || "1") - 1;
  } catch (e) {
    logger.error(e);
  }
  const user = await getSession();
  const { data, totalCount } = await getPromptsSSR(
    query,
    parsedResults,
    parsedPage,
    user?.user.sub,
  );

  return (
    <PageLayout>
      <div className="container mx-auto my-8 flex flex-col min-h-screen">
        <HeroSearch />
        <div className="mt-8 flex-1">
          <PromptList initialPrompts={data} />
          <Pagination
            totalCount={Number(totalCount)}
            pageSize={parsedResults}
            currentPage={parsedPage + 1}
          />
        </div>
      </div>
    </PageLayout>
  );
}
