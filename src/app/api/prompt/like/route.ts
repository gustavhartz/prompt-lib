import prisma from "@/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { logger } from "@/utils/logger";

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
  return new Response("success", { status: 200 });
};
