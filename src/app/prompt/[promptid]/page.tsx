import React, { cache } from "react";
import { redirect } from "next/navigation";
import { getPrompt } from "@/prisma/queries";
import PageLayout from "@/components/PageLayout";
import PromptMetadata from "@/components/Prompt/PromptMetadata";
import PromptContent from "@/components/Prompt/PromptContent";
import PromptActionBar from "@/components/Prompt/PromptActionBar";
import { getSession } from "@auth0/nextjs-auth0";

export const getPromptsSSR = cache(async (promptid: string) => {
  //TODO: relevant to the user with their likes etc.
  const user = await getSession();
  const prompt = await getPrompt(promptid, user?.user.sub);

  return prompt;
});

export default async function Page({
  params,
}: {
  params: { promptid: string };
}) {
  const data = await getPromptsSSR(params.promptid);
  // fake wait 10 seconds and then log the data
  const prompt = data[0];

  if (!prompt) {
    return redirect("/404");
  }

  return (
    <PageLayout>
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <PromptMetadata
          author={prompt.author}
          createdAt={prompt.createdAt}
          tags={prompt.tags}
        />
        <PromptContent
          title={prompt.title}
          description={prompt.description}
          prompt={prompt.prompt}
        />
        <PromptActionBar
          promptId={prompt.id}
          initialUpVotes={Number(prompt.upVotes)}
          initialDownVotes={Number(prompt.downVotes)}
          isLiked={prompt.isLiked}
        />
      </div>
    </PageLayout>
  );
}
