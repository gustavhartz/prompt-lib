import PageLayout from "../../components/PageLayout"; // Adjust the path as necessary
import React, { cache } from "react";
import { getLikedPrompts } from "@/prisma/queries";
import PromptList from "@/components/PromptList";
import { logger } from "@/utils/logger";
import Pagination from "@/components/Pagination";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import HeroLikes from "@/components/HeroLikes";

interface HomeProps {
  searchParams: { page?: string; results?: string };
}

export const getPromptsSSR = cache(async (results?: number, page?: number) => {
  let user = await getSession();
  if (user?.user.sub) {
    return await getLikedPrompts(user.user.sub, results, page);
  } else {
    redirect("/api/auth/login");
  }
});

export default async function Home(props: HomeProps) {
  const { results, page } = props.searchParams;
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
  const { data, totalCount } = await getPromptsSSR(parsedResults, parsedPage);

  return (
    <PageLayout>
      <div className="container mx-auto my-8 flex flex-col min-h-screen">
        <HeroLikes />
        <div className="mt-8 flex-1">
          {Number(totalCount) === 0 && (
            <div className="text-center text-lg text-gray-500">
              No liked prompts found.
            </div>
          )}
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
