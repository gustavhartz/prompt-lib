import prisma from "@/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { VoteType } from "@prisma/client";

type VotePromtRequest = {
  promptId: string;
  vote: VoteType;
};

export const POST = async (req: Request) => {
  //TODO: vote on prompt
  const { promptId, vote }: VotePromtRequest = await req.json();
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
