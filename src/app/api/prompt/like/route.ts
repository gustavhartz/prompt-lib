import prisma from "@/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { logger } from "@/utils/logger";

type PostPromptLikeRequest = {
  postId: string;
  action: "like" | "unlike";
};

export const POST = async (req: Request) => {
  logger.info("API: Prompt Like POST");
  const session = await getSession();
  const userId = session?.user.sub;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { postId: promptId, action }: PostPromptLikeRequest = await req.json();
  if (!promptId || !action || !["like", "unlike"].includes(action)) {
    return new Response("Missing required fields", { status: 400 });
  }

  if (action === "unlike") {
    await prisma.like.deleteMany({
      where: {
        postId: promptId,
        userId: userId,
      },
    });
    return new Response("success", { status: 200 });
  }
  await prisma.like.upsert({
    where: {
      postId_userId: {
        postId: promptId,
        userId: userId,
      },
    },
    update: {},
    create: {
      postId: promptId,
      userId: userId,
    },
  });
  return new Response("success", { status: 200 });
};
