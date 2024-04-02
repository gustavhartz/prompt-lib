import React, { cache } from "react";
import PromptAction from "@/components/PromptAction";
import { redirect } from "next/navigation";
import { getPrompt } from "@/prisma/queries";
import PageLayout from "@/components/PageLayout";

export const getPromptsSSR = cache(async (promptid: string) => {
  //TODO: relevant to the user with their likes etc.
  const prompt = getPrompt(promptid);

  return prompt;
});

export default async function Page({
  params,
}: {
  params: { promptid: string };
}) {
  const data = await getPromptsSSR(params.promptid);
  // fake wait 10 seconds and then log the data
  const entry = data[0];

  if (!entry) {
    return redirect("/404");
  }

  return (
    <PageLayout>
      <div className="p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4">
            <h1 className="font-bold text-2xl mb-2 text-blue-600">
              {entry.title}
            </h1>
            <p className="text-gray-700 text-base mb-4">{entry.description}</p>
            <p className="text-gray-600 text-sm">By: {entry.author}</p>
          </div>
          <div className="px-6 py-4 bg-blue-50 text-gray-800">
            <pre className="whitespace-pre-wrap">{entry.prompt}</pre>
          </div>
          <PromptAction prompt={entry.prompt} />
          <div className="px-6 py-4 bg-gray-100 text-sm text-gray-600">
            Upvotes: {entry.upVotes} | Downvotes: {entry.downVotes}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
