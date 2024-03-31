import prisma from "@/prisma";
import {
  EnrichedPrompt,
  getPrompt,
  getPrompts,
  searchPrompts,
} from "@/prisma/queries";
import { getSession } from "@auth0/nextjs-auth0";

export const titleLengthCharLimit = 100;
export const descriptionLengthCharLimit = 500;
export const promptLengthCharLimit = 4 * 3200;
export const tagsCountLimit = 10;
export const tagsLengthCharLimit = 40 * tagsCountLimit;

export type GetPromptRequest = {
  promptId?: string;
  query?: string;
  page: number;
  results: number;
};

export type PostPromptRequest = {
  title: string;
  description: string;
  prompt: string;
  tags: string[];
};

export const GET = async (req: Request) => {
  //TODO: Return prompt
  const { promptId, query, page, results }: GetPromptRequest = await req.json();

  if (promptId && query) {
    return new Response("Cannot have both promptId and query", { status: 400 });
  }
  let data: EnrichedPrompt | EnrichedPrompt[];
  if (query) {
    data = await searchPrompts(results, page, query);
  }
  if (promptId) {
    data = await getPrompt(promptId);
  }
  data = await getPrompts(results, page);
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST = async (req: Request) => {
  //TODO: Save prompt / Create new prompt
  const { title, description, prompt, tags }: PostPromptRequest =
    await req.json();
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  // validate input
  if (!title || !description || !prompt || !tags) {
    return new Response("Missing required fields", { status: 400 });
  }
  // validate prompt requirements
  if (title.length > titleLengthCharLimit) {
    return new Response("Title is too long", { status: 400 });
  }
  if (description.length > descriptionLengthCharLimit) {
    return new Response("Description is too long", { status: 400 });
  }
  if (prompt.length > promptLengthCharLimit) {
    return new Response("Prompt is too long. Limit is 4*3200 chars", {
      status: 400,
    });
  }
  if (
    tags.length > tagsCountLimit ||
    tags.some((tag) => tag.length > tagsLengthCharLimit)
  ) {
    return new Response(
      "Too many tags - Limit is 10. Or too long tags - limit is 40 chars",
      { status: 400 },
    );
  }

  await prisma.post.create({
    data: {
      title,
      description,
      prompt,
      tags,
      authorId: session.user.sub,
    },
  });

  return new Response("", { status: 200 });
};
