import prisma from "@/prisma";
import { logger } from "@/utils/logger";
import { getSession } from "@auth0/nextjs-auth0";
import { VoteType } from "@prisma/client";

type PostPromptVoteRequest = {
  promptId: string;
  vote: VoteType;
};

export const POST = async (req: Request) => {
  logger.info("API: Prompt Vote POST");
  const { promptId, vote }: PostPromptVoteRequest = await req.json();
  // validate input
  if (!promptId || !vote) {
    return new Response("Missing required fields", { status: 400 });
  }

  // validate vote
  if (!Object.values(VoteType).includes(vote)) {
    return new Response("Invalid vote", { status: 400 });
  }

  // anonymous voting is allowed
  const session = await getSession();
  const userId = session?.user.sub;

  await prisma.vote.create({
    data: {
      postId: promptId,
      userId: userId,
      value: vote,
    },
  });
  return new Response("", { status: 200 });
};
