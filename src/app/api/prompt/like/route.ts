import prisma from "@/prisma";
import { getLikedPrompts } from "@/prisma/queries";
import { getSession } from "@auth0/nextjs-auth0";
import { logger } from "@/utils/logger";

type GetPromptLikeRequest = {
  promptId: string;
  results: number;
  page: number;
};

export const GET = async (req: Request) => {
  logger.info("API: Prompt Like GET");
  // validate input
  const { promptId, results, page }: GetPromptLikeRequest = await req.json();

  if (!promptId) {
    return new Response("Missing required fields", { status: 400 });
  }

  // get all liked prompts
  const session = await getSession();
  const userId = session?.user.sub;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // get liked prompts ids
  let data = await getLikedPrompts(results, page, userId);

  return new Response(JSON.stringify(data), { status: 200 });
};

type PostPromptLikeRequest = {
  postId: string;
};

export const POST = async (req: Request) => {
  logger.info("API: Prompt Like POST");
  const session = await getSession();
  const userId = session?.user.sub;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { postId: promptId }: PostPromptLikeRequest = await req.json();
  if (!promptId) {
    return new Response("Missing required fields", { status: 400 });
  }

  // create like
  await prisma.like.create({
    data: {
      postId: promptId,
      userId: userId,
    },
  });
  return new Response("", { status: 200 });
};
